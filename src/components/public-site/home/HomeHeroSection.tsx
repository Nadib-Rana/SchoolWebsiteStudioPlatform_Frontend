'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/common/Icon'

interface HomeHeroSectionProps {
  heroOverlay: number
  currentHeroImage: string
  heroImages?: string[]
  sliderIntervalSec?: number
  sectionStyle?: { align?: string; padding?: string; textColor?: string }
  motto: string
  heroHeading: string
  heroDesc: string
  schoolSlug?: string
  heroBtnLink: string
  heroBtnLabel: string
  setPage?: (p: string) => void
  schoolName: string
  establishedYear: number | string
}

export function HomeHeroSection({
  heroOverlay,
  currentHeroImage,
  heroImages,
  sliderIntervalSec = 5,
  sectionStyle,
  motto,
  heroHeading,
  heroDesc,
  schoolSlug,
  heroBtnLink,
  heroBtnLabel,
  setPage,
  schoolName,
  establishedYear,
}: HomeHeroSectionProps) {
  const slides = useMemo(() => {
    const list =
      Array.isArray(heroImages) && heroImages.length > 0
        ? heroImages.filter(Boolean)
        : [currentHeroImage].filter(Boolean)
    return list.length > 0 ? list : [currentHeroImage]
  }, [heroImages, currentHeroImage])

  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0)
    }
  }, [slides.length, activeIndex])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const ms = Math.max(2, sliderIntervalSec) * 1000
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, ms)
    return () => window.clearInterval(timer)
  }, [slides.length, paused, sliderIntervalSec])

  const pad =
    sectionStyle?.padding === 'compact'
      ? '60px'
      : sectionStyle?.padding === 'spacious'
      ? '140px'
      : '100px'

  const overlayAlpha = heroOverlay / 100
  const hasMultipleSlides = slides.length > 1

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length)

  return (
    <section
      className="public-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'none',
        backgroundColor: '#071830',
        textAlign: (sectionStyle?.align as any) || 'left',
        paddingTop: pad,
        paddingBottom: pad,
      }}
    >
      {/* Crossfade Background Slides */}
      {slides.map((src, idx) => (
        <span
          key={`${src}-${idx}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            maxWidth: 'none',
            display: 'block',
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: idx === activeIndex ? 1 : 0,
            transform: idx === activeIndex ? 'scale(1.03)' : 'scale(1)',
            transition: 'opacity 900ms ease-in-out, transform 6000ms ease-out',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Dark Gradient Overlay */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          display: 'block',
          background: `linear-gradient(90deg,rgba(7,24,48,${overlayAlpha}),rgba(7,24,48,${overlayAlpha * 0.25}))`,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Foreground Content */}
      <div style={{ position: 'relative', zIndex: 2, color: sectionStyle?.textColor || undefined }}>
        <span className="public-eyebrow">{motto}</span>
        <h1 style={{ whiteSpace: 'pre-line', color: sectionStyle?.textColor || undefined }}>{heroHeading}</h1>
        <p style={{ color: sectionStyle?.textColor || undefined }}>{heroDesc}</p>
        <div>
          {schoolSlug ? (
            <Link
              href={`/${schoolSlug}${heroBtnLink.startsWith('/') ? heroBtnLink : '/' + heroBtnLink}`}
              className="hero-primary"
            >
              {heroBtnLabel} <Icon name="arrow" size={16} />
            </Link>
          ) : (
            <button
              type="button"
              className="hero-primary"
              onClick={() => setPage && setPage('About School')}
            >
              {heroBtnLabel} <Icon name="arrow" size={16} />
            </button>
          )}

          {schoolSlug ? (
            <Link href={`/${schoolSlug}/admissions`} className="hero-secondary">
              Apply for admission
            </Link>
          ) : (
            <button
              type="button"
              className="hero-secondary"
              onClick={() => setPage && setPage('Admission Information')}
            >
              Apply for admission
            </button>
          )}
        </div>
      </div>

      {/* Slider Controls (only when 2+ slides) */}
      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous hero slide"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(7,24,48,0.45)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              backdropFilter: 'blur(4px)',
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next hero slide"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(7,24,48,0.45)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              backdropFilter: 'blur(4px)',
            }}
          >
            ›
          </button>

          <div
            role="tablist"
            aria-label="Hero slide indicators"
            style={{
              position: 'absolute',
              bottom: '22px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={idx === activeIndex}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: idx === activeIndex ? '26px' : '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                  background:
                    idx === activeIndex
                      ? 'var(--accent, #e3ad3f)'
                      : 'rgba(255,255,255,0.5)',
                  transition: 'all 250ms ease',
                }}
              />
            ))}
          </div>
        </>
      )}

      <span className="hero-caption" style={{ zIndex: 2 }}>
        {schoolName} · {establishedYear}
      </span>
    </section>
  )
}
