'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { THEME_CONFIGS, themeHeadlines } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'
import type { PublicSiteData } from '@/lib/public-site'
import { useState, useEffect } from 'react'

export interface PublicHomeProps {
  theme?: SchoolTheme
  setPage?: (p: string) => void
  schoolSlug?: string
  schoolData?: PublicSiteData | null
}

export function PublicHome({
  theme = 'classic',
  setPage,
  schoolSlug,
  schoolData,
}: PublicHomeProps) {
  const [builderData, setBuilderData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('studio_builder_homepage_data')
        return cached ? JSON.parse(cached) : null
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('studio_builder_homepage_data')
        if (cached) {
          setBuilderData(JSON.parse(cached))
        }
      } catch (err) {
        console.debug('Failed to load builder homepage data:', err)
      }
    }
  }, [])

  const activeCfg = THEME_CONFIGS[theme] || THEME_CONFIGS.modern
  const isCustomizedForTheme = builderData?.appliedTheme === theme

  const schoolName =
    isCustomizedForTheme && builderData?.schoolName
      ? builderData.schoolName
      : activeCfg.schoolName
  const motto =
    isCustomizedForTheme && builderData?.eyebrow
      ? builderData.eyebrow
      : activeCfg.eyebrow
  const establishedYear = schoolData?.profile?.established || 1983
  const address =
    builderData?.footerAddress ||
    schoolData?.profile?.address ||
    '27 Lakeview Avenue, Riverdale, NY 10471'

  // Hero section
  const heroHeading =
    isCustomizedForTheme && builderData?.heading
      ? builderData.heading
      : activeCfg.headline
  const heroDesc =
    isCustomizedForTheme && builderData?.description
      ? builderData.description
      : activeCfg.description
  const heroBtnLabel =
    isCustomizedForTheme && builderData?.buttonLabel
      ? builderData.buttonLabel
      : activeCfg.buttonLabel
  const currentHeroImage = activeCfg.heroImage || heroImage
  const heroBtnLink = builderData?.buttonLink || '/about'
  const heroOverlay =
    builderData?.overlayOpacity !== undefined ? builderData.overlayOpacity : 65

  // School intro
  const introKicker =
    builderData?.introKicker || `WELCOME TO ${schoolName.toUpperCase()}`
  const introTitle =
    builderData?.introTitle || 'Learning with purpose.\nGrowing with confidence.'
  const introDesc =
    builderData?.introDesc ||
    schoolData?.profile?.missionStatement ||
    'We combine academic excellence with a deeply supportive culture. Our students learn to think deeply, act with integrity, and use their gifts in service of others.'

  // Principal message
  const principalName =
    builderData?.principalName ||
    schoolData?.profile?.principalName ||
    'Dr. Farhana Noor'
  const principalTitle =
    builderData?.principalTitle ||
    schoolData?.profile?.principalTitle ||
    'Principal & Head Administrator'
  const principalQuote =
    builderData?.principalQuote ||
    schoolData?.profile?.principalBio ||
    '“For more than four decades, Northfield has combined academic ambition with a culture of care, belonging, and purposeful growth.”'
  const principalPhoto =
    builderData?.principalPhoto ||
    schoolData?.profile?.principalPhotoUrl ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400'

  // Stats formatting
  const statsList = builderData?.stat1Val
    ? [
        { value: builderData.stat1Val, label: builderData.stat1Label },
        { value: builderData.stat2Val, label: builderData.stat2Label },
        { value: builderData.stat3Val, label: builderData.stat3Label },
        { value: builderData.stat4Val, label: builderData.stat4Label },
      ]
    : [
        { value: '1,240', label: 'Students' },
        { value: '98%', label: 'Graduation rate' },
        { value: '42', label: 'Years of excellence' },
        { value: '16:1', label: 'Student–teacher ratio' },
      ]

  // Notices
  const noticesHeading =
    builderData?.noticesHeading || 'Latest notices & circulars'
  const notice1Date = builderData?.notice1Date || 'Nov 05, 2026'
  const notice1Title =
    builderData?.notice1Title ||
    'Term Examination Routine & Admit Card Distribution'
  const notice2Date = builderData?.notice2Date || 'Nov 02, 2026'
  const notice2Title =
    builderData?.notice2Title ||
    'Annual Inter-School Science & Tech Fair 2026 Registration'

  // Events
  const eventsHeading =
    builderData?.eventsHeading || 'Upcoming events & calendar'
  const event1Date = builderData?.event1Date || 'Nov 15'
  const event1Title =
    builderData?.event1Title || 'Annual Sports & Athletics Meet 2026'
  const event1Venue = builderData?.event1Venue || 'Main Campus Stadium'
  const event2Date = builderData?.event2Date || 'Nov 22'
  const event2Title =
    builderData?.event2Title || 'Parent-Teacher Academic Progress Conference'
  const event2Venue = builderData?.event2Venue || 'Auditorium Hall'

  // Gallery
  const galleryHeading =
    builderData?.galleryHeading || 'Campus life & moments'
  const gallerySub =
    builderData?.gallerySub ||
    'Explore our modern STEM labs, creative arts studios, and athletic facilities.'

  // Custom sections & styling
  const customSections = builderData?.customSectionsData
    ? Object.values(builderData.customSectionsData)
    : []
  const sectionStyles = builderData?.sectionStyles || {}

  return (
    <>
      {/* Hero Section */}
      <section
        className="public-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(7,24,48,${heroOverlay / 100}),rgba(7,24,48,${(heroOverlay / 100) * 0.25})),url(${currentHeroImage})`,
          textAlign: sectionStyles['Hero section']?.align || 'left',
          paddingTop:
            sectionStyles['Hero section']?.padding === 'compact'
              ? '60px'
              : sectionStyles['Hero section']?.padding === 'spacious'
              ? '140px'
              : '100px',
          paddingBottom:
            sectionStyles['Hero section']?.padding === 'compact'
              ? '60px'
              : sectionStyles['Hero section']?.padding === 'spacious'
              ? '140px'
              : '100px',
        }}
      >
        <div>
          <span className="public-eyebrow">{motto}</span>
          <h1 style={{ whiteSpace: 'pre-line' }}>{heroHeading}</h1>
          <p>{heroDesc}</p>
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
              <Link
                href={`/${schoolSlug}/admissions`}
                className="hero-secondary"
              >
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
        <span className="hero-caption">
          {schoolName} · {establishedYear}
        </span>
      </section>

      {/* 3. Statistics Section */}
      <section
        className="public-stats"
        style={{
          background: sectionStyles['Statistics']?.bg || undefined,
          paddingTop:
            sectionStyles['Statistics']?.padding === 'compact'
              ? '20px'
              : sectionStyles['Statistics']?.padding === 'spacious'
              ? '50px'
              : '32px',
          paddingBottom:
            sectionStyles['Statistics']?.padding === 'compact'
              ? '20px'
              : sectionStyles['Statistics']?.padding === 'spacious'
              ? '50px'
              : '32px',
        }}
      >
        {statsList.slice(0, 4).map((stat, idx) => (
          <div key={idx}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* 4. School Introduction */}
      <section
        className="public-intro"
        style={{
          background:
            sectionStyles['School introduction']?.bg || undefined,
          paddingTop:
            sectionStyles['School introduction']?.padding === 'compact'
              ? '40px'
              : sectionStyles['School introduction']?.padding === 'spacious'
              ? '100px'
              : '70px',
          paddingBottom:
            sectionStyles['School introduction']?.padding === 'compact'
              ? '40px'
              : sectionStyles['School introduction']?.padding === 'spacious'
              ? '100px'
              : '70px',
        }}
      >
        <div className="intro-image">
          <img src={campusImage} alt={`${schoolName} campus`} />
          <span>
            <strong>Since {establishedYear}</strong>
            <small>Growing together</small>
          </span>
        </div>
        <div>
          <span className="section-kicker">{introKicker}</span>
          <h2 style={{ whiteSpace: 'pre-line' }}>{introTitle}</h2>
          <p>{introDesc}</p>
          <blockquote>
            “Every child deserves to be truly known, deeply supported, and meaningfully challenged.”
          </blockquote>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/about`} className="read-link">
              Discover our story <Icon name="arrow" size={15} />
            </Link>
          ) : (
            <button
              type="button"
              className="read-link"
              onClick={() => setPage && setPage('About School')}
            >
              Discover our story <Icon name="arrow" size={15} />
            </button>
          )}
        </div>
      </section>

      {/* 5. Principal Message */}
      <section
        className="principal-home"
        style={{
          background:
            sectionStyles['Principal message']?.bg || undefined,
          paddingTop:
            sectionStyles['Principal message']?.padding === 'compact'
              ? '40px'
              : sectionStyles['Principal message']?.padding === 'spacious'
              ? '110px'
              : '75px',
          paddingBottom:
            sectionStyles['Principal message']?.padding === 'compact'
              ? '40px'
              : sectionStyles['Principal message']?.padding === 'spacious'
              ? '110px'
              : '75px',
        }}
      >
        <div>
          <span className="section-kicker">A MESSAGE FROM OUR PRINCIPAL</span>
          <blockquote>{principalQuote}</blockquote>
          <strong
            style={{
              display: 'block',
              fontSize: '18px',
              color: '#0f172a',
              marginTop: '16px',
            }}
          >
            {principalName}
          </strong>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {principalTitle}
          </span>
        </div>
        <aside>
          <img
            src={principalPhoto}
            alt={principalName}
            style={{
              width: '180px',
              height: '220px',
              objectFit: 'cover',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              margin: '0 auto',
            }}
          />
        </aside>
      </section>

      {/* 6. Latest Notices */}
      <section className="home-news">
        <div>
          <span className="section-kicker">LATEST UPDATES</span>
          <h2>{noticesHeading}</h2>
          <p>
            Stay connected with important announcements and circulars across our community.
          </p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/notices`}>
              View all notices <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Notices')}
            >
              View all notices <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div>
          {[
            [notice1Date, notice1Title, 'ACADEMIC'],
            [notice2Date, notice2Title, 'CIRCULAR'],
          ].map((x) => (
            <article key={x[1]}>
              <span>{x[0]}</span>
              <div>
                <small>{x[2]}</small>
                <h3>{x[1]}</h3>
              </div>
              <Icon name="arrow" />
            </article>
          ))}
        </div>
      </section>

      {/* 7. Upcoming Events */}
      <section className="home-events">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SAVE THE DATE</span>
            <h2>{eventsHeading}</h2>
          </div>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/events`}>
              Full calendar <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Events')}
            >
              Full calendar <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div>
          {[
            [event1Date, 'NOV', event1Title, event1Venue],
            [event2Date, 'NOV', event2Title, event2Venue],
          ].map((x) => (
            <article key={x[2]}>
              <span>
                <strong>{x[0]}</strong>
                <small>{x[1]}</small>
              </span>
              <div>
                <h3>{x[2]}</h3>
                <p>{x[3]}</p>
              </div>
              <Icon name="arrow" />
            </article>
          ))}
        </div>
      </section>

      {/* 8. Campus Gallery */}
      <section className="home-gallery">
        <div className="gallery-copy">
          <span className="section-kicker">LIFE AT {schoolName.toUpperCase()}</span>
          <h2>{galleryHeading}</h2>
          <p>{gallerySub}</p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/gallery`}>
              Explore our gallery <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Photo Gallery')}
            >
              Explore our gallery <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <img
          src={campusImage}
          alt={`Students around ${schoolName} campus`}
        />
        <img
          src={interiorImage}
          alt={`${schoolName} learning commons`}
        />
      </section>

      {/* 9. Dynamic Custom Added Sections from Builder (FAQ, Reviews, Facilities, CTA) */}
      {customSections.map((cs: any) => (
        <section
          key={cs.id || cs.label}
          style={{
            padding: '70px 10vw',
            background: sectionStyles[cs.label]?.bg || '#f8fafc',
            textAlign: sectionStyles[cs.label]?.align || 'left',
          }}
        >
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <span
              className="section-kicker"
              style={{
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1.2px',
              }}
            >
              CUSTOM SECTION
            </span>
            <h2
              style={{
                fontSize: '28px',
                margin: '6px 0 12px',
                fontWeight: 700,
              }}
            >
              {cs.title}
            </h2>
            {cs.subtitle && (
              <p
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  marginBottom: '30px',
                  lineHeight: 1.6,
                }}
              >
                {cs.subtitle}
              </p>
            )}

            {cs.items && cs.items.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    cs.type === 'testimonials'
                      ? '1fr 1fr'
                      : cs.type === 'facilities'
                      ? 'repeat(3, 1fr)'
                      : '1fr',
                  gap: '16px',
                  marginTop: '16px',
                }}
              >
                {cs.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        color: '#0f172a',
                        marginBottom: '8px',
                      }}
                    >
                      {cs.type === 'faq' ? `Q: ${item.title}` : item.title}
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#475569',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {cs.buttonText && (
              <div style={{ marginTop: '28px' }}>
                <button
                  type="button"
                  style={{
                    background: '#e3ad3f',
                    color: '#0f172a',
                    border: 'none',
                    fontWeight: 700,
                    padding: '12px 28px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() => setPage && setPage('Admission Information')}
                >
                  {cs.buttonText} →
                </button>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* 10. Visit & Contact */}
      <section className="home-contact">
        <div>
          <span className="section-kicker">VISIT {schoolName.toUpperCase()}</span>
          <h2>Come and see learning in action.</h2>
          <p>{address}</p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/contact`}>
              Plan your visit <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Contact Us')}
            >
              Plan your visit <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div className="map-placeholder">
          <Icon name="globe" size={30} />
          <strong>{schoolName}</strong>
          <span>Interactive map location</span>
        </div>
      </section>
    </>
  )
}
