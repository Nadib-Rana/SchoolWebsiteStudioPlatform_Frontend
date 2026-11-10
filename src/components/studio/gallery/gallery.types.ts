export interface AlbumItem {
  id: string
  title: string
  coverUrl: string
  photosCount: number
  description?: string
}

export interface PhotoItem {
  id: string
  url: string
  caption?: string
  thumbnailUrl?: string
  order?: number
}

export interface InspectAlbumData {
  id: string
  title: string
  description?: string
  coverUrl?: string
  photos: PhotoItem[]
}
