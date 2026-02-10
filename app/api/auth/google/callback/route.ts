import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack/server';
import db from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/dashboard?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));
  }

  try {
    // Get the current user from StackAuth
    const user = await stackServerApp.getUser({ tokenStore: request });
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${new URL(request.url).origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }

    const tokens = await tokenResponse.json();

    // Calculate token expiry
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + (tokens.expires_in || 3600));

    // Store tokens in database
    await db
      .update(users)
      .set({
        gscRefreshToken: tokens.refresh_token,
        gscAccessToken: tokens.access_token,
        gscTokenExpiry: expiryDate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.redirect(new URL('/dashboard?gsc_connected=true', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=callback_failed', request.url));
  }
}
