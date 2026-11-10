export interface SchoolProfileData {
  established?: number
  motto?: string
  shortBio?: string
  principalName?: string
  principalTitle?: string
  principalBio?: string
  principalPhotoUrl?: string
  coverUrl?: string
  visionStatement?: string
  missionStatement?: string
  address?: string
  phone?: string
  email?: string
  officeHours?: string
  emergencyPhone?: string
  socialLinks?: Record<string, string>
  stats?: Array<{ label: string; value: string }> | Record<string, string>
  academics?: Record<string, unknown>
}

export interface TeacherData {
  id: string
  name: string
  designation: string
  department: string
  qualification?: string | null
  email?: string | null
  phone?: string | null
  photoUrl?: string | null
  bio?: string | null
  order?: number
  status?: string
}

export interface NoticeData {
  id: string
  slug?: string | null
  title: string
  category: string
  description: string
  fileUrl?: string | null
  isPinned: boolean
  priority: string
  publishDate: string
}

export interface EventData {
  id: string
  title: string
  description?: string | null
  category: string
  eventDate: string
  endDate?: string | null
  time?: string | null
  venue?: string | null
  bannerUrl?: string | null
  registrationUrl?: string | null
}

export interface GalleryPhotoData {
  id: string
  url: string
  caption?: string | null
  thumbnailUrl?: string | null
}

export interface AlbumData {
  id: string
  title: string
  slug: string
  description?: string | null
  coverUrl?: string | null
  category?: string | null
  photosCount: number
  photos: GalleryPhotoData[]
}

export interface PublicSiteData {
  school: {
    id: string
    name: string
    slug: string
    customDomain?: string | null
    logoUrl?: string | null
    faviconUrl?: string | null
    isPublished: boolean
  }
  profile?: SchoolProfileData
  theme?: {
    activeTheme: string
    selectedTemplate: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontHeading: string
    fontBody: string
    buttonRadius: string
    buttonShadow: string
    cardStyle: string
    headerLayout: string
    footerLayout: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
    keywords?: string[]
  }
  settings?: {
    allowPublicAdmission?: boolean
    showNoticeBoard?: boolean
    showEventsCalendar?: boolean
  }
  navigation?: Array<{ label: string; url: string; order?: number }>
  pages?: Array<Record<string, unknown>>
  teachers?: TeacherData[]
  notices?: NoticeData[]
  events?: EventData[]
  albums?: AlbumData[]
}
