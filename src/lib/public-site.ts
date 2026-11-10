import { cache } from 'react'
import type {
  SchoolProfileData,
  TeacherData,
  NoticeData,
  EventData,
  GalleryPhotoData,
  AlbumData,
  PublicSiteData,
} from './public-site-types'

export type {
  SchoolProfileData,
  TeacherData,
  NoticeData,
  EventData,
  GalleryPhotoData,
  AlbumData,
  PublicSiteData,
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const getPublicSiteData = cache(
  async (slug: string): Promise<PublicSiteData | null> => {
    try {
      const normalizedSlug = slug === 'northfield' ? 'northfield-high' : slug
      const res = await fetch(
        `${API_BASE_URL}/public/site?slug=${encodeURIComponent(normalizedSlug)}`,
        {
          next: { revalidate: 60 },
        },
      )
      if (!res.ok) {
        return null
      }
      const json = await res.json()
      return json.data || null
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[getPublicSiteData] Failed to load site for '${slug}':`, message)
      return null
    }
  },
)

export const getPublicNotice = cache(
  async (slug: string, noticeId: string): Promise<NoticeData | null> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public/${encodeURIComponent(slug)}/notices/${encodeURIComponent(noticeId)}`,
        { next: { revalidate: 60 } },
      )
      if (!res.ok) return null
      const json = await res.json()
      return json.data || null
    } catch {
      return null
    }
  },
)

export const getPublicEvent = cache(
  async (slug: string, eventId: string): Promise<EventData | null> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public/${encodeURIComponent(slug)}/events/${encodeURIComponent(eventId)}`,
        { next: { revalidate: 60 } },
      )
      if (!res.ok) return null
      const json = await res.json()
      return json.data || null
    } catch {
      return null
    }
  },
)

export const getPublicTeacher = cache(
  async (slug: string, teacherId: string): Promise<TeacherData | null> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public/${encodeURIComponent(slug)}/teachers/${encodeURIComponent(teacherId)}`,
        { next: { revalidate: 60 } },
      )
      if (!res.ok) return null
      const json = await res.json()
      return json.data || null
    } catch {
      return null
    }
  },
)

export const getPublicAlbum = cache(
  async (slug: string, albumId: string): Promise<AlbumData | null> => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/public/${encodeURIComponent(slug)}/albums/${encodeURIComponent(albumId)}`,
        { next: { revalidate: 60 } },
      )
      if (!res.ok) return null
      const json = await res.json()
      return json.data || null
    } catch {
      return null
    }
  },
)
