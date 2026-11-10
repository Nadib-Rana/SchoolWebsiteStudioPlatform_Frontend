'use client'

import { useState, useEffect } from 'react'
import type { DeviceType, SchoolTheme } from '@/types/theme'
import { THEME_CONFIGS } from '@/config/themes'
import { loadCustomThemeLocally, subscribeToThemeChanges, type CustomThemeConfig } from '../theme/theme-sync-helper'
import type { CustomSectionData, SectionItem, SectionStyle } from './builder.types'
import { CanvasAnnouncementHeader } from './canvas/CanvasAnnouncementHeader'
import { CanvasHeroStats } from './canvas/CanvasHeroStats'
import { CanvasIntroPrincipal } from './canvas/CanvasIntroPrincipal'
import { CanvasNotices } from './canvas/CanvasNotices'
import { CanvasEvents } from './canvas/CanvasEvents'
import { CanvasGallery } from './canvas/CanvasGallery'
import { CanvasCustomSections } from './canvas/CanvasCustomSections'
import { CanvasFooter } from './canvas/CanvasFooter'

interface BuilderCanvasProps {
  device: DeviceType
  sectionStyles: Record<string, SectionStyle>
  selected: string
  setSelected: (s: string) => void
  sectionList: SectionItem[]
  customSectionsData: Record<string, CustomSectionData>
  notify: (msg: string) => void
  state: any
}

export function BuilderCanvas({
  device,
  sectionStyles,
  selected,
  setSelected,
  sectionList,
  customSectionsData,
  notify,
  state,
}: BuilderCanvasProps) {
  const currentTheme = (state.appliedTheme as SchoolTheme) || 'modern'
  const activeCfg = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.modern
  const [customTheme, setCustomTheme] = useState<CustomThemeConfig | null>(() => loadCustomThemeLocally())

  useEffect(() => {
    return subscribeToThemeChanges((cfg) => {
      setCustomTheme((prev) => ({ ...prev, ...cfg }))
    })
  }, [])

  const mergedCfg = {
    ...activeCfg,
    primaryColor: customTheme?.primaryColor || activeCfg.primaryColor,
    secondaryColor: customTheme?.secondaryColor || activeCfg.secondaryColor,
    fontHeading: customTheme?.fontHeading || activeCfg.fontHeading,
  }

  return (
    <div className="canvas-area">
      <div
        className={`canvas ${device} theme-${currentTheme}`}
        style={
          {
            '--navy': mergedCfg.primaryColor,
            '--accent': mergedCfg.secondaryColor,
            fontFamily: customTheme?.fontBody ? `${customTheme.fontBody}, sans-serif` : undefined,
          } as React.CSSProperties
        }
      >
        <CanvasAnnouncementHeader
          showAnnouncement={state.showAnnouncement}
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          announcementText={state.announcementText}
          announcementLink={state.announcementLink}
          logoLetter={state.logoLetter}
          schoolName={state.schoolName}
          applyButtonText={state.applyButtonText}
          activeCfg={mergedCfg}
        />

        <CanvasHeroStats
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          overlayOpacity={state.overlayOpacity}
          heroBg={state.heroBg}
          eyebrow={state.eyebrow}
          heading={state.heading}
          description={state.description}
          buttonLabel={state.buttonLabel}
          buttonLink={state.buttonLink}
          notify={notify}
          stat1Val={state.stat1Val}
          stat1Label={state.stat1Label}
          stat2Val={state.stat2Val}
          stat2Label={state.stat2Label}
          stat3Val={state.stat3Val}
          stat3Label={state.stat3Label}
          stat4Val={state.stat4Val}
          stat4Label={state.stat4Label}
          activeCfg={mergedCfg}
        />

        <CanvasIntroPrincipal
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          introKicker={state.introKicker}
          introTitle={state.introTitle}
          introDesc={state.introDesc}
          principalPhoto={state.principalPhoto}
          principalName={state.principalName}
          principalQuote={state.principalQuote}
          principalTitle={state.principalTitle}
          activeCfg={activeCfg}
        />

        <CanvasNotices
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          noticesHeading={state.noticesHeading}
          notice1Date={state.notice1Date}
          notice1Title={state.notice1Title}
          notice2Date={state.notice2Date}
          notice2Title={state.notice2Title}
        />

        <CanvasEvents
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          eventsHeading={state.eventsHeading}
          event1Date={state.event1Date}
          event1Venue={state.event1Venue}
          event1Title={state.event1Title}
          event2Date={state.event2Date}
          event2Venue={state.event2Venue}
          event2Title={state.event2Title}
        />

        <CanvasGallery
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          galleryHeading={state.galleryHeading}
          gallerySub={state.gallerySub}
        />

        <CanvasCustomSections
          sectionList={sectionList}
          customSectionsData={customSectionsData}
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          notify={notify}
        />

        <CanvasFooter
          sectionStyles={sectionStyles}
          selected={selected}
          setSelected={setSelected}
          device={device}
          schoolName={state.schoolName}
          footerAddress={state.footerAddress}
          footerPhone={state.footerPhone}
          footerEmail={state.footerEmail}
          footerCopyright={state.footerCopyright}
          activeCfg={activeCfg}
        />
      </div>
    </div>
  )
}
