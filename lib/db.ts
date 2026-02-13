import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Configuration for serverless environments (CF Workers)
// 'prepare: false' is essential when using transaction mode poolers (Neon/Vercel)
const client = postgres(connectionString, {
    ssl: 'require',
    max: 1, // CF Workers are stateless, keep connections minimal
    prepare: false 
});

const db = drizzle(client, { schema });

export default db;
