/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiSession } from './api-session'

export function createContentEndpoints(session: ApiSession) {
  return {
    schools: {
      getMySchools: async () => {
        return session.request<any[]>('/schools/my-schools')
      },
      getById: async (schoolId: string) => {
        return session.request<any>(`/schools/${schoolId}`)
      },
      getOverview: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/overview`)
      },
      onboarding: async (data: any) => {
        return session.request<any>('/schools/onboarding', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (schoolId: string, data: any) => {
        return session.request<any>(`/schools/${schoolId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      getMembers: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any[]>(`/schools/${id}/members`)
      },
      addMember: async (data: { email: string; role: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/members`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      updateMemberRole: async (memberId: string, role: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/members/${memberId}`, {
          method: 'PATCH',
          body: JSON.stringify({ role }),
        })
      },
      removeMember: async (userId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/members/${userId}`, {
          method: 'DELETE',
        })
      },
    },

    content: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/content`)
      },
      update: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/content`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
    },

    theme: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/theme`)
      },
      saveDraft: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/theme/draft`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      publish: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/theme/publish`, {
          method: 'POST',
        })
      },
    },

    pages: {
      list: async (query?: { status?: string; search?: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        const searchParams = new URLSearchParams()
        if (query?.status) searchParams.set('status', query.status)
        if (query?.search) searchParams.set('search', query.search)
        return session.request<any>(`/schools/${id}/pages?${searchParams.toString()}`)
      },
      get: async (pageId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}`)
      },
      create: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (pageId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      delete: async (pageId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}`, {
          method: 'DELETE',
        })
      },
      reorderSections: async (pageId: string, sectionIds: string[], schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}/sections/reorder`, {
          method: 'PATCH',
          body: JSON.stringify({ sectionIds }),
        })
      },
    },

    sections: {
      create: async (pageId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}/sections`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (pageId: string, sectionId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}/sections/${sectionId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      delete: async (pageId: string, sectionId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/pages/${pageId}/sections/${sectionId}`, {
          method: 'DELETE',
        })
      },
    },
  }
}
