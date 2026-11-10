/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * School Website Studio Platform API Client
 * Provides structured API methods to communicate with the NestJS Multi-Tenant Backend.
 */
import {
  API_BASE_URL,
  type ApiResponse,
  ApiSession,
} from './api/api-session'
import { createAuthAndStorageEndpoints } from './api/api-auth-storage'
import { createContentEndpoints } from './api/api-content'
import { createSiteConfigEndpoints } from './api/api-site-config'
import { createAcademicEndpoints } from './api/api-academic'
import { createGalleryEndpoints } from './api/api-gallery'

export { API_BASE_URL, type ApiResponse }

export class ApiClient {
  private session = new ApiSession()

  public getAuthToken(): string | null {
    return this.session.getAuthToken()
  }

  public setAuthToken(token: string) {
    this.session.setAuthToken(token)
  }

  public clearAuthToken() {
    this.session.clearAuthToken()
  }

  public getActiveSchoolId(): string {
    return this.session.getActiveSchoolId()
  }

  public setActiveSchoolId(schoolId: string) {
    this.session.setActiveSchoolId(schoolId)
  }

  public getActiveSchoolSlug(): string {
    return this.session.getActiveSchoolSlug()
  }

  public setActiveSchoolSlug(slug: string) {
    this.session.setActiveSchoolSlug(slug)
  }

  public request<T>(endpoint: string, options: RequestInit = {}) {
    return this.session.request<T>(endpoint, options)
  }

  private authAndStorage = createAuthAndStorageEndpoints(this.session)
  private contentEndpoints = createContentEndpoints(this.session)
  private siteConfigEndpoints = createSiteConfigEndpoints(this.session)
  private academicEndpoints = createAcademicEndpoints(this.session)
  private galleryEndpoints = createGalleryEndpoints(this.session)

  public auth = this.authAndStorage.auth
  public storage = this.authAndStorage.storage
  public publicSite = this.authAndStorage.publicSite
  public inquiries = this.authAndStorage.inquiries

  public schools = this.contentEndpoints.schools
  public content = this.contentEndpoints.content
  public theme = this.contentEndpoints.theme
  public pages = this.contentEndpoints.pages
  public sections = this.contentEndpoints.sections

  public navigation = this.siteConfigEndpoints.navigation
  public seo = this.siteConfigEndpoints.seo
  public domains = this.siteConfigEndpoints.domains
  public integrations = this.siteConfigEndpoints.integrations
  public settings = this.siteConfigEndpoints.settings
  public publishing = this.siteConfigEndpoints.publishing
  public analytics = this.siteConfigEndpoints.analytics
  public auditLogs = this.siteConfigEndpoints.auditLogs

  public teachers = this.academicEndpoints.teachers
  public notices = this.academicEndpoints.notices
  public events = this.academicEndpoints.events
  public admissions = this.academicEndpoints.admissions

  public gallery = this.galleryEndpoints.gallery
}

export const api = new ApiClient()
export default api
