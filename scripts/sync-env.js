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
    let value = trimmed.slice(equalsIndex + 1);

    // Remove surrounding quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
    }

    if (!key || !value) continue;

    console.log(`Processing ${key}...`);
    try {
        // Try to remove existing env var first to avoid duplicates or prompt
        try {
            execSync(`vercel env rm ${key} production -y`, { stdio: 'ignore' });
        } catch (e) {
            // Ignore error if env var doesn't exist
        }

        // Add new env var using printf to avoid shell interpretation issues
        // Escape double quotes for the shell command
        const escapedValue = value.replace(/"/g, '\\"');
        execSync(`printf "%s" "${escapedValue}" | vercel env add ${key} production`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to add ${key}:`, e.message);
    }
}
