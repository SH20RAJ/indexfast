import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

try {
    await sql.unsafe(`ALTER TABLE sites ADD COLUMN IF NOT EXISTS index_now_key text`);
    await sql.unsafe(`ALTER TABLE sites ADD COLUMN IF NOT EXISTS index_now_key_verified boolean DEFAULT false NOT NULL`);
    console.log('✅ Columns added successfully');
} catch (e: any) {
    console.error('Error:', e.message);
}

await sql.end();
process.exit(0);
