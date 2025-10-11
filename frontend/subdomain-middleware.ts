import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/config/auth';
import { env } from './config/env';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const match =
      request.url.match(/http:\/\/([^.]+)\.localhost/) || hostname.match(/^([^.]+)\.localhost/);
    return match?.[1] || null;
  }

  const rootHost = env.NEXT_PUBLIC_ROOT_DOMAIN.split(':')[0];

  // Vercel preview URLs
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    return hostname.split('---')[0];
  }

  // Regular subdomains
  if (hostname.endsWith(`.${rootHost}`) && hostname !== `www.${rootHost}`) {
    return hostname.replace(`.${rootHost}`, '');
  }

  return null;
}

export default auth(async function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    const url = request.nextUrl;
    // এখানে path join করা হচ্ছে যাতে dashboard এর মতো route ও কাজ করে
    return NextResponse.rewrite(new URL(`/s/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/((?!api|_next|[\\w-]+\\.\\w+).*)',
};
