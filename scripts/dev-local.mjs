import process from "node:process";
import {
  bin,
  isApiAvailable,
  isPortInUse,
  isUrlAvailable,
  LOCAL_API_URL,
  LOCAL_CONFIG,
  LOCAL_WEB_URL,
  PERSIST_DIR,
  run,
  stopTree,
  wait,
  waitForApi,
} from "./local-utils.mjs";

let api;
let web;
let ownsApi = false;
let ownsWeb = false;
let keepAlive;
let closing = false;

async function cleanup(code = 0) {
  if (closing) return;
  closing = true;
  if (keepAlive) clearInterval(keepAlive);
  if (ownsWeb) await stopTree(web);
  if (ownsApi) await stopTree(api);
  process.exitCode = code;
}

process.on("SIGINT", () => void cleanup(130));
process.on("SIGTERM", () => void cleanup(143));

console.log("1/3 — Aplicando migrations no D1 local...");
const migrate = run(bin("./node_modules/.bin/wrangler"), [
  "d1",
  "migrations",
  "apply",
  "DB",
  "--local",
  "--config",
  LOCAL_CONFIG,
  "--persist-to",
  PERSIST_DIR,
]);
const migrateCode = await wait(migrate);
if (migrateCode !== 0) process.exit(migrateCode);

console.log("2/3 — Iniciando Worker/API em http://127.0.0.1:8787 ...");
if (await isApiAvailable()) {
  console.log(
    "API local já está em execução; reutilizando o processo existente.",
  );
} else if (await isPortInUse(8787)) {
  console.log("API local está iniciando; aguardando o endpoint de saúde...");
  await waitForApi();
} else {
  api = run(bin("./node_modules/.bin/wrangler"), [
    "dev",
    "--config",
    LOCAL_CONFIG,
    "--local",
    "--persist-to",
    PERSIST_DIR,
    "--ip",
    "127.0.0.1",
    "--port",
    "8787",
  ]);
  ownsApi = true;
  await waitForApi();
}

console.log("3/3 — Iniciando Astro em http://127.0.0.1:4321 ...");
if (await isUrlAvailable(LOCAL_WEB_URL)) {
  console.log(
    "Astro local já está em execução; reutilizando o processo existente.",
  );
} else {
  web = run(
    bin("./node_modules/.bin/astro"),
    ["dev", "--host", "127.0.0.1", "--port", "4321"],
    {
      detached: process.platform !== "win32",
      env: {
        ...process.env,
        ASTRO_DEV_BACKGROUND: "0",
        API_URL: LOCAL_API_URL,
        PUBLIC_API_URL: LOCAL_API_URL,
      },
    },
  );
  ownsWeb = true;
}

const running = [];
if (api) running.push(wait(api).then((code) => ["API", code]));
if (web) running.push(wait(web).then((code) => ["Astro", code]));
if (running.length === 0) {
  keepAlive = setInterval(() => {}, 60_000);
  await new Promise(() => {});
}
const [name, code] = await Promise.race(running);
if (!closing)
  console.error(`${name} encerrou inesperadamente (código ${code}).`);
await cleanup(Number(code));
