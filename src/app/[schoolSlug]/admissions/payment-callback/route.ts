import { NextRequest, NextResponse } from 'next/server'

function resolvePublicOrigin(request: NextRequest): string {
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()
  const forwardedHost = request.headers
    .get('x-forwarded-host')
    ?.split(',')[0]
    ?.trim()
  const host =
    forwardedHost || request.headers.get('host') || request.nextUrl.host

  if (host) {
    const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')
    const proto = forwardedProto || (isLocal ? 'http' : 'https')
    return `${proto}://${host}`
  }

  return request.nextUrl.origin
}

function resolveAdmissionsPath(
  request: NextRequest,
  schoolSlug: string,
): string {
  const rawHost =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''
  const cleanHost = rawHost.split(':')[0].trim().toLowerCase()
  if (cleanHost && cleanHost === schoolSlug.toLowerCase()) {
    return '/admissions'
  }
  return `/${encodeURIComponent(schoolSlug)}/admissions`
}

function buildRedirectResponse(
  request: NextRequest,
  schoolSlug: string,
  extraParams?: Record<string, string>,
): NextResponse {
  const origin = resolvePublicOrigin(request)
  const targetPath = resolveAdmissionsPath(request, schoolSlug)
  const targetUrl = new URL(targetPath, origin)

  request.nextUrl.searchParams.forEach((value, key) => {
    if (value !== undefined && value !== null && value !== '') {
      targetUrl.searchParams.set(key, value)
    }
  })

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value) {
        targetUrl.searchParams.set(key, value)
      }
    }
  }

  targetUrl.searchParams.set('payCallback', '1')
  return NextResponse.redirect(targetUrl, { status: 303 })
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ schoolSlug: string }> },
) {
  const { schoolSlug } = await context.params
  return buildRedirectResponse(request, schoolSlug)
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ schoolSlug: string }> },
) {
  const { schoolSlug } = await context.params
  const extra: Record<string, string> = {}

  try {
    const contentType = (
      request.headers.get('content-type') || ''
    ).toLowerCase()

    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData()
      formData.forEach((value, key) => {
        if (typeof value === 'string' && value.trim()) {
          extra[key] = value.trim()
        }
      })
    } else if (contentType.includes('application/json')) {
      const json = (await request.json()) as Record<string, unknown>
      if (json && typeof json === 'object') {
        for (const [key, val] of Object.entries(json)) {
          if (typeof val === 'string' || typeof val === 'number') {
            extra[key] = String(val)
          }
        }
      }
    } else {
      const text = await request.text()
      if (text) {
        const parsed = new URLSearchParams(text)
        parsed.forEach((value, key) => {
          if (value.trim()) extra[key] = value.trim()
        })
      }
    }
  } catch {
    // Still redirect with existing query params even if body parsing fails
  }

  return buildRedirectResponse(request, schoolSlug, extra)
}
