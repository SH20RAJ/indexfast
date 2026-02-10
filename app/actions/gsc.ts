"use server";

import { stackServerApp } from "@/stack/server";
import db from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function initiateGoogleOAuth() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    access_type: 'offline',
    prompt: 'consent', // Force to get refresh token
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

async function getValidAccessToken(userId: string) {
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!dbUser?.gscRefreshToken) {
    return null;
  }

  // Check if access token is still valid
  const now = new Date();
  if (dbUser.gscAccessToken && dbUser.gscTokenExpiry && dbUser.gscTokenExpiry > now) {
    return dbUser.gscAccessToken;
  }

  // Refresh the access token
  try {
    const { accessToken, expiresIn } = await refreshAccessToken(dbUser.gscRefreshToken);
    
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + (expiresIn || 3600));

    // Update database with new access token
    await db
      .update(users)
      .set({
        gscAccessToken: accessToken,
        gscTokenExpiry: expiryDate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
}

export async function fetchGSCSites() {
  const user = await stackServerApp.getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const accessToken = await getValidAccessToken(user.id);
    
    if (!accessToken) {
      return { error: "not_connected", needsAuth: true };
    }

    // Fetch sites from Google Search Console API
    const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "token_expired", needsAuth: true };
      }
      throw new Error(`GSC API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      sites: data.siteEntry || [],
    };
  } catch (error) {
    console.error('Error fetching GSC sites:', error);
    return { error: "fetch_failed" };
  }
}

export async function checkGSCConnection() {
  const user = await stackServerApp.getUser();
  if (!user) return false;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  return !!dbUser?.gscRefreshToken;
}

export async function disconnectGSC() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(users)
    .set({
      gscRefreshToken: null,
      gscAccessToken: null,
      gscTokenExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true };
}
