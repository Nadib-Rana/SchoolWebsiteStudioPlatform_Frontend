'use client'

import { Icon } from '@/components/common/Icon'
import { SECTION_TEMPLATES, type SectionItem } from './builder.types'

interface BuilderLeftSidebarProps {
  leftPanelTab: 'sections' | 'components'
  setLeftPanelTab: (t: 'sections' | 'components') => void
  sectionList: SectionItem[]
  selected: string
  showAnnouncement: boolean
  onSelectSection: (label: string) => void
  onDeleteSection: (label: string, e: React.MouseEvent) => void
  onOpenAddModal: () => void
  onAddSection: (tpl: any) => void
}

export function BuilderLeftSidebar({
  leftPanelTab,
  setLeftPanelTab,
  sectionList,
  selected,
  showAnnouncement,
  onSelectSection,
  onDeleteSection,
  onOpenAddModal,
  onAddSection,
}: BuilderLeftSidebarProps) {
  return (
    <aside className="builder-left">
      <div className="panel-tabs">
        <button
          type="button"
          className={leftPanelTab === 'sections' ? 'active' : ''}
          onClick={() => setLeftPanelTab('sections')}
        >
          Sections
        </button>
        <button
          type="button"
          className={leftPanelTab === 'components' ? 'active' : ''}
          onClick={() => setLeftPanelTab('components')}
        >
          Components
        </button>
      </div>

      {leftPanelTab === 'sections' ? (
        <>
          <div className="panel-heading">
            <span>PAGE STRUCTURE</span>
            <button
              type="button"
              aria-label="Add element"
              onClick={onOpenAddModal}
            >
              <Icon name="plus" />
            </button>
          </div>
          <div className="section-list">
            {sectionList.map((sec) => {
              const isHidden = sec.label === 'Announcement bar' && !showAnnouncement
              return (
                <button
                  key={sec.label}
                  type="button"
                  onClick={() => onSelectSection(sec.label)}
                  className={selected === sec.label ? 'active' : ''}
                  style={{
                    cursor: 'pointer',
                    transition: 'background 0.15s, border 0.15s',
                  }}
                >
                  <i>⠿</i>
                  <span className="section-icon">
                    <Icon name={sec.icon as any} size={15} />
                  </span>
                  <strong>{sec.label}</strong>
                  {isHidden && <small>Hidden</small>}
                  {sec.isCustom ? (
                    <span
                      title="Remove section"
                      onClick={(e) => onDeleteSection(sec.label, e)}
                      style={{
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon name="close" size={13} />
                    </span>
                  ) : (
                    <Icon name="more" size={15} />
                  )}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="add-section"
            onClick={onOpenAddModal}
          >
            <Icon name="plus" /> Add section
          </button>
        </>
      ) : (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
            AVAILABLE COMPONENTS
          </span>
          {SECTION_TEMPLATES.map((tpl) => (
            <div
              key={tpl.type}
              onClick={() => onAddSection(tpl)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name={tpl.icon} size={14} />
                <strong style={{ color: '#1e293b' }}>{tpl.label}</strong>
              </div>
              <span style={{ color: '#2563eb', fontWeight: 600, fontSize: '11px' }}>+ Add</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
