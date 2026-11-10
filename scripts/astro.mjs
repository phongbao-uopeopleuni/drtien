// Keep CLI telemetry off and the Node compile cache inside this project.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
process.env.ASTRO_TELEMETRY_DISABLED = '1';
process.env.NODE_COMPILE_CACHE = resolve(root, '.qa/node-compile-cache');
await import('../node_modules/astro/bin/astro.mjs');
