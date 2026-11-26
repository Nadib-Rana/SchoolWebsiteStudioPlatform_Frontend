'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useStudio } from '@/context/StudioContext'
import type { DataItem } from './data-manager.types'

export function useDataManagerData(type: string, refreshKey = 0) {
  const { currentSchool, schoolSwitchKey } = useStudio()
  const [items, setItems] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        if (type === 'pages') {
          const res = await api.pages.list()
          const raw = (res as any)?.data || res
          const data = Array.isArray(raw) ? raw : (raw?.items || [])
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((p: any) => ({
              id: p.id,
              status: p.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
              raw: p,
              cells: [
                p.title,
                p.slug === 'home' ? '/' : `/${p.slug}`,
                p.status === 'PUBLISHED' ? 'Published' : 'Draft',
                p.updatedAt
                  ? new Date(p.updatedAt).toLocaleDateString()
                  : 'Recently',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'teachers') {
          const res = await api.teachers.list()
          const raw = (res as any)?.data || res
          const data = Array.isArray(raw) ? raw : (raw?.items || [])
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((t: any) => ({
              id: t.id,
              status:
                t.status === 'ACTIVE' || t.status === 'PUBLISHED'
                  ? 'PUBLISHED'
                  : 'DRAFT',
              raw: t,
              cells: [
                t.name,
                t.designation,
                t.department || 'General',
                t.status === 'ACTIVE' || t.status === 'PUBLISHED'
                  ? 'Published'
                  : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'governing-body') {
          const categoryLabels: Record<string, string> = {
            GOVERNING_BODY: 'Governing Body',
            MANAGING_COMMITTEE: 'Managing Committee',
            BOARD_OF_TRUSTEES: 'Board of Trustees',
            ADVISORY_BOARD: 'Advisory Board',
          }
          const res = await api.governingBody.list()
          const raw = (res as any)?.data || res
          const data = Array.isArray(raw) ? raw : (raw?.items || [])
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((m: any) => {
              const catLabel =
                categoryLabels[m.category] || m.category || 'Governing Body'
              const committeeText = m.termPeriod
                ? `${catLabel} (${m.termPeriod})`
                : catLabel
              const isLive = m.status === 'ACTIVE' || m.status === 'PUBLISHED'
              return {
                id: m.id,
                status: isLive ? 'PUBLISHED' : 'DRAFT',
                raw: m,
                cells: [
                  m.name,
                  m.designation,
                  committeeText,
                  isLive ? 'Published' : 'Draft',
                ],
              }
            })
            setItems(mapped)
          }
        } else if (type === 'notices') {
          const res = await api.notices.list()
          const raw = (res as any)?.data || res
          const data = Array.isArray(raw) ? raw : (raw?.items || [])
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((n: any) => ({
              id: n.id,
              status: n.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
              raw: n,
              cells: [
                n.title,
                n.category || 'General',
                n.publishDate || n.publishedAt
                  ? new Date(
                      n.publishDate || n.publishedAt,
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Live',
                n.status === 'PUBLISHED' ? 'Published' : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        } else if (type === 'events') {
          const res = await api.events.list()
          const raw = (res as any)?.data || res
          const data = Array.isArray(raw) ? raw : (raw?.items || [])
          if (mounted && Array.isArray(data)) {
            const mapped: DataItem[] = data.map((e: any) => ({
              id: e.id,
              status: e.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
              raw: e,
              cells: [
                e.title,
                e.eventDate
                  ? new Date(e.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Scheduled',
                e.venue || e.location || 'Main Campus',
                e.status === 'PUBLISHED' ? 'Published' : 'Draft',
              ],
            }))
            setItems(mapped)
          }
        }
      } catch (err) {
        console.warn(`Failed to load ${type} data from backend:`, err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [type, refreshKey, currentSchool?.id, schoolSwitchKey])

  return { items, setItems, loading }
}
