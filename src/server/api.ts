import { Hono } from "hono";
import { getEditorialDashboard, recordEditorialEvent } from "./analytics";
import { createUser, login, logout, requireRole, requireUser } from "./auth";
import {
  createCategory,
  createPost,
  deleteCategory,
  deletePost,
  getPost,
  getPublishedBySlug,
  listCategories,
  listPosts,
  updateCategory,
  updatePost,
} from "./cms";
import {
  conversionDashboard,
  createCTA,
  createLeadMagnet,
  getDynamicCTA,
  getLeadMagnet,
  getLeadMagnets,
  listInterests,
  recordConversionEvent,
  subscribeWithInterests,
} from "./conversion";
import {
  activeOwnerCount,
  listUsers,
  revokeAllUserSessions,
  setUserActive,
  writeAudit,
} from "./db";
import { scheduleSiteDeploy } from "./deploy";
import {
  createComment,
  getPostTags,
  listApprovedComments,
  listComments,
  listNewsletterSubscribers,
  listTags,
  moderateComment,
  subscribeNewsletter,
} from "./editorial";
import { deleteMedia, listMedia, uploadMedia } from "./media";
import { createPublicFeedback, createPublicLead } from "./public-forms";
import {
  clearRateLimit,
  constantTimeEqual,
  consumeRateLimit,
  hashPassword,
  normalizeEmail,
  sha256,
  validPassword,
} from "./security";
import type { AuthUser, Env } from "./types";
import { auditWorkflowQueue, dispatchEvent, registerEvent } from "./workflows";

export const api = new Hono<{ Bindings: Env }>();

api.use("*", async (c, next) => {
  const requestId = c.req.header("CF-Ray") || crypto.randomUUID();
  c.header("X-Request-ID", requestId);
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  const origin = c.req.header("Origin");
  if (origin && c.env.APP_URL) {
    try {
      if (new URL(origin).origin === new URL(c.env.APP_URL).origin) {
        c.header("Access-Control-Allow-Origin", origin);
        c.header("Vary", "Origin");
        c.header(
          "Access-Control-Allow-Methods",
          "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        );
        c.header(
          "Access-Control-Allow-Headers",
          "Content-Type, X-Bootstrap-Token",
        );
        c.header("Access-Control-Allow-Credentials", "true");
      }
    } catch {}
  }
  if (c.req.method === "OPTIONS") return c.body(null, 204);
  await next();
});
api.use("/admin/*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});
api.use("/auth/*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});

const CMS_ROLES = ["owner", "admin", "editor"] as const;
function cmsRole(user: any): user is AuthUser {
  return !!user && requireRole(user, CMS_ROLES as any);
}
function publishRole(user: AuthUser) {
  return requireRole(user, ["owner", "admin"]);
}
function jsonBody(c: any) {
  return c.req.json().catch(() => ({}));
}
function trustedOrigin(c: any) {
  const origin = c.req.header("Origin");
  if (!origin) return true;
  try {
    const incoming = new URL(origin);
    const requestUrl = new URL(c.req.url);
    if (incoming.origin === requestUrl.origin) return true;
    if (c.env.APP_URL && incoming.origin === new URL(c.env.APP_URL).origin)
      return true;
    return false;
  } catch {
    return false;
  }
}
function safeMetadata(value: unknown, maxBytes = 4096) {
  if (value == null) return undefined;
  const json = JSON.stringify(value);
  if (json.length > maxBytes) throw new Error("metadata_too_large");
  return value;
}
function requestTooLarge(c: any, maxBytes: number) {
  const len = Number(c.req.header("Content-Length") || 0);
  return Number.isFinite(len) && len > maxBytes;
}
async function enforcePublicRateLimit(
  c: any,
  scope: string,
  limit: number,
  windowSeconds = 60,
) {
  const ip = String(c.req.header("CF-Connecting-IP") || "unknown");
  const key = `public:${scope}:${await sha256(ip)}`;
  const result = await consumeRateLimit(c.env.DB, key, {
    limit,
    windowSeconds,
    blockSeconds: windowSeconds,
  });
  if (!result.allowed) c.header("Retry-After", String(result.retryAfter));
  return result.allowed;
}

api.post("/blog/analytics/events", async (c) => {
  try {
    if (!(await enforcePublicRateLimit(c, "analytics", 120)))
      return c.json({ error: "too_many_requests" }, 429);
    if (requestTooLarge(c, 16384))
      return c.json({ error: "payload_too_large" }, 413);
    const body = await c.req.json<any>().catch(() => ({}));
    const eventName = String(body.eventName || "");
    const visitorId = String(body.visitorId || "").slice(0, 160);
    if (!visitorId || !eventName)
      return c.json({ error: "event_name_and_visitor_id_required" }, 400);
    await recordEditorialEvent(c.env, {
      eventName,
      postId: body.postId ? String(body.postId) : undefined,
      sessionId: body.sessionId
        ? String(body.sessionId).slice(0, 160)
        : undefined,
      visitorId,
      path: String(body.path || c.req.header("Referer") || "").slice(0, 500),
      referrer: String(body.referrer || "").slice(0, 500),
      progress: body.progress,
      durationMs: body.durationMs,
      metadata: safeMetadata(body.metadata),
    });
    return c.json({ ok: true }, 201);
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "analytics_event_failed") },
      400,
    );
  }
});
api.get("/admin/analytics/editorial", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  return c.json(
    await getEditorialDashboard(c.env, Number(c.req.query("days") || 30)),
  );
});

