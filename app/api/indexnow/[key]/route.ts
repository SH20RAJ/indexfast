import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sites } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    
    // key will be like "a1b2c3d4e5f6g7h8.txt"
    const indexNowKey = key.replace(".txt", "");

    if (!indexNowKey) {
        return new NextResponse("Not Found", { status: 404 });
    }

    try {
        // Find if this key belongs to any verified site in our DB
        const site = await db.query.sites.findFirst({
            where: eq(sites.indexNowKey, indexNowKey)
        });

        if (!site) {
            return new NextResponse("Key not found", { status: 404 });
        }

        // Return the required plain text format (just the key itself)
        return new NextResponse(indexNowKey, {
            status: 200,
            headers: {
                "Content-Type": "text/plain",
                "Cache-Control": "public, max-age=86400" // Cache for 1 day
            }
        });

    } catch (e) {
        console.error("Error serving IndexNow key file:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
