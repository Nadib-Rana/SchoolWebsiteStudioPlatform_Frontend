'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { mediaItems } from '@/constants/mock-data'
import { useState } from 'react'

export function MediaLibrary() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All files')

  const filtered = mediaItems.filter(
    (x) =>
      x[1].toLowerCase().includes(query.toLowerCase()) &&
      (type === 'All files' || (type === 'Images' ? Boolean(x[0]) : !x[0]))
  )

  const cycleType = () => {
    setType(type === 'All files' ? 'Images' : type === 'Images' ? 'Documents' : 'All files')
  }

  return (
    <>
      <div className="media-toolbar">
        <div className="search-field wide">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files and folders"
          />
        </div>
        <button type="button" className="select-button" onClick={cycleType}>
          {type} <Icon name="chevron" size={13} />
        </button>
        <button
          type="button"
          className="select-button"
          onClick={() => setQuery('')}
        >
          Clear search <Icon name="close" size={13} />
        </button>
      </div>

      {filtered.length ? (
        <div className="media-grid">
          {filtered.map((x, i) => (
            <div className="card media-item" key={x[1]}>
              <div
                className={x[0] ? 'media-photo' : 'document'}
                style={x[0] ? { backgroundImage: `url(${x[0]})` } : {}}
              >
                {!x[0] && (
                  <>
                    <Icon name="file" size={28} />
                    <span>PDF</span>
                  </>
                )}
              </div>
              <section>
                <strong>{x[1]}</strong>
                <small>
                  {x[2]} · {i + 2} days ago
                </small>
                <button
                  type="button"
                  aria-label={`Open actions for ${x[1]}`}
                >
                  <Icon name="more" />
                </button>
              </section>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>
            <Icon name="search" />
          </span>
          <strong>No media found</strong>
          <p>Try a different search term or file type.</p>
          <Button
            onClick={() => {
              setQuery('')
              setType('All files')
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </>
  )
}
