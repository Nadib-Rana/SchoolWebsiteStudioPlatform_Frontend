export interface DataManagerProps {
  type: string
  refreshKey?: number
}

export interface DataItem {
  id: string
  cells: string[]
}
