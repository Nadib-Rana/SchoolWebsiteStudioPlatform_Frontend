'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'

export function useSettingsMembers(
  currentSchool: any,
  schoolSwitchKey: string | number,
  notify: (msg: string) => void
) {
  const [users, setUsers] = useState<Array<[string, string, string, string, string]>>([
    ['AR', 'Amina Rahman', 'admin@northfield.edu', 'Owner', 'Active'],
    ['MK', 'Mahmud Karim', 'mahmud@northfield.edu', 'Editor', 'Active'],
    ['SJ', 'Sara Jahan', 'sara@northfield.edu', 'Content manager', 'Active'],
    ['TN', 'Tanvir Noor', 'tanvir@northfield.edu', 'Analyst', 'Pending'],
  ])

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('EDITOR')
  const [isInviting, setIsInviting] = useState(false)

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      notify('Please enter an email address.')
      return
    }
    setIsInviting(true)
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      await api.schools.addMember({ email: inviteEmail.trim(), role: inviteRole }, activeId)
      notify(`Invitation sent to ${inviteEmail.trim()}`)
      setInviteEmail('')
      setInviteModalOpen(false)
      const res = await api.schools.getMembers()
      const data = (res as any)?.data || res
      if (Array.isArray(data)) {
        setUsers(
          data.map((m: any) => {
            const first = m.user?.firstName || ''
            const last = m.user?.lastName || ''
            const name = `${first} ${last}`.trim() || m.user?.username || 'Team Member'
            const initials = `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'TM'
            const roleFormatted = m.role ? m.role.charAt(0) + m.role.slice(1).toLowerCase() : 'Member'
            const statusFormatted = m.user?.status === 'ACTIVE' ? 'Active' : 'Pending'
            return [initials, name, m.user?.email || '', roleFormatted, statusFormatted]
          })
        )
      }
    } catch (err: any) {
      notify(`Invite failed: ${err?.message || 'User must be registered first'}`)
    } finally {
      setIsInviting(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const loadMembers = async () => {
      try {
        const res = await api.schools.getMembers()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((m: any) => {
            const first = m.user?.firstName || ''
            const last = m.user?.lastName || ''
            const name = `${first} ${last}`.trim() || m.user?.username || 'Team Member'
            const initials = `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'TM'
            const roleFormatted = m.role ? m.role.charAt(0) + m.role.slice(1).toLowerCase() : 'Member'
            const statusFormatted = m.user?.status === 'ACTIVE' ? 'Active' : 'Pending'
            return [initials, name, m.user?.email || '', roleFormatted, statusFormatted] as [string, string, string, string, string]
          })
          setUsers(mapped)
        }
      } catch (err: any) {
        console.warn('[Settings] Team members sync:', err?.message || 'pending authentication')
      }
    }
    loadMembers()
    return () => { mounted = false }
  }, [currentSchool?.id, schoolSwitchKey])

  return {
    users,
    setUsers,
    inviteModalOpen,
    setInviteModalOpen,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    isInviting,
    handleSendInvite,
  }
}
