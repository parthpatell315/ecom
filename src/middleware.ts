import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Maintenance / Coming Soon Gatekeeper Middleware
 * Routes all visitor traffic to /coming-soon while preserving
 * access to /admin, API endpoints, webhooks, and static assets.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow Admin portal, API routes, and webhooks
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Allow Next.js internals, static images, and metadata assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/coming-soon')
  ) {
    return NextResponse.next();
  }

  // 3. Rewrite all visitor routes to /coming-soon
  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
