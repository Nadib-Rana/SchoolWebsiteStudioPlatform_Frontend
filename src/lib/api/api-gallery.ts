/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiSession } from './api-session'

export function createGalleryEndpoints(session: ApiSession) {
  return {
    gallery: {
      getOverview: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery`)
      },
      getAlbums: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any[]>(`/schools/${id}/gallery/albums`)
      },
      getAlbum: async (albumId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/albums/${albumId}`)
      },
      createAlbum: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/albums`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      updateAlbum: async (albumId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/albums/${albumId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      deleteAlbum: async (albumId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/albums/${albumId}`, {
          method: 'DELETE',
        })
      },
      addPhotoToAlbum: async (
        albumId: string,
        photo: { url: string; caption?: string },
        schoolId?: string,
      ) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(
          `/schools/${id}/gallery/albums/${albumId}/photos`,
          {
            method: 'POST',
            body: JSON.stringify(photo),
          },
        )
      },
      deletePhoto: async (albumId: string, photoId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/albums/${albumId}/photos/${photoId}`, {
          method: 'DELETE',
        })
      },
      getMedia: async (category?: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        const url = category ? `/schools/${id}/gallery/media?category=${category}` : `/schools/${id}/gallery/media`
        return session.request<any[]>(url)
      },
      createMedia: async (data: {
        filename: string
        originalName: string
        mimeType: string
        sizeBytes: number
        url: string
        thumbnailUrl?: string
        category?: string
        tags?: string[]
      }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/media`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      deleteMedia: async (assetId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/gallery/media/${assetId}`, {
          method: 'DELETE',
        })
      },
    },
  }
}
