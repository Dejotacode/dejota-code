import { bin, LOCAL_CONFIG, PERSIST_DIR, run, wait } from './local-utils.mjs';

const child = run(bin('./node_modules/.bin/wrangler'), [
  'dev',
  '--config', LOCAL_CONFIG,
  '--local',
  '--persist-to', PERSIST_DIR,
  '--ip', '127.0.0.1',
  '--port', '8787',
]);
process.exitCode = await wait(child);
