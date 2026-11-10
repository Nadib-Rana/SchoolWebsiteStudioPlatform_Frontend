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
  publishedBy?: { firstName?: string; lastName?: string; username?: string } | string
  snapshotData?: {
    school?: any
    profile?: any
    themeConfig?: any
    pages?: any[]
    menu?: any
    notes?: string
    timestamp?: string
  }
}

export interface CreateBackupParams {
  label: string
  notes?: string
  versionTag?: string
}

export interface RestoreVersionParams {
  versionId: string
  versionTag: string
  summary: string
}