api.get("/blog/interests", async (c) =>
  c.json({ items: await listInterests(c.env) }),
);
api.get("/blog/lead-magnets", async (c) =>
  c.json({ items: await getLeadMagnets(c.env) }),
);
api.get("/blog/lead-magnets/:slug", async (c) => {
  const m = await getLeadMagnet(c.env, c.req.param("slug"));
  return m
    ? c.json({ magnet: m })
    : c.json({ error: "lead_magnet_not_found" }, 404);
});
api.get("/blog/ctas", async (c) => {
  const postId = String(c.req.query("postId") || "");
  const categoryId = String(c.req.query("categoryId") || "");
  const categorySlug = String(c.req.query("categorySlug") || "");
  if (!postId || !categoryId || !categorySlug)
    return c.json({ error: "postId_categoryId_categorySlug_required" }, 400);
  return c.json({
    cta: await getDynamicCTA(c.env, postId, categoryId, categorySlug),
  });
});
api.post("/newsletter/subscribe-interest", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    if (!(await enforcePublicRateLimit(c, "newsletter-interest", 5, 3600)))
      return c.json({ error: "too_many_requests" }, 429);
    const b = await c.req.json<any>().catch(() => ({}));
    if (b.consent !== true && b.consent !== "true")
      return c.json({ error: "consent_required" }, 400);
    return c.json(
      await subscribeWithInterests(
        c.env,
        String(b.email || ""),
        String(b.source || "content"),
        Array.isArray(b.interests) ? b.interests : [],
      ),
      201,
    );
  } catch (e: any) {
    return c.json({ error: String(e?.message || "newsletter_failed") }, 400);
  }
});
api.post("/blog/conversion/events", async (c) => {
  try {
    if (!(await enforcePublicRateLimit(c, "conversion", 120)))
      return c.json({ error: "too_many_requests" }, 429);
    if (requestTooLarge(c, 16384))
      return c.json({ error: "payload_too_large" }, 413);
    const b = await c.req.json<any>().catch(() => ({}));
    const visitorId = String(b.visitorId || "");
    const eventName = String(b.eventName || "");
    if (!visitorId || !eventName)
      return c.json({ error: "event_name_and_visitor_id_required" }, 400);
    await recordConversionEvent(c.env, {
      eventName,
      postId: b.postId ? String(b.postId) : undefined,
      visitorId,
      sessionId: b.sessionId ? String(b.sessionId) : undefined,
      path: String(b.path || "").slice(0, 500),
      metadata: safeMetadata(b.metadata),
    });
    return c.json({ ok: true }, 201);
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "conversion_event_failed") },
      400,
    );
  }
});
api.get("/blog/categories", async (c) =>
  c.json({ items: await listCategories(c.env) }),
);
api.get("/blog/posts", async (c) => {
  const status = c.req.query("status");
  if (status && status !== "published") {
    const user = await requireUser(c);
    if (!cmsRole(user)) return c.json({ error: "forbidden" }, 403);
  }
  return c.json({
    items: await listPosts(c.env, {
      status: status || "published",
      categoryId: c.req.query("categoryId"),
      search: c.req.query("search"),
      limit: Number(c.req.query("limit") || 20),
      offset: Number(c.req.query("offset") || 0),
      publicOnly: !status || status === "published",
    }),
  });
});
api.get("/blog/posts/slug/:slug", async (c) => {
  const post = await getPublishedBySlug(c.env, c.req.param("slug"));
  return post ? c.json({ post }) : c.json({ error: "post_not_found" }, 404);
});
api.get("/blog/tags", async (c) => c.json({ items: await listTags(c.env) }));
api.get("/blog/posts/:id/tags", async (c) =>
  c.json({ items: await getPostTags(c.env, c.req.param("id")) }),
);
api.get("/blog/posts/:id/comments", async (c) =>
  c.json({ items: await listApprovedComments(c.env, c.req.param("id")) }),
);
api.post("/blog/comments", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  const body = await c.req.json<any>().catch(() => ({}));
  try {
    const ip = String(c.req.header("CF-Connecting-IP") || "");
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip + "|dejotacode"),
    );
    const ipHash = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return c.json(
      await createComment(c.env, {
        postId: String(body.post_id || ""),
        name: String(body.name || ""),
        email: String(body.email || ""),
        body: String(body.body || ""),
        ipHash,
        userAgent: String(c.req.header("User-Agent") || ""),
        honeypot: String(body.website || ""),
      }),
      201,
    );
  } catch (e: any) {
    return c.json({ error: String(e?.message || "comment_failed") }, 400);
  }
});
api.post("/newsletter/subscribe", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  const body = await c.req.json<any>().catch(() => ({}));
  try {
    if (!(await enforcePublicRateLimit(c, "newsletter", 5, 3600)))
      return c.json({ error: "too_many_requests" }, 429);
    if (body.consent !== true && body.consent !== "true")
      return c.json({ error: "consent_required" }, 400);
    return c.json(
      await subscribeNewsletter(
        c.env,
        String(body.email || ""),
        String(body.source || "blog"),
      ),
      201,
    );
  } catch (e: any) {
    return c.json({ error: String(e?.message || "newsletter_failed") }, 400);
  }
});

