/* eslint-disable @typescript-eslint/no-explicit-any */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl && !envUrl.includes('localhost:4000') && !envUrl.includes('localhost:3000')) {
    return envUrl.replace(/\/+$/, '')
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host.includes('ashyshop.com')) {
      return 'https://profilebackendapi.ashyshop.com/api/v1'
    }
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return '/api/v1'
    }
  }
  return (envUrl || 'https://profilebackendapi.ashyshop.com/api/v1').replace(/\/+$/, '')
}

export const API_BASE_URL = getApiBaseUrl()

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

  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('studio_refresh_token')
  }

  public setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('studio_refresh_token', token)
    }
  }

  public clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('studio_token')
      localStorage.removeItem('studio_refresh_token')
      localStorage.removeItem('studio_school_id')
      localStorage.removeItem('studio_school_slug')
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

  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) return null
      const json = await res.json()
      const newAccess = json?.data?.accessToken || json?.accessToken
      const newRefresh = json?.data?.refreshToken || json?.refreshToken
      if (newAccess) {
        this.setAuthToken(newAccess)
        if (newRefresh) this.setRefreshToken(newRefresh)
        return newAccess
      }
      return null
    } catch {
      return null
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false,
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    const schoolId = this.getActiveSchoolId()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) headers['Authorization'] = `Bearer ${token}`
    if (schoolId) headers['x-school-id'] = schoolId

    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    try {
      const response = await fetch(url, { ...options, headers })
      const rawText = await response.text()
      let data: any
      try {
        data = JSON.parse(rawText)
      } catch {
        data = {
          success: response.ok,
          statusCode: response.status,
          message: rawText || `HTTP ${response.status}`,
        }
      }

      if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        const refreshedToken = await this.tryRefreshToken()
        if (refreshedToken) {
          return this.request<T>(endpoint, options, true)
        }
        this.clearAuthToken()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('studio:session_expired'))
        }
      }

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
