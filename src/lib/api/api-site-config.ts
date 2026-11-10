/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiSession } from './api-session'

export function createSiteConfigEndpoints(session: ApiSession) {
  return {
    navigation: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any[]>(`/schools/${id}/navigation`)
      },
      update: async (location: string, items: any[], schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/navigation`, {
          method: 'PUT',
          body: JSON.stringify({ location, items }),
        })
      },
    },

    seo: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/seo`)
      },
      update: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/seo`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
    },

    domains: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/domains`)
      },
      add: async (domain: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/domains`, {
          method: 'POST',
          body: JSON.stringify({ domain }),
        })
      },
      verify: async (domainId: string, simulate = false, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/domains/${domainId}/verify`, {
          method: 'POST',
          body: JSON.stringify({ simulate }),
        })
      },
      setPrimary: async (domainId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/domains/${domainId}/set-primary`, {
          method: 'POST',
        })
      },
      remove: async (domainId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/domains/${domainId}`, {
          method: 'DELETE',
        })
      },
    },

    integrations: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any[]>(`/schools/${id}/integrations`)
      },
      sync: async (type: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/integrations/${type}/sync`, {
          method: 'POST',
        })
      },
    },

    settings: {
      get: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/settings`)
      },
      update: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/settings`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
    },

    publishing: {
      getStatus: async (schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/publishing/status`)
      },
      release: async (data: { versionTag: string; summary: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/publishing/release`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      toggleStatus: async (isPublished: boolean, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/publishing/toggle-status`, {
          method: 'POST',
          body: JSON.stringify({ isPublished }),
        })
      },
      createBackup: async (
        data: { label?: string; notes?: string; versionTag?: string },
        schoolId?: string
      ) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/publishing/backups`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      restoreVersion: async (
        versionId: string,
        data?: { reason?: string },
        schoolId?: string
      ) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(
          `/schools/${id}/publishing/versions/${versionId}/restore`,
          {
            method: 'POST',
            body: JSON.stringify(data || {}),
          }
        )
      },
      getVersion: async (versionId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/publishing/versions/${versionId}`)
      },
      deleteVersion: async (versionId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(
          `/schools/${id}/publishing/versions/${versionId}`,
          { method: 'DELETE' }
        )
      },
    },

    analytics: {
      get: async (days = 30, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/analytics?days=${days}`)
      },
    },

    auditLogs: {
      list: async (limit = 50, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any[]>(`/schools/${id}/audit-logs?limit=${limit}`)
      },
    },
  }
}
