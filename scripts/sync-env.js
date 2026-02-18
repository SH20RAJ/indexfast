const fs = require('fs');
const { execSync } = require('child_process');

const envFile = '.env';
if (!fs.existsSync(envFile)) {
    console.error('.env file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf8');
const lines = envContent.split('\n');

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex);
    const value = trimmed.slice(equalsIndex + 1);

    if (!key || !value) continue;

    // Check if env already exists (optional, but vercel env add might prompt if it does)
    // We'll just try to add it. If it exists, it might fail or prompt.
    // To avoid prompts, we can try 'vercel env add name production' and pipe the value?
    // The previous issue was bad substitution.
    // Let's use the standard method: echo -n val | vercel env add key production

    console.log(`Adding ${key}...`);
    try {
        // vercel env add <name> [environment] 
        // We pipe the value to stdin.
        execSync(`echo -n "${value.replace(/"/g, '\\"')}" | vercel env add ${key} production`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to add ${key}:`, e.message);
    }
}
