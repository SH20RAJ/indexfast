import postgres from "postgres";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(resolve(__dirname, "../.env"), "utf-8");
for (const line of envFile.split("\n")) {
    const match = line.match(/^(\w+)=["']?(.+?)["']?$/);
    if (match) process.env[match[1]] = match[2];
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function createApiKeysTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS api_keys (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                key_hash TEXT NOT NULL,
                key_prefix TEXT NOT NULL,
                key_last4 TEXT NOT NULL,
                is_test BOOLEAN NOT NULL DEFAULT false,
                last_used_at TIMESTAMP,
                expires_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT now()
            )
        `;
        console.log("✅ api_keys table created successfully");
    } catch (error) {
        console.error("Error creating table:", error);
    } finally {
        await sql.end();
    }
}

createApiKeysTable();
