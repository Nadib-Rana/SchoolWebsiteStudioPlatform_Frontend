'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import { ImageUploadControl } from '@/components/common/ImageUploadControl'
import { heroImage } from '@/config/templates'

interface HeroInspectorProps {
  eyebrow: string
  setEyebrow: (s: string) => void
  heading: string
  setHeading: (s: string) => void
  description: string
  setDescription: (s: string) => void
  buttonLabel: string
  setButtonLabel: (s: string) => void
  buttonLink: string
  setButtonLink: (s: string) => void
  heroBg: string | null
  setHeroBg: (url: string | null) => void
  heroImages: string[]
  setHeroImages: (urls: string[]) => void
  sliderIntervalSec: number
  setSliderIntervalSec: (sec: number) => void
  overlayOpacity: number
  setOverlayOpacity: (n: number) => void
}

const MAX_SLIDES = 6

export function HeroInspector({
  eyebrow,
  setEyebrow,
  heading,
  setHeading,
  description,
  setDescription,
  buttonLabel,
  setButtonLabel,
  buttonLink,
  setButtonLink,
  heroBg,
  setHeroBg,
  heroImages,
  setHeroImages,
  sliderIntervalSec,
  setSliderIntervalSec,
  overlayOpacity,
  setOverlayOpacity,
}: HeroInspectorProps) {
  const [newSlideUrl, setNewSlideUrl] = useState<string | null>(null)
  const slides =
    heroImages && heroImages.length > 0
      ? heroImages
      : [heroBg || heroImage]

  const updateSlides = (next: string[]) => {
    const cleaned = next.filter(Boolean).slice(0, MAX_SLIDES)
    const finalSlides = cleaned.length > 0 ? cleaned : [heroImage]
    setHeroImages(finalSlides)
    setHeroBg(finalSlides[0])
  }

  const handleAddSlide = (url: string | null) => {
    if (!url) return
    const next = [...slides, url].slice(0, MAX_SLIDES)
    updateSlides(next)
    setNewSlideUrl(null)
  }

  const handleMoveSlide = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= slides.length) return
    const copy = [...slides]
    const [moved] = copy.splice(index, 1)
    copy.splice(target, 0, moved)
    updateSlides(copy)
  }

  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) return
    updateSlides(slides.filter((_, idx) => idx !== index))
  }

  return (
    <>
      <SettingGroup title="Hero content">
        <label>
          Eyebrow text
          <input
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
          />
        </label>
        <label>
          Heading (multi-line)
          <textarea
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </SettingGroup>

      <SettingGroup title="Action Button">
        <label>
          Button label
          <input
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
          />
        </label>
        <label>
          Button link
          <div className="input-icon">
            <input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
            />
            <Icon name="external" size={15} />
          </div>
        </label>
      </SettingGroup>

      <SettingGroup title={`Background Slider (${slides.length}/${MAX_SLIDES})`}>
        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', lineHeight: 1.4 }}>
          Add 2 or more images to automatically enable a smooth crossfade Hero Slider on your live website.
        </p>

        {/* Active Slides List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          {slides.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <img
                src={url}
                alt={`Hero slide ${idx + 1}`}
                style={{
                  width: '56px',
                  height: '36px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>
                  Slide {idx + 1} {idx === 0 ? '(Primary)' : ''}
                </strong>
                <small style={{ fontSize: '10px', color: '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {url}
                </small>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveSlide(idx, -1)}
                  title="Move up"
                  style={{
                    padding: '3px 6px',
                    fontSize: '11px',
                    borderRadius: '5px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    cursor: idx === 0 ? 'not-allowed' : 'pointer',
                    opacity: idx === 0 ? 0.4 : 1,
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === slides.length - 1}
                  onClick={() => handleMoveSlide(idx, 1)}
                  title="Move down"
                  style={{
                    padding: '3px 6px',
                    fontSize: '11px',
                    borderRadius: '5px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    cursor: idx === slides.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: idx === slides.length - 1 ? 0.4 : 1,
                  }}
                >
                  ↓
                </button>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(idx)}
                    title="Remove slide"
                    style={{
                      padding: '3px 6px',
                      fontSize: '11px',
                      borderRadius: '5px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#b91c1c',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Replace Primary Image */}
        <ImageUploadControl
          label="Primary Slide Image (Slide 1)"
          value={slides[0]}
          onChange={(url) => {
            if (!url) return
            const next = [...slides]
            next[0] = url
            updateSlides(next)
          }}
          aspectRatio="video"
          pickerTitle="Replace Primary Hero Image"
          helperText="Recommended: 1600 × 900 px."
        />

        {/* Add Another Slide */}
        {slides.length < MAX_SLIDES && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
            <ImageUploadControl
              label={`+ Add Slide ${slides.length + 1} to Slider`}
              value={newSlideUrl}
              onChange={handleAddSlide}
              aspectRatio="video"
              pickerTitle="Add Hero Slider Image"
              helperText="Upload or choose another campus photo from Media Library."
            />
          </div>
        )}

        {/* Slider Interval */}
        {slides.length > 1 && (
          <label style={{ marginTop: '12px' }}>
            Auto-slide speed
            <select
              value={sliderIntervalSec}
              onChange={(e) => setSliderIntervalSec(Number(e.target.value))}
            >
              <option value={3}>Fast (3 seconds)</option>
              <option value={5}>Standard (5 seconds)</option>
              <option value={8}>Relaxed (8 seconds)</option>
              <option value={12}>Slow (12 seconds)</option>
            </select>
          </label>
        )}

        <label style={{ marginTop: '12px' }}>
          Dark overlay ({overlayOpacity}%)
          <div className="range">
            <input
              type="range"
              min="15"
              max="95"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            />
            <span>{overlayOpacity}%</span>
          </div>
        </label>
      </SettingGroup>
    </>
  )
}