api.post("/public/briefing", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  if (requestTooLarge(c, 16384))
    return c.json({ error: "payload_too_large" }, 413);
  try {
    const body = await c.req.json<any>().catch(() => ({}));
    if (body.consent !== true && body.consent !== "true")
      return c.json({ error: "consent_required" }, 400);
    const ip = String(c.req.header("CF-Connecting-IP") || "local");
    const key = `briefing:${await sha256(ip)}`;
    const limit = await consumeRateLimit(c.env.DB, key, {
      limit: 5,
      windowSeconds: 3600,
      blockSeconds: 3600,
    });
    if (!limit.allowed) {
      c.header("Retry-After", String(limit.retryAfter));
      return c.json({ error: "too_many_requests" }, 429);
    }
    return c.json(await createPublicLead(c.env, body), 201);
  } catch (e: any) {
    return c.json({ error: String(e?.message || "briefing_failed") }, 400);
  }
});
api.post("/public/feedback", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  if (requestTooLarge(c, 16384))
    return c.json({ error: "payload_too_large" }, 413);
  try {
    const body = await c.req.json<any>().catch(() => ({}));
    if (body.contactConsent !== true && body.contactConsent !== "true")
      return c.json({ error: "consent_required" }, 400);
    const ip = String(c.req.header("CF-Connecting-IP") || "local");
    const key = `feedback:${await sha256(ip)}`;
    const limit = await consumeRateLimit(c.env.DB, key, {
      limit: 10,
      windowSeconds: 3600,
      blockSeconds: 3600,
    });
    if (!limit.allowed) {
      c.header("Retry-After", String(limit.retryAfter));
      return c.json({ error: "too_many_requests" }, 429);
    }
    return c.json(await createPublicFeedback(c.env, body), 201);
  } catch (e: any) {
    return c.json({ error: String(e?.message || "feedback_failed") }, 400);
  }
});

