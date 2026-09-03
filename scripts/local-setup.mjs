import { bin, LOCAL_CONFIG, PERSIST_DIR, run, wait } from './local-utils.mjs';

console.log('🗄️  Preparando D1 local e aplicando migrations...');
const child = run(bin('./node_modules/.bin/wrangler'), [
  'd1', 'migrations', 'apply', 'DB',
  '--local',
  '--config', LOCAL_CONFIG,
  '--persist-to', PERSIST_DIR,
]);
const code = await wait(child);
if (code !== 0) process.exit(code);
console.log('✅ Ambiente de banco local pronto.');
