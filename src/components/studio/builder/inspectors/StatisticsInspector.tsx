'use client'

import { SettingGroup } from '@/components/common/SettingGroup'

interface StatisticsInspectorProps {
  stat1Val: string
  setStat1Val: (s: string) => void
  stat1Label: string
  setStat1Label: (s: string) => void
  stat2Val: string
  setStat2Val: (s: string) => void
  stat2Label: string
  setStat2Label: (s: string) => void
  stat3Val: string
  setStat3Val: (s: string) => void
  stat3Label: string
  setStat3Label: (s: string) => void
  stat4Val: string
  setStat4Val: (s: string) => void
  stat4Label: string
  setStat4Label: (s: string) => void
}

export function StatisticsInspector({
  stat1Val,
  setStat1Val,
  stat1Label,
  setStat1Label,
  stat2Val,
  setStat2Val,
  stat2Label,
  setStat2Label,
  stat3Val,
  setStat3Val,
  stat3Label,
  setStat3Label,
  stat4Val,
  setStat4Val,
  stat4Label,
  setStat4Label,
}: StatisticsInspectorProps) {
  return (
    <SettingGroup title="Key stats counters">
      <label>
        Stat 1 (Value / Label)
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={stat1Val}
            onChange={(e) => setStat1Val(e.target.value)}
            style={{ width: '40%' }}
          />
          <input
            value={stat1Label}
            onChange={(e) => setStat1Label(e.target.value)}
            style={{ width: '60%' }}
          />
        </div>
      </label>
      <label>
        Stat 2 (Value / Label)
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={stat2Val}
            onChange={(e) => setStat2Val(e.target.value)}
            style={{ width: '40%' }}
          />
          <input
            value={stat2Label}
            onChange={(e) => setStat2Label(e.target.value)}
            style={{ width: '60%' }}
          />
        </div>
      </label>
      <label>
        Stat 3 (Value / Label)
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={stat3Val}
            onChange={(e) => setStat3Val(e.target.value)}
            style={{ width: '40%' }}
          />
          <input
            value={stat3Label}
            onChange={(e) => setStat3Label(e.target.value)}
            style={{ width: '60%' }}
          />
        </div>
      </label>
      <label>
        Stat 4 (Value / Label)
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={stat4Val}
            onChange={(e) => setStat4Val(e.target.value)}
            style={{ width: '40%' }}
          />
          <input
            value={stat4Label}
            onChange={(e) => setStat4Label(e.target.value)}
            style={{ width: '60%' }}
          />
        </div>
      </label>
    </SettingGroup>
  )
}