api.get("/admin/conversion/dashboard", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  return c.json(
    await conversionDashboard(c.env, Number(c.req.query("days") || 30)),
  );
});
api.get("/admin/conversion/lead-magnets", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  return c.json({
    items: await c.env.DB.prepare(
      `SELECT * FROM lead_magnets ORDER BY updated_at DESC`,
    )
      .all<any>()
      .then((x: any) => x.results),
  });
});
api.post("/admin/conversion/lead-magnets", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    return c.json(
      { magnet: await createLeadMagnet(c.env, u, await jsonBody(c)) },
      201,
    );
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "lead_magnet_create_failed") },
      400,
    );
  }
});
api.get("/admin/conversion/ctas", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  return c.json({
    items: (
      await c.env.DB.prepare(
        `SELECT c.*,p.title post_title,m.title magnet_title FROM content_ctas c LEFT JOIN posts p ON p.id=c.post_id LEFT JOIN lead_magnets m ON m.id=c.magnet_id ORDER BY c.priority DESC,c.updated_at DESC`,
      ).all<any>()
    ).results,
  });
});
api.post("/admin/conversion/ctas", async (c) => {
  const u = await requireUser(c);
  if (!u || !requireRole(u, ["owner", "admin", "editor"]))
    return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    return c.json({ cta: await createCTA(c.env, u, await jsonBody(c)) }, 201);
  } catch (e: any) {
    return c.json({ error: String(e?.message || "cta_create_failed") }, 400);
  }
});
api.get("/admin/blog/posts", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  return c.json({
    items: await listPosts(c.env, {
      status: c.req.query("status"),
      categoryId: c.req.query("categoryId"),
      search: c.req.query("search"),
      limit: Number(c.req.query("limit") || 100),
      offset: Number(c.req.query("offset") || 0),
    }),
  });
});
api.get("/admin/blog/posts/:id", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  const post = await getPost(c.env, c.req.param("id"));
  return post ? c.json({ post }) : c.json({ error: "post_not_found" }, 404);
});
api.post("/admin/blog/posts", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const body = await jsonBody(c);
    if (String(body.status || "draft") === "published" && !publishRole(u))
      return c.json({ error: "publish_permission_required" }, 403);
    const post = await createPost(c.env, u, body);
    if (post?.status === "published")
      scheduleSiteDeploy(c, "post_published", {
        actorUserId: u.id,
        postId: post.id,
        slug: post.slug,
      });
    return c.json({ post }, 201);
  } catch (e: any) {
    const m = String(e?.message || "");
    if (m.includes("UNIQUE"))
      return c.json({ error: "slug_already_exists" }, 409);
    return c.json({ error: m || "post_create_failed" }, 400);
  }
});
api.put("/admin/blog/posts/:id", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const id = c.req.param("id");
    const before = await getPost(c.env, id);
    if (!before) return c.json({ error: "post_not_found" }, 404);
    const body = await jsonBody(c);
    if (
      (before.status === "published" ||
        String(body.status || "") === "published") &&
      !publishRole(u)
    )
      return c.json({ error: "publish_permission_required" }, 403);
    const post = await updatePost(c.env, u, id, body);
    if (before?.status !== "published" && post?.status === "published")
      scheduleSiteDeploy(c, "post_published", {
        actorUserId: u.id,
        postId: post.id,
        slug: post.slug,
      });
    else if (before?.status === "published" && post?.status === "published")
      scheduleSiteDeploy(c, "post_updated", {
        actorUserId: u.id,
        postId: post.id,
        slug: post.slug,
      });
    else if (before?.status === "published" && post?.status !== "published")
      scheduleSiteDeploy(c, "post_unpublished", {
        actorUserId: u.id,
        postId: post.id,
        slug: post.slug,
      });
    return c.json({ post });
  } catch (e: any) {
    const m = String(e?.message || "");
    if (m.includes("UNIQUE"))
      return c.json({ error: "slug_already_exists" }, 409);
    return c.json({ error: m || "post_update_failed" }, 400);
  }
});
api.delete("/admin/blog/posts/:id", async (c) => {
  const u = await requireUser(c);
  if (!u || !publishRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const post = await deletePost(c.env, u, c.req.param("id"));
    if (post?.status === "published")
      scheduleSiteDeploy(c, "post_deleted", {
        actorUserId: u.id,
        postId: post.id,
        slug: post.slug,
      });
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ error: String(e?.message || "post_delete_failed") }, 404);
  }
});
api.post("/admin/blog/categories", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const category = await createCategory(c.env, u, await jsonBody(c));
    scheduleSiteDeploy(c, "category_created", {
      actorUserId: u.id,
      categoryId: category.id,
      slug: category.slug,
    });
    return c.json({ category }, 201);
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "category_create_failed") },
      400,
    );
  }
});
api.put("/admin/blog/categories/:id", async (c) => {
  const u = await requireUser(c);
  if (!cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const category = await updateCategory(
      c.env,
      u,
      c.req.param("id"),
      await jsonBody(c),
    );
    if (!category) return c.json({ error: "category_not_found" }, 404);
    scheduleSiteDeploy(c, "category_updated", {
      actorUserId: u.id,
      categoryId: category.id,
      slug: category.slug,
    });
    return c.json({ category });
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "category_update_failed") },
      400,
    );
  }
});
api.delete("/admin/blog/categories/:id", async (c) => {
  const u = await requireUser(c);
  if (!u || !publishRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    await deleteCategory(c.env, u, c.req.param("id"));
    scheduleSiteDeploy(c, "category_deleted", {
      actorUserId: u.id,
      categoryId: c.req.param("id"),
    });
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "category_delete_failed") },
      400,
    );
  }
});

