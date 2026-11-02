export interface DataTableRow {
  [key: string]: string
}

export type TableRowData = string[]

export interface AcademicCardItem {
  title: string
  count: string
  description: string
  iconType: number
}

export interface AlbumItem {
  title: string
  image: string
  photoCount: string
  isFeatured?: boolean
}

export interface MediaItemData {
  url: string
  filename: string
  size: string
  isDocument?: boolean
}

export interface IntegrationData {
  icon: 'layers' | 'plug'
  title: string
  label: string
  description: string
  items: string[]
  footer: string
  action: string
}
