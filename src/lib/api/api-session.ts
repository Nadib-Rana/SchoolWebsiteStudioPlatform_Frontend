/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_BASE_URL =
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

export class ApiSession {
  public getAuthToken(): string | null {
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

  public getActiveSchoolSlug(): string {
    if (typeof window === 'undefined') return 'northfield-high'
    return localStorage.getItem('studio_school_slug') || 'northfield-high'
  }

  public setActiveSchoolSlug(slug: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studio_school_slug', slug)
    }
  }

  public async request<T>(
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
        const errorMsg = Array.isArray(data)
          ? data[0]?.message || `API error: ${response.status}`
          : data?.message ||
            (data?.errors && data.errors[0]?.message) ||
            `API error: ${response.status}`
        throw new Error(errorMsg)
      }

      return data
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message)
      throw err
    }
  }
}
