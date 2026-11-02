'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { navigationMenu } from '@/constants/mock-data'
import { useStudio } from '@/context/StudioContext'

export function NavigationManager() {
  const { notify } = useStudio()

  return (
    <div className="nav-manager">
      <div className="card menu-editor">
        <div className="sub-tabs">
          <button type="button" className="active">
            Header navigation
          </button>
          <button type="button">Footer navigation</button>
        </div>
        <div className="menu-list">
          {navigationMenu.map((x, i) => (
            <div key={x}>
              <i>⠿</i>
              <span className="section-icon">
                <Icon name={i === 0 ? 'home' : 'file'} size={14} />
              </span>
              <strong>{x}</strong>
              <small>{i === 1 || i === 2 ? 'Dropdown' : 'Page'}</small>
              <button type="button" aria-label={`Options for ${x}`}>
                <Icon name="more" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-section">
          <Icon name="plus" /> Add menu item
        </button>
      </div>

      <div className="card menu-preview">
        <span>LIVE PREVIEW</span>
        <div>
          <div className="public-logo">
            <b>N</b>
            <strong>Northfield</strong>
          </div>
          <nav>
            {navigationMenu.slice(0, 6).map((x) => (
              <small key={x}>{x}</small>
            ))}
          </nav>
          <button type="button">Apply now</button>
        </div>
        <p>
          Drag menu items to reorder them. Nested items become dropdowns
          automatically.
        </p>
        <Button kind="primary" onClick={() => notify('Navigation published')}>
          Save navigation
        </Button>
      </div>
    </div>
  )
}
