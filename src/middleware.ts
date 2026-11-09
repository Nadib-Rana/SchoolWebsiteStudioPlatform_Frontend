import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Skip static files, api routes, and Next.js internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // Check if request is accessing via a custom domain (non-localhost, non-default app platform)
  const isLocalhost =
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('schoolstudio.site')

  // If a school accesses via an external custom domain, rewrite internally
  if (!isLocalhost && !pathname.startsWith('/login') && !pathname.startsWith('/preview')) {
    const cleanHost = hostname.split(':')[0].toLowerCase()
    return NextResponse.rewrite(new URL(`/${cleanHost}${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
