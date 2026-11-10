'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { AuditLogItem, AuditCategoryFilter } from './audit.types'
import { AuditLogFilterBar } from './AuditLogFilterBar'
import { AuditLogTimeline } from './AuditLogTimeline'

export function AuditLogManager() {
  const { notify, currentSchool } = useStudio()
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<AuditCategoryFilter>('ALL')

  const loadLogs = useCallback(async () => {
    try {
      const res = await api.auditLogs.list(100)
      const data = res?.data || res
      if (Array.isArray(data)) setLogs(data)
    } catch {
      notify('Unable to load audit logs from server')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: logs.length }
    for (const log of logs) {
      const act = log.action.toUpperCase()
      const ent = log.entity.toUpperCase()
      if (ent === 'PAGE' || act.includes('PUBLISH') || act.includes('RELEASE')) {
        map.PUBLISHING = (map.PUBLISHING || 0) + 1
      }
      if (ent === 'THEME' || act.includes('THEME') || act.includes('BUILDER')) {
        map.THEME = (map.THEME || 0) + 1
      }
      if (ent === 'DOMAIN' || act.includes('DOMAIN') || act.includes('DNS')) {
        map.DOMAINS = (map.DOMAINS || 0) + 1
      }
      if (ent === 'MEMBER' || act.includes('MEMBER') || act.includes('ROLE')) {
        map.MEMBERS = (map.MEMBERS || 0) + 1
      }
      if (ent === 'INQUIRY' || act.includes('INQUIRY') || act.includes('CONTACT')) {
        map.COMMUNICATION = (map.COMMUNICATION || 0) + 1
      }
    }
    return map
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const act = log.action.toUpperCase()
      const ent = log.entity.toUpperCase()
      let matchesCat = activeCategory === 'ALL'
      if (activeCategory === 'PUBLISHING') matchesCat = ent === 'PAGE' || act.includes('PUBLISH') || act.includes('RELEASE')
      if (activeCategory === 'THEME') matchesCat = ent === 'THEME' || act.includes('THEME') || act.includes('BUILDER')
      if (activeCategory === 'DOMAINS') matchesCat = ent === 'DOMAIN' || act.includes('DOMAIN') || act.includes('DNS')
      if (activeCategory === 'MEMBERS') matchesCat = ent === 'MEMBER' || act.includes('MEMBER') || act.includes('ROLE')
      if (activeCategory === 'COMMUNICATION') matchesCat = ent === 'INQUIRY' || act.includes('INQUIRY') || act.includes('CONTACT')

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        log.title.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q)

      return matchesCat && matchesSearch
    })
  }, [logs, activeCategory, searchQuery])

  const handleExportCsv = () => {
    if (filteredLogs.length === 0) return
    const headers = ['Action', 'Entity', 'Title', 'Detail', 'User', 'Email', 'IP Address', 'Date']
    const rows = filteredLogs.map((l) => [
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      `"${l.userEmail || ''}"`,
      `"${l.ipAddress || ''}"`,
      `"${new Date(l.createdAt).toISOString()}"`,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    const schoolSlug = currentSchool?.slug || 'school'
    link.setAttribute('href', url)
    link.setAttribute('download', `${schoolSlug}_audit_log_${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Audit log exported to CSV')
  }

  return (
    <div className="space-y-6">
      <AuditLogFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onRefresh={loadLogs}
        onExportCsv={handleExportCsv}
        totalCount={filteredLogs.length}
        counts={counts}
      />

      <AuditLogTimeline logs={filteredLogs} loading={loading} />
    </div>
  )
}
