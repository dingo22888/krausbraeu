import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
export const ADMIN_GITHUB_ID = '5803616';
export const COOKIE = 'krausbraeu_session';
export function authConfigured() { return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.AUTH_SECRET && process.env.APP_URL); }
function key() { const secret=process.env.AUTH_SECRET; if (!secret || secret.length<32) throw new Error('AUTH_SECRET muss mindestens 32 Zeichen haben.'); return new TextEncoder().encode(secret); }
export function appUrl() { const url=process.env.APP_URL; if(!url) throw new Error('APP_URL fehlt.'); return new URL(url).origin; }
export async function isAdmin() { if(!authConfigured()) return false; const token=(await cookies()).get(COOKIE)?.value; if(!token) return false; try { const {payload}=await jwtVerify(token,key(),{algorithms:['HS256'],issuer:'krausbraeu',audience:'admin'}); return payload.sub===ADMIN_GITHUB_ID; } catch { return false; } }
export async function requireAdmin() { if(!await isAdmin()) redirect('/admin'); }
export async function issueSession() { return new SignJWT({}).setProtectedHeader({alg:'HS256'}).setSubject(ADMIN_GITHUB_ID).setIssuer('krausbraeu').setAudience('admin').setIssuedAt().setExpirationTime('8h').sign(key()); }
export const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/'};
