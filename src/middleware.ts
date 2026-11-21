import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isPlatformHost(hostname: string): boolean {
  const cleanHost = hostname.split(':')[0].toLowerCase()

  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1') return true

  const envUrls = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
  ].filter(Boolean) as string[]

  for (const urlStr of envUrls) {
    try {
      const configuredHost = new URL(urlStr).hostname.toLowerCase()
      if (cleanHost === configuredHost || cleanHost.endsWith(`.${configuredHost}`)) {
        return true
      }
    } catch {}
  }

  if (process.env.PLATFORM_DOMAIN && cleanHost.includes(process.env.PLATFORM_DOMAIN.toLowerCase())) {
    return true
  }

  const platformPatterns = [
    'ashyshop.com',
    'digizonex.com',
    'schoolstudio.site',
    'vercel.app',
    'railway.app',
    'render.com',
    'dokploy',
    'coolify',
  ]
  return platformPatterns.some((pattern) => cleanHost.includes(pattern))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''

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

  // If a school accesses via an external custom domain, rewrite internally (including '/')
  if (!isPlatformHost(hostname)) {
    const cleanHost = hostname.split(':')[0].toLowerCase()
    const targetPath = pathname === '/' ? '' : pathname
    return NextResponse.rewrite(new URL(`/${cleanHost}${targetPath}`, request.url))
  }

  // Platform host: skip studio application core routes
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/preview') ||
    pathname.startsWith('/onboarding')
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
