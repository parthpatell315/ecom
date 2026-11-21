import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Gatekeeper Middleware
 * Returns 404 for all visitor requests while preserving
 * access to /admin, API endpoints, webhooks, and essential assets.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Admin portal, API routes, and webhooks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Allow Next.js internals, favicon, and essential assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/404')
  ) {
    return NextResponse.next();
  }

  // 3. Rewrite all visitor routes to /404 with 404 status
  const url = request.nextUrl.clone();
  url.pathname = '/404';
  return NextResponse.rewrite(url, { status: 404 });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
};