api.get("/admin/editorial/comments", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  return c.json({ items: await listComments(c.env, c.req.query("status")) });
});
api.patch("/admin/editorial/comments/:id", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const body = await c.req.json<any>().catch(() => ({}));
    await moderateComment(
      c.env,
      u,
      c.req.param("id"),
      String(body.status || ""),
    );
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json(
      { error: String(e?.message || "comment_moderation_failed") },
      400,
    );
  }
});
api.get("/admin/editorial/newsletter", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  return c.json({ items: await listNewsletterSubscribers(c.env) });
});

api.get("/admin/media", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  return c.json({
    items: await listMedia(
      c.env,
      c.req.query("limit") as any,
      c.req.query("offset") as any,
    ),
  });
});
api.post("/admin/media", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    const form = await c.req.parseBody();
    const file = form.file;
    if (!(file instanceof File)) return c.json({ error: "file_required" }, 400);
    return c.json(
      {
        media: await uploadMedia(
          c.env,
          u,
          file,
          String(form.alt_text || ""),
          String(form.title || ""),
        ),
      },
      201,
    );
  } catch (e: any) {
    return c.json({ error: String(e?.message || "media_upload_failed") }, 400);
  }
});
api.delete("/admin/media/:id", async (c) => {
  const u = await requireUser(c);
  if (!u || !cmsRole(u)) return c.json({ error: "forbidden" }, 403);
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  try {
    await deleteMedia(c.env, u, c.req.param("id"));
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ error: String(e?.message || "media_delete_failed") }, 404);
  }
});

api.get("/admin/users", async (c) => {
  const user = await requireUser(c);
  if (!user || !requireRole(user, ["owner", "admin"]))
    return c.json({ error: "forbidden" }, 403);
  return c.json({ items: await listUsers(c.env) });
});

