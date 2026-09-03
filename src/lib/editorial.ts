export interface EditorialPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  contentHtml: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  featured: boolean;
  image?: string;
  readingTime: number;
  contentType: "pillar" | "cluster" | "supporting";
  clusterSlug: string;
  primaryKeyword?: string;
  searchIntent: "informacional" | "comercial" | "navegacional" | "transacional";
  seoPriority: "alta" | "media" | "baixa";
  reviewedAt?: Date;
  reviewedBy?: string;
  sources: string[];
  experienceNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
  schemaJson?: unknown;
}

const API_URL = String(
  import.meta.env.API_URL || "http://127.0.0.1:8787",
).replace(/\/$/, "");

async function api<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : "";
    throw new Error(`Editorial API indisponível em ${API_URL}${path}${detail}`);
  }
  if (!response.ok)
    throw new Error(`Editorial API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

function date(value?: string | null): Date | undefined {
  return value ? new Date(value) : undefined;
}

function parsePost(row: any): EditorialPost {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.excerpt || row.seo_description || ""),
    contentHtml: String(row.content_html || ""),
    category: String(row.category_name || ""),
    categorySlug: String(row.category_slug || ""),
    tags: Array.isArray(row.tags)
      ? row.tags
      : typeof row.tags === "string" && row.tags
        ? JSON.parse(row.tags)
        : [],
    author: String(row.author_name || "Dejotacode"),
    publishedAt: date(row.published_at || row.created_at)!,
    updatedAt: date(row.updated_at),
    featured: Boolean(row.featured),
    image: row.featured_image || undefined,
    readingTime: Number(row.reading_time || 5),
    contentType: row.content_type || "supporting",
    clusterSlug: String(row.cluster_slug || "geral"),
    primaryKeyword: row.primary_keyword || row.focus_keyword || undefined,
    searchIntent: row.search_intent || "informacional",
    seoPriority: row.seo_priority || "media",
    reviewedAt: date(row.reviewed_at),
    reviewedBy: row.reviewed_by || undefined,
    sources: Array.isArray(row.sources)
      ? row.sources
      : typeof row.sources === "string" && row.sources
        ? JSON.parse(row.sources)
        : [],
    experienceNote: row.experience_note || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    canonicalUrl: row.canonical_url || undefined,
    ogImage: row.og_image || undefined,
    robots: row.robots || "index,follow",
    schemaJson: row.schema_json ? JSON.parse(row.schema_json) : undefined,
  };
}

export async function getPublishedPosts(): Promise<EditorialPost[]> {
  const data = await api<{ items: any[] }>(
    "/api/blog/posts?status=published&limit=100",
  );
  return data.items
    .map(parsePost)
    .filter((post) => post.publishedAt.getTime() <= Date.now());
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<EditorialPost | null> {
  try {
    const data = await api<{ post: any }>(
      `/api/blog/posts/slug/${encodeURIComponent(slug)}`,
    );
    return parsePost(data.post);
  } catch {
    return null;
  }
}

export async function getCategories() {
  return api<{ items: any[] }>("/api/blog/categories").then((x) => x.items);
}
export async function getTags() {
  return api<{ items: any[] }>("/api/blog/tags").then((x) => x.items);
}
export function postUrl(post: Pick<EditorialPost, "categorySlug" | "slug">) {
  return `/blog/${post.categorySlug}/${post.slug}/`;
}
export function categoryUrl(slug: string) {
  return `/${slug}/`;
}
export function tagUrl(slug: string) {
  return `/tags/${encodeURIComponent(slug)}/`;
}
