'use client'

import Link from 'next/link'
import { Icon } from '@/components/common/Icon'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { themeHeadlines } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'
import type { PublicSiteData } from '@/lib/public-site'

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
  const schoolName = schoolData?.school?.name || 'Northfield High School'
  const motto = schoolData?.profile?.motto || 'A PLACE TO LEARN, LEAD & BELONG'
  const establishedYear = schoolData?.profile?.established || 1983
  const address =
    schoolData?.profile?.address || '27 Lakeview Avenue, Dhanmondi, Dhaka 1209'
  const principalName =
    schoolData?.profile?.principalName || 'Dr. Farhana Noor'
  const principalTitle =
    schoolData?.profile?.principalTitle || 'Principal · ' + schoolName
  const principalMessage =
    schoolData?.profile?.principalBio ||
    'At our school, we pair high expectations with genuine care. Our students learn to think deeply, act with integrity, and use their gifts in service of others.'

  // Stats formatting
  const rawStats = schoolData?.profile?.stats
  let statsList: Array<{ value: string; label: string }> = []
  if (Array.isArray(rawStats) && rawStats.length > 0) {
    statsList = rawStats.map((s) => ({
      value: String(s.value || ''),
      label: String(s.label || ''),
    }))
  } else if (rawStats && typeof rawStats === 'object') {
    statsList = Object.entries(rawStats).map(([key, val]) => ({
      value: String(val),
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
    }))
  } else {
    statsList = [
      { value: '1,240', label: 'Students thriving' },
      { value: `${new Date().getFullYear() - establishedYear}`, label: 'Years of excellence' },
      { value: '98%', label: 'Graduation rate' },
      { value: '16:1', label: 'Student–teacher ratio' },
    ]
  }

  // Teachers for home
  const teachers =
    schoolData?.teachers && schoolData.teachers.length > 0
      ? schoolData.teachers.slice(0, 3)
      : null

  // Notices for home
  const notices =
    schoolData?.notices && schoolData.notices.length > 0
      ? schoolData.notices.slice(0, 3)
      : null

  // Events for home
  const events =
    schoolData?.events && schoolData.events.length > 0
      ? schoolData.events.slice(0, 3)
      : null

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      const day = d.getDate().toString().padStart(2, '0')
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      return { day, month }
    } catch {
      return { day: '01', month: 'JAN' }
    }
  }

  const formatNoticeDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase()
    } catch {
      return 'RECENT'
    }
  }

  return (
    <>
      <section
        className="public-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(7,24,48,.92),rgba(7,24,48,.15)),url(${heroImage})`,
        }}
      >
        <div>
          <span className="public-eyebrow">{motto.toUpperCase()}</span>
          <h1>{themeHeadlines[theme] || `${schoolName}`}</h1>
          <p>
            {schoolData?.profile?.shortBio ||
              schoolData?.profile?.visionStatement ||
              `${schoolName} is a vibrant learning community where every student is known, challenged, and inspired to make a difference.`}
          </p>
          <div>
            {schoolSlug ? (
              <Link href={`/${schoolSlug}/about`} className="hero-primary">
                Explore our school <Icon name="arrow" size={16} />
              </Link>
            ) : (
              <button
                type="button"
                className="hero-primary"
                onClick={() => setPage && setPage('About School')}
              >
                Explore our school <Icon name="arrow" size={16} />
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
        <span className="hero-caption">{schoolName} · {establishedYear}</span>
      </section>

      <section className="public-stats">
        {statsList.slice(0, 4).map((stat, idx) => (
          <div key={idx}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="public-intro">
        <div className="intro-image">
          <img src={campusImage} alt={`${schoolName} campus`} />
          <span>
            <strong>Since {establishedYear}</strong>
            <small>Growing together</small>
          </span>
        </div>
        <div>
          <span className="section-kicker">WELCOME TO {schoolName.toUpperCase()}</span>
          <h2>
            Learning with purpose.
            <br />
            Growing with confidence.
          </h2>
          <p>
            {schoolData?.profile?.missionStatement ||
              `Education at ${schoolName} goes beyond strong results. We nurture curious minds, compassionate leaders, and young people ready to contribute with confidence.`}
          </p>
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

      <section className="principal-home">
        <div>
          <span className="section-kicker">A MESSAGE FROM OUR PRINCIPAL</span>
          <blockquote>
            “The true measure of a school is not only what students achieve, but who they become along the way.”
          </blockquote>
          <p>{principalMessage}</p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/about`}>
              Read {principalName}’s message <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Principal’s Message')}
            >
              Read {principalName}’s message <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <aside>
          {schoolData?.profile?.principalPhotoUrl ? (
            <img
              src={schoolData.profile.principalPhotoUrl}
              alt={principalName}
              className="principal-portrait-img rounded-full w-20 h-20 object-cover mb-2"
            />
          ) : (
            <div className="principal-portrait">
              {principalName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
          )}
          <strong>{principalName}</strong>
          <span>{principalTitle}</span>
        </aside>
      </section>

      <section className="programs">
        <div className="section-heading">
          <div>
            <span className="section-kicker">ACADEMIC JOURNEY</span>
            <h2>Curiosity at every stage.</h2>
          </div>
          <p>
            A connected learning journey designed to help every student discover strengths, deepen knowledge, and find their own voice.
          </p>
        </div>
        <div className="program-grid">
          {['Primary years', 'Middle school', 'Senior school'].map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <small>
                {i === 0
                  ? 'GRADES 1–5'
                  : i === 1
                  ? 'GRADES 6–8'
                  : 'GRADES 9–12'}
              </small>
              <h3>{x}</h3>
              <p>
                {i === 0
                  ? 'Building joyful foundations through inquiry and discovery.'
                  : i === 1
                  ? 'Growing independence, confidence, and critical thought.'
                  : 'Preparing ambitious learners for life beyond school.'}
              </p>
              {schoolSlug ? (
                <Link href={`/${schoolSlug}/about`}>
                  Explore program <Icon name="arrow" size={14} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setPage && setPage('Academic Programs')}
                >
                  Explore program <Icon name="arrow" size={14} />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="home-community">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PEOPLE OF {schoolName.toUpperCase()}</span>
            <h2>
              Teachers who make
              <br />
              learning personal.
            </h2>
          </div>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/teachers`}>
              Meet our faculty <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setPage && setPage('Teachers & Faculty')}
            >
              Meet our faculty <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div className="home-teachers">
          {teachers ? (
            teachers.map((t, i) => (
              <article key={t.id}>
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    className={`faculty-photo fp${i % 3} object-cover`}
                  />
                ) : (
                  <div className={`faculty-photo fp${i % 3}`}>
                    {t.name
                      .split(' ')
                      .map((v) => v[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                )}
                <small>{t.designation?.toUpperCase() || 'FACULTY'}</small>
                <h3>{t.name}</h3>
                {schoolSlug && (
                  <Link
                    href={`/${schoolSlug}/teachers/${t.id}`}
                    className="text-xs text-blue-800 font-semibold mt-2 inline-flex items-center gap-1"
                  >
                    View profile <Icon name="arrow" size={11} />
                  </Link>
                )}
              </article>
            ))
          ) : (
            ['Mahmud Karim', 'Sara Jahan', 'Nabil Chowdhury'].map((x, i) => (
              <article key={x}>
                <div className={`faculty-photo fp${i}`}>
                  {x
                    .split(' ')
                    .map((v) => v[0])
                    .join('')}
                </div>
                <small>
                  {i === 0
                    ? 'HEAD OF SCIENCE'
                    : i === 1
                    ? 'SENIOR ENGLISH TEACHER'
                    : 'MATHEMATICS TEACHER'}
                </small>
                <h3>{x}</h3>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="home-news">
        <div>
          <span className="section-kicker">LATEST UPDATES</span>
          <h2>
            What’s happening
            <br />
            at {schoolName}.
          </h2>
          <p>
            Stay connected with important announcements and moments across our community.
          </p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/notices`}>
              View all notices <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button type="button" onClick={() => setPage && setPage('Notices')}>
              View all notices <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div>
          {notices ? (
            notices.map((n) => (
              <article key={n.id}>
                <span>{formatNoticeDate(n.publishDate)}</span>
                <div>
                  <small>{n.category?.toUpperCase() || 'GENERAL'}</small>
                  <h3>{n.title}</h3>
                </div>
                {schoolSlug ? (
                  <Link href={`/${schoolSlug}/notices/${n.id}`} aria-label={`View ${n.title}`}>
                    <Icon name="arrow" />
                  </Link>
                ) : (
                  <Icon name="arrow" />
                )}
              </article>
            ))
          ) : (
            [
              ['12 MAY', 'Summer schedule and office hours', 'GENERAL'],
              ['10 MAY', 'Science Fair registration is now open', 'ACADEMIC'],
              ['08 MAY', 'Parent–teacher meeting bookings', 'PARENTS'],
            ].map((x) => (
              <article key={x[1]}>
                <span>{x[0]}</span>
                <div>
                  <small>{x[2]}</small>
                  <h3>{x[1]}</h3>
                </div>
                <Icon name="arrow" />
              </article>
            ))
          )}
        </div>
      </section>

      <section className="home-events">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SAVE THE DATE</span>
            <h2>Upcoming events.</h2>
          </div>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/events`}>
              Full calendar <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button type="button" onClick={() => setPage && setPage('Events')}>
              Full calendar <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <div>
          {events ? (
            events.map((ev) => {
              const { day, month } = formatEventDate(ev.eventDate)
              return (
                <article key={ev.id}>
                  <span>
                    <strong>{day}</strong>
                    <small>{month}</small>
                  </span>
                  <div>
                    <h3>{ev.title}</h3>
                    <p>{ev.venue || 'Main Campus'} {ev.time ? `· ${ev.time}` : ''}</p>
                  </div>
                  {schoolSlug ? (
                    <Link
                      href={`/${schoolSlug}/events/${ev.id}`}
                      aria-label={`View ${ev.title}`}
                    >
                      <Icon name="arrow" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-label={`View ${ev.title}`}
                      onClick={() => setPage && setPage('Event Details')}
                    >
                      <Icon name="arrow" />
                    </button>
                  )}
                </article>
              )
            })
          ) : (
            [
              ['18', 'MAY', 'Inter-school Science Fair', 'Main Auditorium · 9:00 AM'],
              ['22', 'MAY', 'Spring Music Evening', 'Performing Arts Hall · 6:30 PM'],
              ['02', 'JUN', 'Parent Orientation', 'Conference Center · 10:00 AM'],
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
                <button
                  type="button"
                  aria-label={`View ${x[2]}`}
                  onClick={() => setPage && setPage('Event Details')}
                >
                  <Icon name="arrow" />
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="home-gallery">
        <div className="gallery-copy">
          <span className="section-kicker">LIFE AT {schoolName.toUpperCase()}</span>
          <h2>
            Learning happens
            <br />
            everywhere.
          </h2>
          <p>
            Explore the spaces, activities, and everyday moments that shape our school community.
          </p>
          {schoolSlug ? (
            <Link href={`/${schoolSlug}/gallery`}>
              Explore our gallery <Icon name="arrow" size={14} />
            </Link>
          ) : (
            <button type="button" onClick={() => setPage && setPage('Photo Gallery')}>
              Explore our gallery <Icon name="arrow" size={14} />
            </button>
          )}
        </div>
        <img
          src={
            schoolData?.albums?.[0]?.photos?.[0]?.url ||
            schoolData?.albums?.[0]?.coverUrl ||
            campusImage
          }
          alt={`Students around ${schoolName} campus`}
        />
        <img
          src={
            schoolData?.albums?.[1]?.photos?.[0]?.url ||
            schoolData?.albums?.[0]?.photos?.[1]?.url ||
            interiorImage
          }
          alt={`${schoolName} learning commons`}
        />
      </section>

      <section className="facilities-strip">
        {[
          ['Science laboratories', 'Purpose-built spaces for investigation.'],
          ['Library & media center', 'A calm home for reading and research.'],
          ['Sports & wellbeing', 'Facilities for movement, teamwork, and health.'],
          ['Arts & performance', 'Studios and stages for creative expression.'],
        ].map((x, i) => (
          <article key={x[0]}>
            <span>0{i + 1}</span>
            <h3>{x[0]}</h3>
            <p>{x[1]}</p>
          </article>
        ))}
      </section>

      <section className="public-cta">
        <span>ADMISSIONS OPEN</span>
        <h2>
          See where your child’s
          <br />
          story could lead.
        </h2>
        <p>
          Applications are now open. Discover our learning community and take the next step with {schoolName}.
        </p>
        {schoolSlug ? (
          <Link href={`/${schoolSlug}/admissions`} className="hero-primary">
            Start your application <Icon name="external" size={15} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPage && setPage('Admission Information')}
          >
            Start your application <Icon name="external" size={15} />
          </button>
        )}
        <small>You’ll continue securely to our admissions portal.</small>
      </section>

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
            <button type="button" onClick={() => setPage && setPage('Contact Us')}>
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
