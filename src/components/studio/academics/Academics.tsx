'use client'

import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'
import { useStudio } from '@/context/StudioContext'
import { useEffect, useState } from 'react'

export function Academics() {
  const { setView } = useStudio()
  const [cards, setCards] = useState<Array<[string, string, string]>>([
    ['Academic programs', '3', 'Primary, Middle and Senior School'],
    ['Classes & grades', '12', 'Grades 1 through 12'],
    ['Subjects', '28', 'Across all academic levels'],
    ['Facilities', '14', 'Labs, library, arts and sports'],
    ['Achievements', '36', 'Academic and co-curricular awards'],
  ])

  useEffect(() => {
    let mounted = true
    const loadAcademics = async () => {
      try {
        const res = await api.content.get()
        const data = (res as any)?.data || res
        if (mounted && data?.profile?.academics) {
          const ac = data.profile.academics as any
          const programsCount = ac.programs?.length ? String(ac.programs.length) : '3'
          const facilitiesCount = ac.facilities?.length ? String(ac.facilities.length) : '14'
          setCards([
            ['Academic programs', programsCount, 'Primary, Middle and Senior School'],
            ['Classes & grades', '12', 'Grades 1 through 12'],
            ['Subjects', '28', 'Across all academic levels'],
            ['Facilities', facilitiesCount, 'Labs, library, arts and sports'],
            ['Achievements', '36', 'Academic and co-curricular awards'],
          ])
        }
      } catch (err) {
        console.warn('Failed to load academic data:', err)
      }
    }
    loadAcademics()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="academic-grid">
      {cards.map((x, i) => (
        <div
          className="card academic-card cursor-pointer hover:border-slate-400 transition"
          key={x[0]}
          onClick={() => setView('content')}
        >
          <span className={`academic-icon a${i}`}>
            <Icon name={i === 3 ? 'home' : i === 4 ? 'sparkle' : 'file'} />
          </span>
          <div>
            <small>{x[0]}</small>
            <strong>{x[1]}</strong>
            <p>{x[2]}</p>
          </div>
          <button type="button" aria-label={`View ${x[0]}`}>
            <Icon name="arrow" />
          </button>
        </div>
      ))}
    </div>
  )
}
