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
      getClasses: async (schoolSlug: string) => {
        return session.request<{
          source: 'ERP' | 'LOCAL'
          erpConnected: boolean
          classes: Array<{
            id: string
            name: string
            section?: string
            capacity?: number
            admissionFee?: number
          }>
        }>(`/public/admissions/${encodeURIComponent(schoolSlug)}/classes`)
      },
      getFeeConfig: async (schoolSlug: string) => {
        return session.request<{
          source?: 'ERP' | 'LOCAL'
          erpConnected?: boolean
          enabled: boolean
          currency: string
          defaultFee: number
          classFees: Record<string, number>
          allowOnlinePayment: boolean
          allowManualPayment: boolean
          manualInstructions?: string
          activeGateways: string[]
        }>(`/public/admissions/${encodeURIComponent(schoolSlug)}/fee-config`)
      },
      payOnline: async (
        schoolSlug: string,
        data: {
          applicationNumber: string
          identifier: string
          gateway: string
          callbackBaseUrl: string
        },
      ) => {
        return session.request<{
          gateway: string
          applicationNumber: string
          feeAmount: number
          currency: string
          redirectUrl: string
          transactionId: string
          mode?: string
        }>(`/public/admissions/${encodeURIComponent(schoolSlug)}/pay-online`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      verifyOnlinePayment: async (
        schoolSlug: string,
        data: {
          applicationNumber: string
          identifier: string
          gateway: string
          transactionId?: string
          valId?: string
          paymentID?: string
        },
      ) => {
        return session.request<{
          verified: boolean
          applicationNumber?: string
          paymentStatus: string
          paymentMethod?: string
          transactionId?: string
          feeAmount?: number
          paidAt?: string
        }>(
          `/public/admissions/${encodeURIComponent(schoolSlug)}/verify-online-payment`,
          {
            method: 'POST',
            body: JSON.stringify(data),
          },
        )
      },
      payManual: async (
        schoolSlug: string,
        data: {
          applicationNumber: string
          identifier: string
          paymentMethod: string
          transactionId: string
          paymentNote?: string
        },
      ) => {
        return session.request<{
          paymentStatus: string
          feeAmount?: number
          transactionId?: string
          paymentMethod?: string
        }>(`/public/admissions/${encodeURIComponent(schoolSlug)}/pay-manual`, {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      apply: async (data: {
        schoolSlug: string
        firstName?: string
        lastName?: string
        studentName?: string
        dateOfBirth: string
        gender: string
        phone?: string
        email?: string
        bloodGroup?: string
        birthRegistrationNo?: string
        fatherName?: string
        motherName?: string
        applyingForGrade: string
        appliedClassId?: string
        previousSchool?: string
        guardianName: string
        guardianRelationship: string
        guardianPhone: string
        guardianEmail?: string
        address?: string
        presentAddress?: string
        permanentAddress?: string
        documentsUrl?: string
        documents?: Record<string, string>
        photoUrl?: string
      }) => {
        return session.request<{
          success: boolean
          source?: 'ERP' | 'ERP_PENDING_SYNC' | 'LOCAL'
          queued?: boolean
          applicationNumber: string
          studentName: string
          status: string
          feeAmount?: number
          paymentStatus?: string
          currency?: string
          message: string
        }>('/public/admissions/apply', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      },
      track: async (
        applicationNumber: string,
        identifier?: string,
        schoolSlug?: string,
      ) => {
        const params = new URLSearchParams()
        params.append('applicationNumber', applicationNumber)
        if (identifier) {
          params.append('identifier', identifier)
          params.append('guardianPhone', identifier)
        }
        if (schoolSlug) params.append('schoolSlug', schoolSlug)
        return session.request<{
          source?: 'ERP' | 'LOCAL'
          applicationNumber: string
          schoolName: string
          studentName: string
          applyingForGrade: string
          status: string
          interviewDate?: string | null
          notes?: string
          feeAmount?: number
          paymentStatus?: string
          paymentMethod?: string | null
          transactionId?: string | null
          paymentNote?: string | null
          paidAt?: string | null
          currency?: string
          submittedAt: string
          lastUpdatedAt: string
        }>(`/public/admissions/track?${params.toString()}`)
      },
      verifyAlumni: async (schoolSlug: string, code: string) => {
        const params = new URLSearchParams({ code })
        return session.request<any>(
          `/public/${encodeURIComponent(schoolSlug)}/alumni/verify?${params.toString()}`,
        )
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
