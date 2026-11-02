'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'

export function Publishing() {
  const { notify } = useStudio()

  const changes = [
    ['Homepage', 'Hero heading and background image updated', 'Amina · 24 min ago'],
    ['Notices', 'Science Fair notice added', 'Mahmud · 2 hrs ago'],
    ['Teachers', 'Nabil Chowdhury profile completed', 'Sara · 4 hrs ago'],
    ['Navigation', 'Admissions moved to primary menu', 'Amina · Yesterday'],
    ['SEO', 'Homepage meta description improved', 'Amina · Yesterday'],
  ] as const

  const versions = [
    ['v2.7', 'Current published version', 'May 12 · Amina Rahman'],
    ['v2.6', 'Admissions content update', 'May 8 · Amina Rahman'],
    ['v2.5', 'Spring events and notices', 'May 2 · Mahmud Karim'],
    ['v2.4', 'Teacher profile refresh', 'Apr 24 · Sara Jahan'],
  ] as const

  return (
    <div className="publishing-layout">
      <div className="card release-card">
        <div className="release-top">
          <span className="release-icon">
            <Icon name="sparkle" />
          </span>
          <div>
            <span className="state-badge draft">
              <i />
              Draft ready
            </span>
            <h2>5 changes are ready to publish</h2>
            <p>
              Your published website remains unchanged until you approve this
              release.
            </p>
          </div>
          <Button
            kind="primary"
            onClick={() => notify('Version 2.8 is now live')}
          >
            Publish version 2.8
          </Button>
        </div>
        <div className="change-list">
          {changes.map((x) => (
            <div key={x[0]}>
              <span>
                <Icon name="check" size={13} />
              </span>
              <div>
                <strong>{x[0]}</strong>
                <p>{x[1]}</p>
              </div>
              <small>{x[2]}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="card version-card">
        <div className="card-title">
          <div>
            <h3>Version history</h3>
            <p>Review or restore a previous release</p>
          </div>
        </div>
        {versions.map((x, i) => (
          <div className="version-row" key={x[0]}>
            <b>{x[0]}</b>
            <div>
              <strong>{x[1]}</strong>
              <small>{x[2]}</small>
            </div>
            {i === 0 ? (
              <span className="state-badge published">
                <i />
                Live
              </span>
            ) : (
              <Button onClick={() => notify(`${x[0]} selected for comparison`)}>
                Compare
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="card danger-zone">
        <div>
          <strong>Unpublish website</strong>
          <p>
            Take the public website offline while keeping all content and
            drafts.
          </p>
        </div>
        <Button onClick={() => notify('Unpublish requires owner confirmation')}>
          Unpublish
        </Button>
      </div>
    </div>
  )
}
