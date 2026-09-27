import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { authConfigured, appUrl, cookieOptions } from '@/lib/auth';
export async function GET() { if(!authConfigured()) return NextResponse.json({error:'Anmeldung noch nicht eingerichtet.'},{status:503}); const state=randomBytes(32).toString('hex'); const url=new URL('https://github.com/login/oauth/authorize'); url.searchParams.set('client_id',process.env.GITHUB_CLIENT_ID!); url.searchParams.set('redirect_uri',appUrl()+'/api/auth/callback'); url.searchParams.set('state',state); const response=NextResponse.redirect(url); response.cookies.set('krausbraeu_oauth_state',state,{...cookieOptions,maxAge:600}); return response; }
