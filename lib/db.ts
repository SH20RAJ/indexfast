import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

// Configuration for serverless environments (Vercel)
// 'prepare: false' is essential when using transaction mode poolers (Neon/Vercel)
const client = postgres(connectionString, {
    ssl: 'require',
    max: 10, // Vercel can handle slightly more connections than CF Workers
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false 
});

const db = drizzle(client, { schema });

export default db;
