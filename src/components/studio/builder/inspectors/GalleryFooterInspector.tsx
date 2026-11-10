'use client'

import { Button } from '@/components/common/Button'
import { SettingGroup } from '@/components/common/SettingGroup'

interface GalleryFooterInspectorProps {
  selected: string
  galleryHeading: string
  setGalleryHeading: (s: string) => void
  gallerySub: string
  setGallerySub: (s: string) => void
  footerAddress: string
  setFooterAddress: (s: string) => void
  footerPhone: string
  setFooterPhone: (s: string) => void
  footerEmail: string
  setFooterEmail: (s: string) => void
  footerCopyright: string
  setFooterCopyright: (s: string) => void
  onManageAlbumPhotos: () => void
}

export function GalleryFooterInspector({
  selected,
  galleryHeading,
  setGalleryHeading,
  gallerySub,
  setGallerySub,
  footerAddress,
  setFooterAddress,
  footerPhone,
  setFooterPhone,
  footerEmail,
  setFooterEmail,
  footerCopyright,
  setFooterCopyright,
  onManageAlbumPhotos,
}: GalleryFooterInspectorProps) {
  if (selected === 'Gallery') {
    return (
      <SettingGroup title="Photo gallery">
        <label>
          Gallery heading
          <input
            value={galleryHeading}
            onChange={(e) => setGalleryHeading(e.target.value)}
          />
        </label>
        <label>
          Subtitle
          <textarea
            value={gallerySub}
            onChange={(e) => setGallerySub(e.target.value)}
          />
        </label>
        <Button
          kind="secondary"
          onClick={onManageAlbumPhotos}
          style={{ width: '100%', marginTop: '8px' }}
        >
          Manage album photos
        </Button>
      </SettingGroup>
    )
  }

  return (
    <SettingGroup title="Footer content">
      <label>
        Campus address
        <input
          value={footerAddress}
          onChange={(e) => setFooterAddress(e.target.value)}
        />
      </label>
      <label>
        Contact phone
        <input
          value={footerPhone}
          onChange={(e) => setFooterPhone(e.target.value)}
        />
      </label>
      <label>
        Contact email
        <input
          value={footerEmail}
          onChange={(e) => setFooterEmail(e.target.value)}
        />
      </label>
      <label>
        Copyright notice
        <input
          value={footerCopyright}
          onChange={(e) => setFooterCopyright(e.target.value)}
        />
      </label>
    </SettingGroup>
  )
}
