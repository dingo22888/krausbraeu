import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_GITHUB_ID, COOKIE, appUrl, authConfigured, cookieOptions, issueSession } from '@/lib/auth';
export async function GET(request: NextRequest) {
 if(!authConfigured()) return new NextResponse('Anmeldung noch nicht eingerichtet.',{status:503});
 const state=request.nextUrl.searchParams.get('state')||'', code=request.nextUrl.searchParams.get('code'); const jar=await cookies(); const expected=jar.get('krausbraeu_oauth_state')?.value||''; jar.delete('krausbraeu_oauth_state');
 const fail=()=>NextResponse.redirect(appUrl()+'/admin?error=login');
 if(!code || !/^[a-f0-9]{64}$/.test(state) || state.length!==expected.length || !timingSafeEqual(Buffer.from(state),Buffer.from(expected))) return fail();
 try { const tokenResponse=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:process.env.GITHUB_CLIENT_ID,client_secret:process.env.GITHUB_CLIENT_SECRET,code,redirect_uri:appUrl()+'/api/auth/callback'}),signal:AbortSignal.timeout(10000)}); const token=await tokenResponse.json(); if(!tokenResponse.ok || !token.access_token) return fail();
 const userResponse=await fetch('https://api.github.com/user',{headers:{Authorization:`Bearer ${token.access_token}`,Accept:'application/vnd.github+json','User-Agent':'KrausBraeu'},cache:'no-store',signal:AbortSignal.timeout(10000)}); const user=await userResponse.json(); if(!userResponse.ok || String(user.id)!==ADMIN_GITHUB_ID) return fail(); const response=NextResponse.redirect(appUrl()+'/admin'); response.cookies.set(COOKIE,await issueSession(),{...cookieOptions,maxAge:8*3600}); return response;
 } catch { return fail(); }
}
