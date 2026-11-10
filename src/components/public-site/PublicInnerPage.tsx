'use client'

import { Icon } from '@/components/common/Icon'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { publicPagesContent } from '@/config/public-pages'
import type { PublicSiteData } from '@/lib/public-site'
import { InnerAdmissionSection } from './InnerAdmissionSection'
import { InnerContactSection } from './InnerContactSection'
import { InnerFacultyGrid } from './InnerFacultyGrid'
import { InnerListSection } from './InnerListSection'

export interface PublicInnerPageProps {
  page: string
  setPage: (p: string) => void
  siteData?: PublicSiteData | null
}

export function PublicInnerPage({ page, setPage, siteData }: PublicInnerPageProps) {
  if (page === '404 Page') {
    return (
      <main className="error-page">
        <span>404</span>
        <h1>We couldn’t find that page.</h1>
        <p>The page may have moved, or the address might be incorrect.</p>
        <button type="button" onClick={() => setPage('Home')}>
          Return to homepage <Icon name="arrow" size={15} />
        </button>
      </main>
    )
  }

  const d = publicPagesContent[page] || publicPagesContent['About School']
  const isAdmission = page === 'Admission Information'
  const isContact = page === 'Contact Us'
  const isGallery = page.includes('Gallery')
  const isPeople = page.includes('Teacher')
  const isList = ['Notices', 'Events', 'Search Results'].includes(page)

  const matchingPage = siteData?.pages?.find(
    (p: any) =>
      p.title?.toLowerCase() === page.toLowerCase() ||
      p.slug?.toLowerCase() === page.toLowerCase().replace(/\s+/g, '-'),
  ) as any
  const featuredBanner =
    matchingPage?.featuredImage ||
    (page.includes('About') || page.includes('Principal')
      ? siteData?.profile?.coverUrl
      : undefined)

  return (
    <main className="inner-page">
      <section
        className="inner-hero"
        style={
          featuredBanner
            ? {
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.72)), url(${featuredBanner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#ffffff',
              }
            : undefined
        }
      >
        <span>{d.kicker}</span>
        <h1>{d.title}</h1>
        <p>{d.intro}</p>
        <div className="breadcrumb">
          Home <Icon name="chevron" size={11} /> {page}
        </div>
      </section>

      {isAdmission ? (
        <InnerAdmissionSection />
      ) : isContact ? (
        <InnerContactSection />
      ) : isGallery ? (
        <section className="gallery-wall">
          {(() => {
            const dbPhotos =
              siteData?.albums?.flatMap((album) =>
                (album.photos || []).map((p) => p.url),
              ) || []
            const photos =
              dbPhotos.length > 0
                ? dbPhotos
                : [
                    heroImage,
                    campusImage,
                    interiorImage,
                    'https://images.unsplash.com/photo-1787401963343-d81b68a5a059?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800',
                    'https://images.unsplash.com/photo-1769209435699-9cc1fd8e7f57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=800',
                  ]
            return photos.map((x, i) => (
              <img src={x} alt={`School gallery photo ${i + 1}`} key={`${x}-${i}`} />
            ))
          })()}
        </section>
      ) : isPeople ? (
        <InnerFacultyGrid
          teachers={siteData?.teachers}
          onSelectTeacher={() => setPage('Teacher Profile')}
        />
      ) : isList ? (
        <InnerListSection page={page} onSelectDetail={setPage} />
      ) : (
        <section className="story-content">
          <div>
            <span className="section-kicker">THE NORTHFIELD APPROACH</span>
            <h2>
              Strong foundations.
              <br />
              Open horizons.
            </h2>
            <p>
              Our educational approach is grounded in high expectations,
              supportive relationships, and the belief that learning becomes
              powerful when students understand its purpose.
            </p>
            <p>
              From foundational literacy and numeracy through specialist
              programs, leadership opportunities, and preparation for life
              beyond school, each stage builds naturally on the one before it.
            </p>
            <blockquote>
              We prepare young people not only for examinations, but for
              meaningful lives of curiosity, contribution, and character.
            </blockquote>
          </div>
          <img
            src={
              page === 'Principal’s Message'
                ? siteData?.profile?.principalPhotoUrl || interiorImage
                : siteData?.profile?.coverUrl || campusImage
            }
            alt="School community"
          />
        </section>
      )}
    </main>
  )
}
