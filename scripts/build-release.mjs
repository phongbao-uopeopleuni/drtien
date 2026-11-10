import { spawnSync } from 'node:child_process';
import { validateContent } from './content-validation.mjs';
const { errors, warnings } = validateContent({ release: true });
warnings.forEach(warning => console.warn(`NOTE: ${warning}`));
if (errors.length) {
  console.error(`Public release is blocked:\n${errors.map(error => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  for (const args of [['scripts/astro.mjs', 'check'], ['scripts/create-social-card.mjs'], ['scripts/astro.mjs', 'build']]) {
    const result = spawnSync(process.execPath, args, {
      stdio: 'inherit', env: { ...process.env, PORTFOLIO_RELEASE: 'true' },
    });
    if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
  }
}
