import { validateContent } from './content-validation.mjs';
const release = process.argv.includes('--release') || process.env.PORTFOLIO_RELEASE === 'true';
const { errors, warnings } = validateContent({ release });
warnings.forEach(warning => console.warn(`NOTE: ${warning}`));
errors.forEach(error => console.error(`ERROR: ${error}`));
if (errors.length) process.exitCode = 1;
else console.log(`Content policy checks passed (${release ? 'release' : 'editorial preview'}).`);
