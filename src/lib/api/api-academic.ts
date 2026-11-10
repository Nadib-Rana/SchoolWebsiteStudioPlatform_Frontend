/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiSession } from './api-session'

export function createAcademicEndpoints(session: ApiSession) {
  return {
    teachers: {
      list: async (query?: { department?: string; search?: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        const params = new URLSearchParams()
        if (query?.department) params.set('department', query.department)
        if (query?.search) params.set('search', query.search)
        return session.request<any>(`/schools/${id}/teachers?${params.toString()}`)
      },
      create: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/teachers`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (teacherId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/teachers/${teacherId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      delete: async (teacherId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/teachers/${teacherId}`, {
          method: 'DELETE',
        })
      },
    },

    notices: {
      list: async (query?: { category?: string; status?: string; search?: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        const params = new URLSearchParams()
        if (query?.category) params.set('category', query.category)
        if (query?.status) params.set('status', query.status)
        if (query?.search) params.set('search', query.search)
        return session.request<any>(`/schools/${id}/notices?${params.toString()}`)
      },
      create: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/notices`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (noticeId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/notices/${noticeId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      delete: async (noticeId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/notices/${noticeId}`, {
          method: 'DELETE',
        })
      },
    },

    events: {
      list: async (query?: { category?: string; search?: string }, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        const params = new URLSearchParams()
        if (query?.category) params.set('category', query.category)
        if (query?.search) params.set('search', query.search)
        return session.request<any>(`/schools/${id}/events?${params.toString()}`)
      },
      create: async (data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/events`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      update: async (eventId: string, data: any, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/events/${eventId}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        })
      },
      delete: async (eventId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/events/${eventId}`, {
          method: 'DELETE',
        })
      },
    },

    admissions: {
      apply: async (data: {
        schoolSlug: string
        studentName: string
        dateOfBirth: string
        gender: string
        applyingForGrade: string
        previousSchool?: string
        guardianName: string
        guardianRelationship: string
        guardianPhone: string
        guardianEmail: string
        address: string
        documents?: Record<string, string>
      }) => {
        return session.request<{
          success: boolean
          applicationNumber: string
          studentName: string
          status: string
          message: string
        }>('/public/admissions/apply', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      track: async (applicationNumber: string, guardianPhone?: string) => {
        const params = new URLSearchParams()
        params.append('applicationNumber', applicationNumber)
        if (guardianPhone) params.append('guardianPhone', guardianPhone)
        return session.request<{
          applicationNumber: string
          schoolName: string
          studentName: string
          applyingForGrade: string
          status: string
          notes?: string
          submittedAt: string
          lastUpdatedAt: string
        }>(`/public/admissions/track?${params.toString()}`)
      },
      list: async (
        schoolId?: string,
        query?: { search?: string; status?: string; grade?: string },
      ) => {
        const id = schoolId || session.getActiveSchoolId()
        const params = new URLSearchParams()
        if (query?.search) params.append('search', query.search)
        if (query?.status) params.append('status', query.status)
        if (query?.grade) params.append('grade', query.grade)
        const qs = params.toString() ? `?${params.toString()}` : ''
        return session.request<any[]>(`/schools/${id}/admissions${qs}`)
      },
      get: async (appId: string, schoolId?: string) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/admissions/${appId}`)
      },
      updateStatus: async (
        appId: string,
        status: string,
        notes?: string,
        schoolId?: string,
      ) => {
        const id = schoolId || session.getActiveSchoolId()
        return session.request<any>(`/schools/${id}/admissions/${appId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, notes }),
        })
      },
    },
  }
}
