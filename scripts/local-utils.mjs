import { spawn } from "node:child_process";
import net from "node:net";
import process from "node:process";

export const ROOT = new URL("../", import.meta.url);
export const LOCAL_API_URL = "http://127.0.0.1:8787";
export const LOCAL_WEB_URL = "http://127.0.0.1:4321";
export const LOCAL_CONFIG = "wrangler.local.toml";
export const PERSIST_DIR = ".wrangler/state";

export function bin(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

export function run(command, args, options = {}) {
  return spawn(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    ...options,
  });
}

export function wait(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

export async function waitForApi(url = LOCAL_API_URL, timeout = 30_000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 350));
  }
  throw new Error(`API local não respondeu em ${url}`);
}

export async function isApiAvailable(url = LOCAL_API_URL) {
  try {
    const response = await fetch(`${url}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export function isPortInUse(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

export async function isUrlAvailable(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

export async function stopTree(child) {
  if (!child || child.exitCode !== null) return;
  try {
    child.kill("SIGTERM");
    if (process.platform !== "win32") process.kill(-child.pid, "SIGTERM");
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (child.exitCode === null) {
    try {
      child.kill("SIGKILL");
      if (process.platform !== "win32") process.kill(-child.pid, "SIGKILL");
    } catch {}
  }
}
