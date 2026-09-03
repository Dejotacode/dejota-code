import { spawn } from 'node:child_process';
import process from 'node:process';

const apiUrl = String(process.env.API_URL || '').replace(/\/$/, '');
const useLocal = !apiUrl || /localhost|127\.0\.0\.1/.test(apiUrl);
const targetApi = useLocal ? 'http://127.0.0.1:8787' : apiUrl;
let worker;

const command = (name) => process.platform === 'win32' ? `${name}.cmd` : name;

async function waitForExit(child, timeout = 5000) {
  if (!child || child.exitCode !== null) return;
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);
}

async function cleanup() {
  if (!worker || worker.exitCode !== null) return;
  try {
    if (process.platform === 'win32') worker.kill('SIGTERM');
    else process.kill(-worker.pid, 'SIGTERM');
  } catch {}
  await waitForExit(worker, 4000);
  if (worker.exitCode === null) {
    try {
      if (process.platform === 'win32') worker.kill('SIGKILL');
      else process.kill(-worker.pid, 'SIGKILL');
    } catch {}
    await waitForExit(worker, 1000);
  }
}

async function waitForApi(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try { const r = await fetch(`${url}/api/health`); if (r.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`API não respondeu em ${url}`);
}

const terminate = async (code) => { await cleanup(); process.exit(code); };
process.on('SIGINT', () => { void terminate(130); });
process.on('SIGTERM', () => { void terminate(143); });

try {
  if (useLocal) {
    worker = spawn(command('./node_modules/.bin/wrangler'), ['dev', 'src/worker.ts', '--local', '--port', '8787'], {
      stdio: 'inherit',
      shell: false,
      detached: process.platform !== 'win32',
    });
    worker.on('error', (error) => { throw error; });
  }

  await waitForApi(targetApi);
  const astro = spawn(command('./node_modules/.bin/astro'), ['build'], {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, API_URL: targetApi },
  });
  const code = await new Promise((resolve, reject) => {
    astro.once('error', reject);
    astro.once('exit', (value) => resolve(value ?? 1));
  });
  await cleanup();
  process.exitCode = Number(code);
} catch (error) {
  console.error(error);
  await cleanup();
  process.exitCode = 1;
}
