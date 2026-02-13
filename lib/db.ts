import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Enable WebSocket for Cloudflare Workers compatibility
neonConfig.webSocketConstructor = WebSocket;

const connectionString = process.env.DATABASE_URL!;

// Create connection pool optimized for serverless
const pool = new Pool({ 
  connectionString,
  max: 1, // Single connection for stateless Workers
});

const db = drizzle(pool, { schema });

export default db;
