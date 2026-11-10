export interface AuditLogItem {
  id: string
  action: string
  entity: string
  title: string
  detail: string
  tone: string
  userName: string
  userEmail?: string | null
  initials: string
  ipAddress?: string | null
  createdAt: string
}

export type AuditCategoryFilter =
  | 'ALL'
  | 'PUBLISHING'
  | 'THEME'
  | 'DOMAINS'
  | 'MEMBERS'
  | 'COMMUNICATION'
