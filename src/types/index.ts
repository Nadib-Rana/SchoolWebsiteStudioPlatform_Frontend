export * from './studio'
export * from './theme'
export * from './content'

export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  role?: string
  createdAt?: string
}
