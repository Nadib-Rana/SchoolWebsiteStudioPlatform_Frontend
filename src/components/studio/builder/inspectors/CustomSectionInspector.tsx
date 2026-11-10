'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingGroup } from '@/components/common/SettingGroup'
import type { CustomSectionData } from '../builder.types'

interface CustomSectionInspectorProps {
  sectionData: CustomSectionData
  selected: string
  setCustomSectionsData: React.Dispatch<React.SetStateAction<Record<string, CustomSectionData>>>
}

export function CustomSectionInspector({
  sectionData,
  selected,
  setCustomSectionsData,
}: CustomSectionInspectorProps) {
  return (
    <>
      <SettingGroup title="Section details">
        <label>
          Section heading
          <input
            value={sectionData.title}
            onChange={(e) => {
              const val = e.target.value
              setCustomSectionsData((prev) => ({
                ...prev,
                [selected]: { ...prev[selected], title: val },
              }))
            }}
          />
        </label>
        <label>
          Subtitle / Description
          <textarea
            value={sectionData.subtitle}
            onChange={(e) => {
              const val = e.target.value
              setCustomSectionsData((prev) => ({
                ...prev,
                [selected]: { ...prev[selected], subtitle: val },
              }))
            }}
          />
        </label>
      </SettingGroup>

      <SettingGroup title="Content Items & Cards">
        {sectionData.items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px',
              background: '#f8fafc',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}
            >
              <small style={{ fontWeight: 700, color: '#2563eb' }}>
                Card #{idx + 1}
              </small>
              <span
                title="Delete card"
                onClick={() => {
                  const nextItems = sectionData.items.filter((_, i) => i !== idx)
                  setCustomSectionsData((prev) => ({
                    ...prev,
                    [selected]: { ...prev[selected], items: nextItems },
                  }))
                }}
                style={{
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Remove
              </span>
            </div>
            <label style={{ margin: '0 0 6px' }}>
              Title
              <input
                value={item.title}
                onChange={(e) => {
                  const val = e.target.value
                  const nextItems = [...sectionData.items]
                  nextItems[idx].title = val
                  setCustomSectionsData((prev) => ({
                    ...prev,
                    [selected]: { ...prev[selected], items: nextItems },
                  }))
                }}
              />
            </label>
            <label style={{ margin: 0 }}>
              Body text
              <textarea
                style={{ height: '60px' }}
                value={item.text}
                onChange={(e) => {
                  const val = e.target.value
                  const nextItems = [...sectionData.items]
                  nextItems[idx].text = val
                  setCustomSectionsData((prev) => ({
                    ...prev,
                    [selected]: { ...prev[selected], items: nextItems },
                  }))
                }}
              />
            </label>
          </div>
        ))}

        <Button
          kind="secondary"
          onClick={() => {
            const nextItems = [
              ...(sectionData.items || []),
              { title: 'New Item', text: 'Enter description text here...' },
            ]
            setCustomSectionsData((prev) => ({
              ...prev,
              [selected]: { ...prev[selected], items: nextItems },
            }))
          }}
          style={{ width: '100%', marginTop: '6px' }}
        >
          <Icon name="plus" size={13} /> Add New Card
        </Button>
      </SettingGroup>

      {sectionData.buttonText !== undefined && (
        <SettingGroup title="Action Button">
          <label>
            Button label
            <input
              value={sectionData.buttonText}
              onChange={(e) => {
                const val = e.target.value
                setCustomSectionsData((prev) => ({
                  ...prev,
                  [selected]: { ...prev[selected], buttonText: val },
                }))
              }}
            />
          </label>
          <label>
            Button link URL
            <input
              value={sectionData.buttonLink}
              onChange={(e) => {
                const val = e.target.value
                setCustomSectionsData((prev) => ({
                  ...prev,
                  [selected]: { ...prev[selected], buttonLink: val },
                }))
              }}
            />
          </label>
        </SettingGroup>
      )}
    </>
  )
}
