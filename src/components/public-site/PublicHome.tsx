'use client'

import { useState, useEffect, useMemo } from 'react'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { THEME_CONFIGS } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'
import type { PublicSiteData } from '@/lib/public-site'
import { parseHomepageSections } from '@/lib/homepage-sections-parser'
import { loadBuilderStateFromLocal } from '@/components/studio/builder/builder-storage'
import { HomeHeroSection } from './home/HomeHeroSection'
import { HomeStatsSection } from './home/HomeStatsSection'
import { HomeIntroSection } from './home/HomeIntroSection'
import { HomePrincipalSection } from './home/HomePrincipalSection'
import { HomeNoticesSection } from './home/HomeNoticesSection'
import { HomeEventsSection } from './home/HomeEventsSection'
import { HomeGallerySection } from './home/HomeGallerySection'
import { HomeCustomSections } from './home/HomeCustomSections'
import { HomeContactSection } from './home/HomeContactSection'

export interface PublicHomeProps {
  theme?: SchoolTheme
  setPage?: (p: string) => void
  schoolSlug?: string
  schoolData?: PublicSiteData | null
  isPreview?: boolean
}

export function PublicHome({
  theme = 'classic',
  setPage,
  schoolSlug,
  schoolData,
  isPreview = false,
}: PublicHomeProps) {
  const [localDraft, setLocalDraft] = useState<any>(null)

  // Only overlay unsaved localStorage draft inside Studio Preview; live public routes use DB data
  useEffect(() => {
    if (!isPreview) {
      setLocalDraft(null)
      return
    }
    const cached = loadBuilderStateFromLocal(schoolData?.school?.id)
    if (cached) setLocalDraft(cached)
  }, [isPreview, schoolData?.school?.id])

  const dbSections = useMemo(
    () => parseHomepageSections(schoolData),
    [schoolData],
  )

  const activeCfg = THEME_CONFIGS[theme] || THEME_CONFIGS.modern
  const isLocalForTheme =
    isPreview &&
    localDraft &&
    (!localDraft.appliedTheme || localDraft.appliedTheme === theme)
  const draft = isLocalForTheme ? localDraft : null

  const schoolName =
    schoolData?.school?.name ||
    draft?.schoolName ||
    dbSections.schoolName ||
    activeCfg.schoolName
  const motto =
    draft?.eyebrow ||
    dbSections.eyebrow ||
    schoolData?.profile?.motto ||
    activeCfg.eyebrow
  const establishedYear = schoolData?.profile?.established || 1983
  const address =
    schoolData?.profile?.address ||
    draft?.footerAddress ||
    dbSections.footerAddress ||
    '27 Lakeview Avenue, Riverdale, NY 10471'

  const heroHeading =
    draft?.heading || dbSections.heading || activeCfg.headline
  const heroDesc =
    draft?.description || dbSections.description || activeCfg.description
  const heroBtnLabel =
    draft?.buttonLabel || dbSections.buttonLabel || activeCfg.buttonLabel
  const currentHeroImage =
    draft?.heroBg ||
    dbSections.heroBg ||
    schoolData?.profile?.coverUrl ||
    activeCfg.heroImage ||
    heroImage
  const heroImages: string[] =
    (Array.isArray(draft?.heroImages) && draft.heroImages.length > 0
      ? draft.heroImages
      : Array.isArray(dbSections.heroImages) && dbSections.heroImages.length > 0
      ? dbSections.heroImages
      : [currentHeroImage])
  const sliderIntervalSec =
    draft?.sliderIntervalSec || dbSections.sliderIntervalSec || 5
  const heroBtnLink =
    draft?.buttonLink || dbSections.buttonLink || '/about'
  const heroOverlay =
    draft?.overlayOpacity !== undefined
      ? draft.overlayOpacity
      : dbSections.overlayOpacity !== undefined
      ? dbSections.overlayOpacity
      : 65

  const introKicker =
    draft?.introKicker ||
    dbSections.introKicker ||
    `WELCOME TO ${schoolName.toUpperCase()}`
  const introTitle =
    draft?.introTitle ||
    dbSections.introTitle ||
    'Learning with purpose.\nGrowing with confidence.'
  const introDesc =
    draft?.introDesc ||
    dbSections.introDesc ||
    schoolData?.profile?.missionStatement ||
    'We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.'
  const introImage =
    draft?.introImage ||
    dbSections.introImage ||
    schoolData?.profile?.coverUrl ||
    campusImage
  const introQuote =
    draft?.introQuote ||
    dbSections.introQuote ||
    '“Every child deserves to be truly known, deeply supported, and meaningfully challenged.”'

  const principalName =
    draft?.principalName ||
    dbSections.principalName ||
    schoolData?.profile?.principalName ||
    'Dr. Farhana Noor'
  const principalTitle =
    draft?.principalTitle ||
    dbSections.principalTitle ||
    schoolData?.profile?.principalTitle ||
    'Principal & Head Administrator'
  const principalQuote =
    draft?.principalQuote ||
    dbSections.principalQuote ||
    schoolData?.profile?.principalBio ||
    `“For more than four decades, ${schoolName} has combined academic ambition with a culture of care, belonging, and purposeful growth.”`
  const principalPhoto =
    draft?.principalPhoto ||
    dbSections.principalPhoto ||
    schoolData?.profile?.principalPhotoUrl ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400'

  const publishedNotices = schoolData?.notices || []
  const hasDbNotices = publishedNotices.length > 0
  const publishedEvents = schoolData?.events || []
  const hasDbEvents = publishedEvents.length > 0

  const albumPhotos = schoolData?.albums?.[0]?.photos || []
  const galleryPhoto1 = albumPhotos[0]?.url || campusImage
  const galleryPhoto2 = albumPhotos[1]?.url || interiorImage

  const stat1Val = draft?.stat1Val || dbSections.stat1Val
  const statsList = stat1Val
    ? [
        { value: stat1Val, label: draft?.stat1Label || dbSections.stat1Label || 'Students' },
        { value: draft?.stat2Val || dbSections.stat2Val || '98%', label: draft?.stat2Label || dbSections.stat2Label || 'Graduation rate' },
        { value: draft?.stat3Val || dbSections.stat3Val || '42', label: draft?.stat3Label || dbSections.stat3Label || 'Years of excellence' },
        { value: draft?.stat4Val || dbSections.stat4Val || '16:1', label: draft?.stat4Label || dbSections.stat4Label || 'Student–teacher ratio' },
      ]
    : [
        { value: '1,240', label: 'Students' },
        { value: '98%', label: 'Graduation rate' },
        { value: '42', label: 'Years of excellence' },
        { value: '16:1', label: 'Student–teacher ratio' },
      ]

  const sectionStyles = {
    ...dbSections.sectionStyles,
    ...(draft?.sectionStyles || {}),
  }

  const customSections = draft?.customSectionsData
    ? Object.values(draft.customSectionsData)
    : dbSections.customSections

  return (
    <>
      <HomeHeroSection
        heroOverlay={heroOverlay}
        currentHeroImage={currentHeroImage}
        heroImages={heroImages}
        sliderIntervalSec={sliderIntervalSec}
        sectionStyle={sectionStyles['Hero section']}
        motto={motto}
        heroHeading={heroHeading}
        heroDesc={heroDesc}
        schoolSlug={schoolSlug}
        heroBtnLink={heroBtnLink}
        heroBtnLabel={heroBtnLabel}
        setPage={setPage}
        schoolName={schoolName}
        establishedYear={establishedYear}
      />
      <HomeStatsSection sectionStyle={sectionStyles['Statistics']} statsList={statsList} />
      <HomeIntroSection
        sectionStyle={sectionStyles['School introduction']}
        schoolName={schoolName}
        establishedYear={establishedYear}
        introKicker={introKicker}
        introTitle={introTitle}
        introDesc={introDesc}
        introImage={introImage}
        introQuote={introQuote}
        schoolSlug={schoolSlug}
        setPage={setPage}
      />
      <HomePrincipalSection
        sectionStyle={sectionStyles['Principal message']}
        principalQuote={principalQuote}
        principalName={principalName}
        principalTitle={principalTitle}
        principalPhoto={principalPhoto}
      />
      <HomeNoticesSection
        noticesHeading={draft?.noticesHeading || dbSections.noticesHeading || 'Latest notices & circulars'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        hasDbNotices={hasDbNotices}
        publishedNotices={publishedNotices}
        notice1Date={draft?.notice1Date || dbSections.notice1Date || 'Nov 05, 2026'}
        notice1Title={draft?.notice1Title || dbSections.notice1Title || 'Term Examination Routine & Admit Card Distribution'}
        notice2Date={draft?.notice2Date || dbSections.notice2Date || 'Nov 02, 2026'}
        notice2Title={draft?.notice2Title || dbSections.notice2Title || 'Annual Inter-School Science & Tech Fair 2026 Registration'}
      />
      <HomeEventsSection
        eventsHeading={draft?.eventsHeading || dbSections.eventsHeading || 'Upcoming events & calendar'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        hasDbEvents={hasDbEvents}
        publishedEvents={publishedEvents}
        event1Date={draft?.event1Date || dbSections.event1Date || 'Nov 15'}
        event1Title={draft?.event1Title || dbSections.event1Title || 'Annual Sports & Athletics Meet 2026'}
        event1Venue={draft?.event1Venue || dbSections.event1Venue || 'Main Campus Stadium'}
        event2Date={draft?.event2Date || dbSections.event2Date || 'Nov 22'}
        event2Title={draft?.event2Title || dbSections.event2Title || 'Parent-Teacher Academic Progress Conference'}
        event2Venue={draft?.event2Venue || dbSections.event2Venue || 'Auditorium Hall'}
      />
      <HomeGallerySection
        schoolName={schoolName}
        galleryHeading={draft?.galleryHeading || dbSections.galleryHeading || 'Campus life & moments'}
        gallerySub={draft?.gallerySub || dbSections.gallerySub || 'Explore our modern STEM labs, creative arts studios, and athletic facilities.'}
        schoolSlug={schoolSlug}
        setPage={setPage}
        galleryPhoto1={galleryPhoto1}
        galleryPhoto2={galleryPhoto2}
      />
      <HomeCustomSections
        customSections={customSections}
        sectionStyles={sectionStyles}
        setPage={setPage}
      />
      <HomeContactSection
        schoolName={schoolName}
        address={address}
        schoolSlug={schoolSlug}
        setPage={setPage}
      />
    </>
  )
}
