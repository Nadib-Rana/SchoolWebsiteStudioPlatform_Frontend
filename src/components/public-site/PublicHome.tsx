'use client'

import { Icon } from '@/components/common/Icon'
import { campusImage, heroImage, interiorImage } from '@/config/templates'
import { themeHeadlines } from '@/config/themes'
import type { SchoolTheme } from '@/types/theme'

export interface PublicHomeProps {
  theme: SchoolTheme
  setPage: (p: string) => void
}

export function PublicHome({ theme, setPage }: PublicHomeProps) {
  return (
    <>
      <section
        className="public-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(7,24,48,.92),rgba(7,24,48,.15)),url(${heroImage})`,
        }}
      >
        <div>
          <span className="public-eyebrow">A PLACE TO LEARN, LEAD & BELONG</span>
          <h1>{themeHeadlines[theme]}</h1>
          <p>
            Northfield is a vibrant learning community where every student is known,
            challenged, and inspired to make a difference.
          </p>
          <div>
            <button
              type="button"
              className="hero-primary"
              onClick={() => setPage('About School')}
            >
              Explore our school <Icon name="arrow" size={16} />
            </button>
            <button
              type="button"
              className="hero-secondary"
              onClick={() => setPage('Admission Information')}
            >
              Apply for admission
            </button>
          </div>
        </div>
        <span className="hero-caption">Northfield campus · Spring 2025</span>
      </section>

      <section className="public-stats">
        <div>
          <strong>1,240</strong>
          <span>Students thriving</span>
        </div>
        <div>
          <strong>42</strong>
          <span>Years of excellence</span>
        </div>
        <div>
          <strong>98%</strong>
          <span>Graduation rate</span>
        </div>
        <div>
          <strong>16:1</strong>
          <span>Student–teacher ratio</span>
        </div>
      </section>

      <section className="public-intro">
        <div className="intro-image">
          <img src={campusImage} alt="Northfield school campus" />
          <span>
            <strong>Since 1983</strong>
            <small>Growing together</small>
          </span>
        </div>
        <div>
          <span className="section-kicker">WELCOME TO NORTHFIELD</span>
          <h2>
            Learning with purpose.
            <br />
            Growing with confidence.
          </h2>
          <p>
            Education at Northfield goes beyond strong results. We nurture curious
            minds, compassionate leaders, and young people ready to contribute with
            confidence.
          </p>
          <blockquote>
            “Every child deserves to be truly known, deeply supported, and
            meaningfully challenged.”
          </blockquote>
          <button
            type="button"
            className="read-link"
            onClick={() => setPage('About School')}
          >
            Discover our story <Icon name="arrow" size={15} />
          </button>
        </div>
      </section>

      <section className="principal-home">
        <div>
          <span className="section-kicker">A MESSAGE FROM OUR PRINCIPAL</span>
          <blockquote>
            “The true measure of a school is not only what students achieve, but
            who they become along the way.”
          </blockquote>
          <p>
            At Northfield, we pair high expectations with genuine care. Our
            students learn to think deeply, act with integrity, and use their gifts
            in service of others.
          </p>
          <button
            type="button"
            onClick={() => setPage('Principal’s Message')}
          >
            Read Dr. Noor’s message <Icon name="arrow" size={14} />
          </button>
        </div>
        <aside>
          <div className="principal-portrait">FN</div>
          <strong>Dr. Farhana Noor</strong>
          <span>Principal · Northfield High School</span>
        </aside>
      </section>

      <section className="programs">
        <div className="section-heading">
          <div>
            <span className="section-kicker">ACADEMIC JOURNEY</span>
            <h2>Curiosity at every stage.</h2>
          </div>
          <p>
            A connected learning journey designed to help every student discover
            strengths, deepen knowledge, and find their own voice.
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
              <button
                type="button"
                onClick={() => setPage('Academic Programs')}
              >
                Explore program <Icon name="arrow" size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-community">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PEOPLE OF NORTHFIELD</span>
            <h2>
              Teachers who make
              <br />
              learning personal.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setPage('Teachers & Faculty')}
          >
            Meet our faculty <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="home-teachers">
          {['Mahmud Karim', 'Sara Jahan', 'Nabil Chowdhury'].map((x, i) => (
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
          ))}
        </div>
      </section>

      <section className="home-news">
        <div>
          <span className="section-kicker">LATEST UPDATES</span>
          <h2>
            What’s happening
            <br />
            at Northfield.
          </h2>
          <p>
            Stay connected with important announcements and moments across our
            community.
          </p>
          <button type="button" onClick={() => setPage('Notices')}>
            View all notices <Icon name="arrow" size={14} />
          </button>
        </div>
        <div>
          {[
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
          ))}
        </div>
      </section>

      <section className="home-events">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SAVE THE DATE</span>
            <h2>Upcoming events.</h2>
          </div>
          <button type="button" onClick={() => setPage('Events')}>
            Full calendar <Icon name="arrow" size={14} />
          </button>
        </div>
        <div>
          {[
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
                onClick={() => setPage('Event Details')}
              >
                <Icon name="arrow" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-gallery">
        <div className="gallery-copy">
          <span className="section-kicker">LIFE AT NORTHFIELD</span>
          <h2>
            Learning happens
            <br />
            everywhere.
          </h2>
          <p>
            Explore the spaces, activities, and everyday moments that shape our
            school community.
          </p>
          <button type="button" onClick={() => setPage('Photo Gallery')}>
            Explore our gallery <Icon name="arrow" size={14} />
          </button>
        </div>
        <img src={campusImage} alt="Students around Northfield campus" />
        <img src={interiorImage} alt="Northfield learning commons" />
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
        <span>ADMISSIONS 2025–26</span>
        <h2>
          See where your child’s
          <br />
          story could lead.
        </h2>
        <p>
          Applications are now open. Discover our learning community and take the
          next step with Northfield.
        </p>
        <button
          type="button"
          onClick={() => setPage('Admission Information')}
        >
          Start your application <Icon name="external" size={15} />
        </button>
        <small>You’ll continue securely to our admissions portal.</small>
      </section>

      <section className="home-contact">
        <div>
          <span className="section-kicker">VISIT NORTHFIELD</span>
          <h2>Come and see learning in action.</h2>
          <p>27 Lakeview Avenue, Dhanmondi, Dhaka 1209</p>
          <button type="button" onClick={() => setPage('Contact Us')}>
            Plan your visit <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="map-placeholder">
          <Icon name="globe" size={30} />
          <strong>Northfield High School</strong>
          <span>Interactive map location</span>
        </div>
      </section>
    </>
  )
}
