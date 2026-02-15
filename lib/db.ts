import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

import { getCloudflareContext } from "@opennextjs/cloudflare";

let connectionString = process.env.DATABASE_URL;

try {
    // Try to get the binding from the Cloudflare context (for deployed workers)
    const cfContext = getCloudflareContext();
    if (cfContext?.env?.DATABASE_URL) {
        connectionString = cfContext.env.DATABASE_URL;
    }
} catch (_e) {
    // Fallback to process.env if not in a worker context or context fails
}

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

// Configuration for serverless environments (CF Workers)
// 'prepare: false' is essential when using transaction mode poolers (Neon/Vercel)
const client = postgres(connectionString, {
    ssl: 'require',
    max: 1, // CF Workers are stateless, keep connections minimal
    prepare: false 
});

const db = drizzle(client, { schema });

export default db;
