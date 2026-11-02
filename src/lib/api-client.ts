/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * School Website Studio Platform API Client
 * Provides structured API methods to communicate with the NestJS Multi-Tenant Backend.
 */


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message?: string
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('studio_token')
  }

  public setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studio_token', token)
    }
  }

  public clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('studio_token')
      localStorage.removeItem('studio_school_id')
    }
  }

  public getActiveSchoolId(): string {
    if (typeof window === 'undefined') return 'northfield-high'
    return localStorage.getItem('studio_school_id') || 'northfield-high'
  }

  public setActiveSchoolId(schoolId: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studio_school_id', schoolId)
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const schoolId = this.getActiveSchoolId()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (schoolId) {
      headers['x-school-id'] = schoolId
    }

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`)
      }

      return data
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message)
      throw err
    }
  }

  // --- Auth Endpoints ---
  public auth = {
    login: async (identifier: string, password: string) => {
      const res = await this.request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      })
      if (res.data?.accessToken) {
        this.setAuthToken(res.data.accessToken)
        if (res.data.user?.activeSchool?.id) {
          this.setActiveSchoolId(res.data.user.activeSchool.id)
        }
      }
      return res
    },
    getProfile: async () => {
      return this.request<any>('/auth/me')
    },
    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' })
      } finally {
        this.clearAuthToken()
      }
    },
  }

  // --- Schools Endpoints ---
  public schools = {
    getMySchools: async () => {
      return this.request<any[]>('/schools/my-schools')
    },
    getById: async (schoolId: string) => {
      return this.request<any>(`/schools/${schoolId}`)
    },
    getOverview: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/overview`)
    },
    onboarding: async (data: any) => {
      return this.request<any>('/schools/onboarding', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (schoolId: string, data: any) => {
      return this.request<any>(`/schools/${schoolId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    getMembers: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any[]>(`/schools/${id}/members`)
    },
  }

  // --- Content Management (8 Sections) ---
  public content = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/content`)
    },
    update: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/content`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
  }

  // --- Theme Customization ---
  public theme = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/theme`)
    },
    saveDraft: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/theme/draft`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    publish: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/theme/publish`, {
        method: 'POST',
      })
    },
  }

  // --- Pages & Builder ---
  public pages = {
    list: async (query?: { status?: string; search?: string }, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      const searchParams = new URLSearchParams()
      if (query?.status) searchParams.set('status', query.status)
      if (query?.search) searchParams.set('search', query.search)
      return this.request<any>(`/schools/${id}/pages?${searchParams.toString()}`)
    },
    get: async (pageId: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/pages/${pageId}`)
    },
    create: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/pages`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (pageId: string, data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/pages/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (pageId: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/pages/${pageId}`, {
        method: 'DELETE',
      })
    },
    reorderSections: async (pageId: string, sectionIds: string[], schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/pages/${pageId}/sections/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({ sectionIds }),
      })
    },
  }

  // --- Teachers & Faculty ---
  public teachers = {
    list: async (query?: { department?: string; search?: string }, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      const params = new URLSearchParams()
      if (query?.department) params.set('department', query.department)
      if (query?.search) params.set('search', query.search)
      return this.request<any>(`/schools/${id}/teachers?${params.toString()}`)
    },
    create: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/teachers`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (teacherId: string, data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/teachers/${teacherId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (teacherId: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/teachers/${teacherId}`, {
        method: 'DELETE',
      })
    },
  }

  // --- Notices ---
  public notices = {
    list: async (query?: { category?: string; status?: string; search?: string }, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      const params = new URLSearchParams()
      if (query?.category) params.set('category', query.category)
      if (query?.status) params.set('status', query.status)
      if (query?.search) params.set('search', query.search)
      return this.request<any>(`/schools/${id}/notices?${params.toString()}`)
    },
    create: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/notices`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (noticeId: string, data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/notices/${noticeId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (noticeId: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/notices/${noticeId}`, {
        method: 'DELETE',
      })
    },
  }

  // --- Events ---
  public events = {
    list: async (query?: { category?: string; search?: string }, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      const params = new URLSearchParams()
      if (query?.category) params.set('category', query.category)
      if (query?.search) params.set('search', query.search)
      return this.request<any>(`/schools/${id}/events?${params.toString()}`)
    },
    create: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/events`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (eventId: string, data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/events/${eventId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    delete: async (eventId: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/events/${eventId}`, {
        method: 'DELETE',
      })
    },
  }

  // --- Gallery & Media ---
  public gallery = {
    getOverview: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/gallery`)
    },
    createAlbum: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/gallery/albums`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    getMedia: async (category?: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      const url = category ? `/schools/${id}/gallery/media?category=${category}` : `/schools/${id}/gallery/media`
      return this.request<any[]>(url)
    },
  }

  // --- Navigation ---
  public navigation = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any[]>(`/schools/${id}/navigation`)
    },
    update: async (location: string, items: any[], schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/navigation`, {
        method: 'PUT',
        body: JSON.stringify({ location, items }),
      })
    },
  }

  // --- SEO ---
  public seo = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/seo`)
    },
    update: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/seo`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
  }

  // --- Domains ---
  public domains = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/domains`)
    },
    add: async (domain: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/domains`, {
        method: 'POST',
        body: JSON.stringify({ domain }),
      })
    },
  }

  // --- Integrations ---
  public integrations = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any[]>(`/schools/${id}/integrations`)
    },
    sync: async (type: string, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/integrations/${type}/sync`, {
        method: 'POST',
      })
    },
  }

  // --- Analytics ---
  public analytics = {
    get: async (days = 30, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/analytics?days=${days}`)
    },
  }

  // --- Settings ---
  public settings = {
    get: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/settings`)
    },
    update: async (data: any, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/settings`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
  }

  // --- Publishing ---
  public publishing = {
    getStatus: async (schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/publishing/status`)
    },
    release: async (data: { versionTag: string; summary: string }, schoolId?: string) => {
      const id = schoolId || this.getActiveSchoolId()
      return this.request<any>(`/schools/${id}/publishing/release`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  }

  // --- Public Website Delivery ---
  public publicSite = {
    getSite: async (slug = 'northfield-high') => {
      return this.request<any>(`/public/site?slug=${encodeURIComponent(slug)}`)
    },
    submitInquiry: async (inquiry: {
      schoolSlug: string
      fullName: string
      email: string
      phone?: string
      subject: string
      message: string
    }) => {
      return this.request<any>('/public/inquiries', {
        method: 'POST',
        body: JSON.stringify(inquiry),
      })
    },
  }
}

export const api = new ApiClient()
export default api
