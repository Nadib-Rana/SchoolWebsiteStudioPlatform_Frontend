'use client'

import { campusImage, heroImage, interiorImage } from '@/config/templates'
import type { DeviceType } from '@/types/theme'
import type { SectionStyle } from '../builder.types'

interface CanvasGalleryProps {
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  device: DeviceType
  galleryHeading: string
  gallerySub: string
}

export function CanvasGallery({
  sectionStyles,
  selected,
  setSelected,
  device,
  galleryHeading,
  gallerySub,
}: CanvasGalleryProps) {
  const galleryStyle = sectionStyles['Gallery']

  return (
    <div
      id={galleryStyle?.customId || 'canvas-gallery'}
      onClick={() => setSelected('Gallery')}
      className={galleryStyle?.customClass || ''}
      style={{
        padding:
          galleryStyle?.padding === 'compact'
            ? '16px 25px'
            : galleryStyle?.padding === 'spacious'
            ? '55px 30px'
            : '30px',
        background: galleryStyle?.bg || '#ffffff',
        textAlign: galleryStyle?.align || 'center',
        cursor: 'pointer',
        position: 'relative',
        display:
          galleryStyle?.hideOnMobile && device === 'mobile'
            ? 'none'
            : 'block',
        outline: selected === 'Gallery' ? '2px solid #2563eb' : 'none',
        outlineOffset: '-2px',
        ...(galleryStyle?.border
          ? {
              borderTop: '2px solid #2563eb',
              borderBottom: '2px solid #2563eb',
            }
          : {}),
        ...(galleryStyle?.shadow === 'subtle'
          ? { boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }
          : galleryStyle?.shadow === 'card'
          ? { boxShadow: '0 10px 25px rgba(0,0,0,0.12)' }
          : {}),
      }}
    >
      {selected === 'Gallery' && (
        <div className="selection-label">Gallery</div>
      )}
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <small
          style={{
            fontSize: '11px',
            color: '#2563eb',
            fontWeight: 700,
            letterSpacing: '1px',
          }}
        >
          PHOTO ALBUMS
        </small>
        <h3
          style={{
            margin: '4px 0 6px',
            fontSize: '18px',
            color: '#0f172a',
          }}
        >
          {galleryHeading}
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          {gallerySub}
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        <img
          src={campusImage}
          alt="Campus"
          style={{
            width: '100%',
            height: '110px',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
        <img
          src={interiorImage}
          alt="Interior"
          style={{
            width: '100%',
            height: '110px',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
        <img
          src={heroImage}
          alt="Students"
          style={{
            width: '100%',
            height: '110px',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
      </div>
    </div>
  )
}
