import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawSlug = typeof body?.schoolSlug === 'string' ? body.schoolSlug.trim() : ''
    const cleanSlug = rawSlug.replace(/[^a-zA-Z0-9-_]/g, '')

    if (cleanSlug) {
      revalidatePath(`/${cleanSlug}`, 'layout')
      revalidatePath(`/${cleanSlug}`, 'page')
    } else {
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({
      revalidated: true,
      schoolSlug: cleanSlug || null,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err?.message || 'Revalidation failed' },
      { status: 500 },
    )
  }
}

