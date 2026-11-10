'use client'

import type { CustomSectionData } from './builder.types'
import { AnnouncementInspector } from './inspectors/AnnouncementInspector'
import { HeaderInspector } from './inspectors/HeaderInspector'
import { HeroInspector } from './inspectors/HeroInspector'
import { IntroInspector } from './inspectors/IntroInspector'
import { PrincipalInspector } from './inspectors/PrincipalInspector'
import { StatisticsInspector } from './inspectors/StatisticsInspector'
import { NoticesEventsInspector } from './inspectors/NoticesEventsInspector'
import { GalleryFooterInspector } from './inspectors/GalleryFooterInspector'
import { CustomSectionInspector } from './inspectors/CustomSectionInspector'

interface BuilderRightPanelContentProps {
  selected: string
  customSectionsData: Record<string, CustomSectionData>
  setCustomSectionsData: React.Dispatch<React.SetStateAction<Record<string, CustomSectionData>>>
  onManageAlbumPhotos: () => void
  state: any
}

export function BuilderRightPanelContent({
  selected,
  customSectionsData,
  setCustomSectionsData,
  onManageAlbumPhotos,
  state,
}: BuilderRightPanelContentProps) {
  return (
    <>
      {selected === 'Announcement bar' && (
        <AnnouncementInspector
          showAnnouncement={state.showAnnouncement}
          setShowAnnouncement={state.setShowAnnouncement}
          announcementText={state.announcementText}
          setAnnouncementText={state.setAnnouncementText}
          announcementLink={state.announcementLink}
          setAnnouncementLink={state.setAnnouncementLink}
        />
      )}

      {selected === 'Header' && (
        <HeaderInspector
          schoolName={state.schoolName}
          setSchoolName={state.setSchoolName}
          logoLetter={state.logoLetter}
          setLogoLetter={state.setLogoLetter}
          applyButtonText={state.applyButtonText}
          setApplyButtonText={state.setApplyButtonText}
        />
      )}

      {selected === 'Hero section' && (
        <HeroInspector
          eyebrow={state.eyebrow}
          setEyebrow={state.setEyebrow}
          heading={state.heading}
          setHeading={state.setHeading}
          description={state.description}
          setDescription={state.setDescription}
          buttonLabel={state.buttonLabel}
          setButtonLabel={state.setButtonLabel}
          buttonLink={state.buttonLink}
          setButtonLink={state.setButtonLink}
          heroBg={state.heroBg}
          setHeroBg={state.setHeroBg}
          overlayOpacity={state.overlayOpacity}
          setOverlayOpacity={state.setOverlayOpacity}
        />
      )}

      {selected === 'School introduction' && (
        <IntroInspector
          introKicker={state.introKicker}
          setIntroKicker={state.setIntroKicker}
          introTitle={state.introTitle}
          setIntroTitle={state.setIntroTitle}
          introDesc={state.introDesc}
          setIntroDesc={state.setIntroDesc}
        />
      )}

      {selected === 'Principal message' && (
        <PrincipalInspector
          principalName={state.principalName}
          setPrincipalName={state.setPrincipalName}
          principalTitle={state.principalTitle}
          setPrincipalTitle={state.setPrincipalTitle}
          principalQuote={state.principalQuote}
          setPrincipalQuote={state.setPrincipalQuote}
          principalPhoto={state.principalPhoto}
          setPrincipalPhoto={state.setPrincipalPhoto}
        />
      )}

      {selected === 'Statistics' && (
        <StatisticsInspector
          stat1Val={state.stat1Val}
          setStat1Val={state.setStat1Val}
          stat1Label={state.stat1Label}
          setStat1Label={state.setStat1Label}
          stat2Val={state.stat2Val}
          setStat2Val={state.setStat2Val}
          stat2Label={state.stat2Label}
          setStat2Label={state.setStat2Label}
          stat3Val={state.stat3Val}
          setStat3Val={state.setStat3Val}
          stat3Label={state.stat3Label}
          setStat3Label={state.setStat3Label}
          stat4Val={state.stat4Val}
          setStat4Val={state.setStat4Val}
          stat4Label={state.stat4Label}
          setStat4Label={state.setStat4Label}
        />
      )}

      {(selected === 'Latest notices' || selected === 'Upcoming events') && (
        <NoticesEventsInspector
          selected={selected}
          noticesHeading={state.noticesHeading}
          setNoticesHeading={state.setNoticesHeading}
          notice1Date={state.notice1Date}
          setNotice1Date={state.setNotice1Date}
          notice1Title={state.notice1Title}
          setNotice1Title={state.setNotice1Title}
          notice2Date={state.notice2Date}
          setNotice2Date={state.setNotice2Date}
          notice2Title={state.notice2Title}
          setNotice2Title={state.setNotice2Title}
          eventsHeading={state.eventsHeading}
          setEventsHeading={state.setEventsHeading}
          event1Date={state.event1Date}
          setEvent1Date={state.setEvent1Date}
          event1Venue={state.event1Venue}
          setEvent1Venue={state.setEvent1Venue}
          event1Title={state.event1Title}
          setEvent1Title={state.setEvent1Title}
          event2Date={state.event2Date}
          setEvent2Date={state.setEvent2Date}
          event2Venue={state.event2Venue}
          setEvent2Venue={state.setEvent2Venue}
          event2Title={state.event2Title}
          setEvent2Title={state.setEvent2Title}
        />
      )}

      {(selected === 'Gallery' || selected === 'Footer') && (
        <GalleryFooterInspector
          selected={selected}
          galleryHeading={state.galleryHeading}
          setGalleryHeading={state.setGalleryHeading}
          gallerySub={state.gallerySub}
          setGallerySub={state.setGallerySub}
          footerAddress={state.footerAddress}
          setFooterAddress={state.setFooterAddress}
          footerPhone={state.footerPhone}
          setFooterPhone={state.setFooterPhone}
          footerEmail={state.footerEmail}
          setFooterEmail={state.setFooterEmail}
          footerCopyright={state.footerCopyright}
          setFooterCopyright={state.setFooterCopyright}
          onManageAlbumPhotos={onManageAlbumPhotos}
        />
      )}

      {customSectionsData[selected] && (
        <CustomSectionInspector
          sectionData={customSectionsData[selected]}
          selected={selected}
          setCustomSectionsData={setCustomSectionsData}
        />
      )}
    </>
  )
}
