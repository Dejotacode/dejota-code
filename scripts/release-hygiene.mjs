import { readFile, access } from 'node:fs/promises';

const requiredFiles = [
  'README.md', 'CHANGELOG.md', '.gitignore', '.dev.vars.example', 'pages.env.example',
  'wrangler.toml.example', 'astro.config.mjs', 'src/worker.ts', 'src/lib/editorial.ts',
  'scripts/build-site.mjs', 'scripts/validate-urls.mjs',
];
const requiredIgnoreRules = ['node_modules/', '.wrangler/', '.dev.vars', '.env', 'wrangler.toml', 'dist/', '.astro/'];

for (const file of requiredFiles) await access(file);
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (pkg.version !== '1.0.0-rc.1') throw new Error(`Versão inesperada: ${pkg.version}`);
const rules = (await readFile('.gitignore', 'utf8')).split(/\r?\n/);
for (const rule of requiredIgnoreRules) if (!rules.includes(rule)) throw new Error(`Regra ausente no .gitignore: ${rule}`);
for (const file of ['.dev.vars.example', 'pages.env.example', 'wrangler.toml.example']) {
  const text = await readFile(file, 'utf8');
  if (/BEGIN (RSA|OPENSSH|EC) PRIVATE KEY/.test(text)) throw new Error(`Chave privada detectada em ${file}`);
}
console.log('Release hygiene: OK');
