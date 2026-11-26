import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  extractBearerToken,
  sanitizeRevalidatePaths,
  sanitizeRevalidateSlug,
  verifyBearerTokenWithBackend,
} from '@/lib/revalidate-auth'

export async function POST(request: Request) {
  try {
    const token = extractBearerToken(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json(
        { revalidated: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const isAuthenticated = await verifyBearerTokenWithBackend(token)
    if (!isAuthenticated) {
      return NextResponse.json(
        { revalidated: false, error: 'Invalid or expired authorization token' },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const cleanSlug = sanitizeRevalidateSlug(body?.schoolSlug)
    if (!cleanSlug) {
      return NextResponse.json(
        { revalidated: false, error: 'Valid schoolSlug is required' },
        { status: 400 },
      )
    }

    revalidatePath(`/${cleanSlug}`, 'layout')
    revalidatePath(`/${cleanSlug}`, 'page')

    const extraPaths = sanitizeRevalidatePaths(body?.paths, cleanSlug)
    for (const p of extraPaths) {
      revalidatePath(p, 'page')
    }

    return NextResponse.json({
      revalidated: true,
      schoolSlug: cleanSlug,
      paths: extraPaths,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : 'Revalidation failed',
      },
      { status: 500 },
    )
  }
}
