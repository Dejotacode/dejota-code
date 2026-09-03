import { spawn } from "node:child_process";
import process from "node:process";

const apiUrl = String(process.env.API_URL || "").replace(/\/$/, "");
const useLocal = !apiUrl || /localhost|127\.0\.0\.1/.test(apiUrl);
const targetApi = useLocal ? "http://127.0.0.1:8787" : apiUrl;
const localConfig = "wrangler.local.toml";
const persistDir = ".wrangler/state";
let worker;
let ownsWorker = false;

const command = (name) => (process.platform === "win32" ? `${name}.cmd` : name);

async function waitForExit(child, timeout = 5000) {
  if (!child || child.exitCode !== null) return;
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);
}

async function cleanup() {
  if (!ownsWorker || !worker || worker.exitCode !== null) return;
  try {
    if (process.platform === "win32") worker.kill("SIGTERM");
    else process.kill(-worker.pid, "SIGTERM");
  } catch {}
  await waitForExit(worker, 4000);
  if (worker.exitCode === null) {
    try {
      if (process.platform === "win32") worker.kill("SIGKILL");
      else process.kill(-worker.pid, "SIGKILL");
    } catch {}
    await waitForExit(worker, 1000);
  }
}

async function waitForApi(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const r = await fetch(`${url}/api/health`);
      if (r.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`API não respondeu em ${url}`);
}

const terminate = async (code) => {
  await cleanup();
  process.exit(code);
};
process.on("SIGINT", () => {
  void terminate(130);
});
process.on("SIGTERM", () => {
  void terminate(143);
});

try {
  if (useLocal && process.env.CF_PAGES) {
    throw new Error(
      "API_URL é obrigatória no Cloudflare Pages. O fallback local existe apenas para desenvolvimento.",
    );
  }

  if (useLocal) {
    const migrate = spawn(
      command("./node_modules/.bin/wrangler"),
      [
        "d1",
        "migrations",
        "apply",
        "DB",
        "--local",
        "--config",
        localConfig,
        "--persist-to",
        persistDir,
      ],
      { stdio: "inherit", shell: false },
    );
    const migrateCode = await new Promise((resolve, reject) => {
      migrate.once("error", reject);
      migrate.once("exit", (value) => resolve(value ?? 1));
    });
    if (migrateCode !== 0)
      throw new Error(`Falha ao preparar D1 local (código ${migrateCode})`);

    let apiAvailable = false;
    try {
      apiAvailable = (await fetch(`${targetApi}/api/health`)).ok;
    } catch {}
    if (!apiAvailable) {
      worker = spawn(
        command("./node_modules/.bin/wrangler"),
        [
          "dev",
          "--config",
          localConfig,
          "--local",
          "--persist-to",
          persistDir,
          "--ip",
          "127.0.0.1",
          "--port",
          "8787",
        ],
        { stdio: "inherit", shell: false },
      );
      ownsWorker = true;
      worker.on("error", (error) => {
        throw error;
      });
    }
  }

  await waitForApi(targetApi);
  const astro = spawn(command("./node_modules/.bin/astro"), ["build"], {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, API_URL: targetApi },
  });
  const code = await new Promise((resolve, reject) => {
    astro.once("error", reject);
    astro.once("exit", (value) => resolve(value ?? 1));
  });
  await cleanup();
  process.exitCode = Number(code);
} catch (error) {
  console.error(error);
  await cleanup();
  process.exitCode = 1;
}
