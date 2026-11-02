'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { StateBadge } from '@/components/common/StateBadge'
import { contentItems } from '@/constants/mock-data'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function ContentManager() {
  const { notify } = useStudio()
  const [activeItem, setActiveItem] = useState(0)

  return (
    <div className="content-layout">
      <div className="content-list">
        {contentItems.map((x, i) => (
          <button
            type="button"
            className={activeItem === i ? 'active' : ''}
            onClick={() => setActiveItem(i)}
            key={x[0]}
          >
            <span className={`content-icon c${i}`}>
              <Icon
                name={i > 5 ? 'sparkle' : i > 2 ? 'file' : 'home'}
                size={17}
              />
            </span>
            <div>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
              <em>
                <i style={{ width: x[2] }} />
                {x[2]} complete
              </em>
            </div>
            <Icon name="chevron" size={15} />
          </button>
        ))}
      </div>

      <div className="card content-form">
        <div className="form-title">
          <div>
            <h3>School information</h3>
            <p>This information appears throughout your public website.</p>
          </div>
          <StateBadge status="published">Published</StateBadge>
        </div>

        <div className="logo-upload">
          <div>NH</div>
          <span>
            <strong>School logo</strong>
            <small>PNG, JPG or SVG · Max 5 MB</small>
            <button type="button">Replace logo</button>
          </span>
        </div>

        <div className="form-grid">
          <label>
            School name
            <input defaultValue="Northfield High School" />
          </label>
          <label>
            School type
            <select defaultValue="Secondary school">
              <option>Secondary school</option>
            </select>
          </label>
          <label className="full">
            School address
            <input defaultValue="27 Lakeview Avenue, Dhanmondi, Dhaka 1209" />
          </label>
          <label>
            Contact number
            <input defaultValue="+880 2 555 0142" />
          </label>
          <label>
            Public email
            <input defaultValue="hello@northfield.edu" />
          </label>
          <label>
            Established year
            <input defaultValue="1983" />
          </label>
          <label>
            School code
            <input defaultValue="NHS-1042" />
          </label>
        </div>

        <div className="form-actions">
          <span>Last saved 4 minutes ago</span>
          <Button onClick={() => notify('Draft saved')}>Save draft</Button>
          <Button
            kind="primary"
            onClick={() => notify('School information published')}
          >
            Publish changes
          </Button>
        </div>
      </div>
    </div>
  )
}
