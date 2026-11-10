'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'

export function TemplateHeroBanner() {
  const { setView } = useStudio()

  return (
    <div className="template-feature">
      <div>
        <span className="feature-pill">
          <Icon name="sparkle" size={14} /> CURATED FOR YOU
        </span>
        <h2>
          Designed to make your school
          <br />
          stand out with confidence.
        </h2>
        <p>
          Every template is responsive, accessible, and purpose-built for school
          communities.
        </p>
        <div>
          <Button
            kind="dark"
            icon="eye"
            onClick={() => setView('public')}
          >
            Preview your website
          </Button>
          <button
            type="button"
            className="text-link"
            onClick={() => setView('theme')}
            title="Open Theme & Layout customizer"
          >
            How templates work <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
      <div className="browser-mock">
        <div className="browser-top">
          <i />
          <i />
          <i />
        </div>
        <div
          className="browser-image"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(10,25,45,.82),rgba(10,25,45,.05)),url(${heroImage})`,
          }}
        >
          <span>NORTHFIELD</span>
          <strong>
            Where curiosity
            <br />
            becomes character.
          </strong>
          <small>Explore our school →</small>
        </div>
      </div>
    </div>
  )
}
