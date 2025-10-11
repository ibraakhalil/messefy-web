import { NextResponse } from 'next/server';
import { auth } from '@/config/auth';

const protectedRoutes = ['/mess', '/profile'];
const publicRoutes = ['/auth/signin', '/auth/signup'];

export default auth(async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = !!request.auth;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/((?!api|_next|[\\w-]+\\.\\w+).*)',
};
