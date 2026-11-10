export interface StagedChange {
  type: string
  title: string
  detail: string
  updatedAt: string
}

export interface VersionRecord {
  id: string
  versionTag: string
  summary: string
  isCurrent: boolean
  createdAt: string
  publishedBy?: { firstName?: string; lastName?: string; username?: string }
}
