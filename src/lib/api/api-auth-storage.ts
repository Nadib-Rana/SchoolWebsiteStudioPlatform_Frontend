/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL, type ApiSession } from './api-session'

export function createAuthAndStorageEndpoints(session: ApiSession) {
  return {
    auth: {
      register: async (data: {
        email: string
        password: string
        firstName?: string
        lastName?: string
        username?: string
      }) => {
        return session.request<any>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      login: async (identifier: string, password: string) => {
        const res = await session.request<any>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
        })
        if (res.data?.accessToken) {
          session.setAuthToken(res.data.accessToken)
          if (res.data.refreshToken) {
            session.setRefreshToken(res.data.refreshToken)
          }
          const currentStored = session.getActiveSchoolId()
          const defaultSchool = res.data.user?.activeSchool
          if (defaultSchool?.id) {
            if (!currentStored || currentStored === 'northfield-high') {
              session.setActiveSchoolId(defaultSchool.id)
              if (defaultSchool.slug) {
                session.setActiveSchoolSlug(defaultSchool.slug)
              }
            }
          }
        }
        return res
      },
      getProfile: async () => {
        return session.request<any>('/auth/me')
      },
      logout: async () => {
        try {
          const refreshToken = session.getRefreshToken()
          if (refreshToken) {
            await session.request('/auth/logout', {
              method: 'POST',
              body: JSON.stringify({ refreshToken }),
            })
          }
        } catch {
          // ignore logout network errors
        } finally {
          session.clearAuthToken()
        }
      },
    },

    storage: {
      upload: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const token = session.getAuthToken()
        const headers: Record<string, string> = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${API_BASE_URL}/storage/upload`, {
          method: 'POST',
          headers,
          body: formData,
        })
        const json = await res.json()
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to upload file to MinIO')
        }
        return json.data as { key: string; publicUrl: string }
      },
      getPresignedUploadUrl: async (filename: string, bucket?: string) => {
        return session.request<{
          uploadUrl: string
          key: string
          publicUrl: string
        }>('/storage/presign-upload', {
          method: 'POST',
          body: JSON.stringify({ filename, bucket }),
        })
      },
      delete: async (key: string, bucket?: string) => {
        return session.request<{ success: boolean; key: string }>(
          '/storage/delete',
          {
            method: 'POST',
            body: JSON.stringify({ key, bucket }),
          },
        )
      },
    },

    publicSite: {
      getSite: async (slug = 'northfield-high') => {
        return session.request<any>(
          `/public/site?slug=${encodeURIComponent(slug)}`,
        )
      },
      submitInquiry: async (inquiry: {
        schoolSlug: string
        fullName: string
        email: string
        phone?: string
        subject: string
        message: string
      }) => {
        return session.request<any>('/public/inquiries', {
          method: 'POST',
          body: JSON.stringify(inquiry),
        })
      },
    },
  }
}
