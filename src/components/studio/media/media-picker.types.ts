export interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  title?: string
  currentUrl?: string
}

export interface MediaAssetItem {
  id?: string
  url: string
  name: string
  size?: string
  mimeType?: string
}
