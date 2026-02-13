import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import postgres from "postgres";

export async function GET() {
  const user = await stackServerApp.getUser();
  
  // Security: Only logged-in users can trigger this migration
  // Given this is a temporary fix, we just check for authentication
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ error: "DATABASE_URL not found" }, { status: 500 });
  }

  const sql = postgres(connectionString, { ssl: "require" });

  try {
    console.log("Starting production migration for site table...");
    
    // Check if columns exist and add them if missing
    await sql.unsafe(`
      ALTER TABLE sites 
      ADD COLUMN IF NOT EXISTS index_now_key text,
      ADD COLUMN IF NOT EXISTS index_now_key_verified boolean DEFAULT false NOT NULL;
    `);

    console.log("Migration successful");
    
    return NextResponse.json({ 
      success: true, 
      message: "Database schema updated successfully. You can now visit your dashboard.",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Migration failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      detail: "Failed to apply ALTER TABLE to sites table"
    }, { status: 500 });
  } finally {
    await sql.end();
  }
}
