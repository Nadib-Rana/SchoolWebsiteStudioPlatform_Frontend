'use client'

import { Icon } from '@/components/common/Icon'

interface ContentSidebarNavProps {
  items: Array<[string, string, string]>
  activeItem: number
  onSelectItem: (idx: number) => void
}

export function ContentSidebarNav({
  items,
  activeItem,
  onSelectItem,
}: ContentSidebarNavProps) {
  return (
    <div className="content-list">
      {items.map((x, i) => (
        <button
          type="button"
          className={activeItem === i ? 'active' : ''}
          onClick={() => onSelectItem(i)}
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
  )
}
