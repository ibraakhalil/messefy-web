import { NextResponse, type NextRequest } from 'next/server';
import { hasLocale } from 'next-intl';
import { localeCookieName, locales } from '@/i18n/config';

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const locale =
    typeof body === 'object' && body !== null && 'locale' in body ? body.locale : undefined;

  if (!hasLocale(locales, locale)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