api.post("/admin/users", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  const actor = await requireUser(c);
  if (!actor || !requireRole(actor, ["owner", "admin"]))
    return c.json({ error: "forbidden" }, 403);
  const body: any = await c.req.json().catch(() => ({}));
  if (!body.email || !body.name || !body.password || !body.role)
    return c.json({ error: "name_email_password_role_required" }, 400);
  if (!validPassword(String(body.password)))
    return c.json({ error: "password_policy_failed" }, 400);
  if (
    !["owner", "admin", "editor", "sales", "ops", "finance"].includes(body.role)
  )
    return c.json({ error: "invalid_role" }, 400);
  if (actor.role !== "owner" && body.role === "owner")
    return c.json({ error: "only_owner_can_create_owner" }, 403);
  try {
    const created = await createUser(c.env, {
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role,
    });
    await writeAudit(c.env, {
      actorUserId: actor.id,
      action: "admin.user_created",
      resourceType: "user",
      resourceId: created.id,
      metadata: { role: created.role },
    });
    return c.json({ user: created }, 201);
  } catch (e: any) {
    if (String(e?.message || "").includes("UNIQUE"))
      return c.json({ error: "email_already_exists" }, 409);
    throw e;
  }
});

api.patch("/admin/users/:id", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  const actor = await requireUser(c);
  if (!actor || !requireRole(actor, ["owner", "admin"]))
    return c.json({ error: "forbidden" }, 403);
  const id = c.req.param("id");
  const body: any = await c.req.json().catch(() => ({}));
  if (typeof body.active !== "boolean")
    return c.json({ error: "active_boolean_required" }, 400);
  if (id === actor.id && body.active === false)
    return c.json({ error: "cannot_deactivate_self" }, 400);
  const rows = await c.env.DB.prepare(`SELECT id,role FROM users WHERE id=?`)
    .bind(id)
    .all<any>();
  const target = rows.results[0];
  if (!target) return c.json({ error: "user_not_found" }, 404);
  if (actor.role !== "owner" && target.role === "owner")
    return c.json({ error: "only_owner_can_change_owner" }, 403);
  await setUserActive(c.env, id, body.active);
  if (body.active === false) await revokeAllUserSessions(c.env, id);
  await writeAudit(c.env, {
    actorUserId: actor.id,
    action: "admin.user_status_changed",
    resourceType: "user",
    resourceId: id,
    metadata: { active: body.active },
  });
  return c.json({ ok: true });
});

api.get("/health", (c) =>
  c.json({
    ok: true,
    service: "dejotacode-business-os-api",
    version: "1.0.0",
    apiVersion: "v1",
    stage: "5.37.1",
  }),
);

api.post("/auth/login", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  if (requestTooLarge(c, 8192))
    return c.json({ error: "payload_too_large" }, 413);
  const body: any = await c.req.json().catch(() => ({}));
  if (!body.email || !body.password)
    return c.json({ error: "email_and_password_required" }, 400);
  const email = normalizeEmail(String(body.email));
  const ip = String(c.req.header("CF-Connecting-IP") || "local");
  const limiterKey = `login:${await sha256(`${ip}|${email}`)}`;
  const limit = await consumeRateLimit(c.env.DB, limiterKey, {
    limit: 5,
    windowSeconds: 600,
    blockSeconds: 900,
  });
  if (!limit.allowed) {
    c.header("Retry-After", String(limit.retryAfter));
    return c.json({ error: "too_many_login_attempts" }, 429);
  }
  const user = await login(c, email, String(body.password));
  if (!user) {
    await writeAudit(c.env, {
      action: "auth.login_failed",
      metadata: { emailHash: await sha256(email) },
    });
    return c.json({ error: "invalid_credentials" }, 401);
  }
  await clearRateLimit(c.env.DB, limiterKey);
  return c.json({ user });
});

api.post("/auth/bootstrap", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  const configured = String(c.env.BOOTSTRAP_TOKEN || "");
  const provided = String(c.req.header("X-Bootstrap-Token") || "");
  if (!configured || !provided || !constantTimeEqual(configured, provided))
    return c.json({ error: "bootstrap_unavailable" }, 404);
  if ((await activeOwnerCount(c.env)) > 0)
    return c.json({ error: "owner_already_exists" }, 409);
  const body: any = await c.req.json().catch(() => ({}));
  if (!body.email || !body.name || !validPassword(String(body.password || "")))
    return c.json({ error: "valid_name_email_password_required" }, 400);
  const email = normalizeEmail(String(body.email));
  const name = String(body.name).trim().slice(0, 120);
  const seeded = await c.env.DB.prepare(
    `SELECT id FROM users WHERE email=? AND role='owner' AND active=0 LIMIT 1`,
  )
    .bind(email)
    .first<any>();
  let owner;
  if (seeded) {
    const credentials = await hashPassword(String(body.password));
    await c.env.DB.prepare(
      `UPDATE users SET name=?,password_hash=?,password_salt=?,active=1,updated_at=? WHERE id=?`,
    )
      .bind(
        name,
        credentials.hash,
        credentials.salt,
        new Date().toISOString(),
        seeded.id,
      )
      .run();
    owner = { id: seeded.id, email, name, role: "owner" as const };
  } else {
    owner = await createUser(c.env, {
      email,
      name,
      password: String(body.password),
      role: "owner",
    });
  }
  await writeAudit(c.env, {
    actorUserId: owner.id,
    action: "auth.bootstrap_owner_created",
    resourceType: "user",
    resourceId: owner.id,
  });
  return c.json({ user: owner }, 201);
});

