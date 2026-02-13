import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';

// Use Vercel's fetch-based Postgres client (works in Cloudflare Workers)
const db = drizzle(vercelSql, { schema });

export default db;