api.post("/auth/logout", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  await logout(c);
  return c.json({ ok: true });
});

api.get("/auth/me", async (c) => {
  const user = await requireUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  return c.json({ user });
});

api.post("/os/events", async (c) => {
  if (!trustedOrigin(c)) return c.json({ error: "csrf_origin_rejected" }, 403);
  if (requestTooLarge(c, 32768))
    return c.json({ error: "payload_too_large" }, 413);
  const user = await requireUser(c);
  if (!user) return c.json({ error: "unauthorized" }, 401);
  if (
    !requireRole(user, ["owner", "admin", "sales", "ops", "finance", "editor"])
  )
    return c.json({ error: "forbidden" }, 403);

  const body: any = await c.req.json().catch(() => ({}));
  if (!body.eventName || body.payload === undefined)
    return c.json({ error: "event_name_and_payload_required" }, 400);
  if (!/^[a-z0-9_.:-]{1,100}$/.test(String(body.eventName)))
    return c.json({ error: "invalid_event_name" }, 400);
  if (JSON.stringify(body.payload).length > 24576)
    return c.json({ error: "payload_too_large" }, 413);

  const eventId = await registerEvent(c.env, {
    eventName: body.eventName,
    aggregateType: body.aggregateType,
    aggregateId: body.aggregateId,
    payload: body.payload,
    actorUserId: user.id,
  });
  const workflowIds = await dispatchEvent(c.env, body.eventName, eventId);
  await auditWorkflowQueue(c.env, user.id, eventId, workflowIds);
  return c.json({ eventId, workflowIds }, 201);
});

api.get("/os/events", async (c) => {
  const user = await requireUser(c);
  if (
    !user ||
    !requireRole(user, ["owner", "admin", "ops", "finance", "sales"])
  )
    return c.json({ error: "forbidden" }, 403);
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 100);
  const result = await c.env.DB.prepare(
    `SELECT id,event_name,aggregate_type,aggregate_id,source,actor_user_id,created_at FROM os_events ORDER BY created_at DESC LIMIT ?`,
  )
    .bind(limit)
    .all<any>();
  return c.json({ items: result.results });
});

api.get("/os/workflows", async (c) => {
  const user = await requireUser(c);
  if (
    !user ||
    !requireRole(user, ["owner", "admin", "ops", "finance", "sales"])
  )
    return c.json({ error: "forbidden" }, 403);
  const result = await c.env.DB.prepare(
    `SELECT id,workflow_id,event_id,status,attempts,error_message,started_at,finished_at,created_at FROM workflow_runs ORDER BY created_at DESC LIMIT 100`,
  ).all<any>();
  return c.json({ items: result.results });
});

api.get("/os/audit", async (c) => {
  const user = await requireUser(c);
  if (!user || !requireRole(user, ["owner", "admin"]))
    return c.json({ error: "forbidden" }, 403);
  const result = await c.env.DB.prepare(
    `SELECT id,actor_user_id,action,resource_type,resource_id,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 100`,
  ).all<any>();
  return c.json({ items: result.results });
});

api.onError(async (err, c) => {
  try {
    await writeAudit(c.env, {
      action: "api.error",
      metadata: { message: err.message, path: c.req.path },
    });
  } catch {}
  return c.json({ error: "internal_error" }, 500);
});
