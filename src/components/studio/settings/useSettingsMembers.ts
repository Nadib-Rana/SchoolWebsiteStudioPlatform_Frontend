'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'

export interface MemberRow {
  membershipId: string
  userId: string
  initials: string
  name: string
  email: string
  role: string
  status: string
  isCurrentUser: boolean
}

export function useSettingsMembers(
  currentSchool: any,
  schoolSwitchKey: string | number,
  notify: (msg: string) => void
) {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [users, setUsers] = useState<Array<[string, string, string, string, string, string]>>([])
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('EDITOR')
  const [isInviting, setIsInviting] = useState(false)

  const loadMembers = useCallback(async () => {
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const res = await api.schools.getMembers(activeId)
      const data = (res as any)?.data || res
      if (Array.isArray(data)) {
        const mappedMembers: MemberRow[] = data.map((m: any) => {
          const first = m.user?.firstName || ''
          const last = m.user?.lastName || ''
          const name = `${first} ${last}`.trim() || m.user?.username || 'Team Member'
          const initials = `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'TM'
          const role = m.role || 'EDITOR'
          const status = m.user?.status === 'ACTIVE' ? 'Active' : 'Pending'
          return {
            membershipId: m.id,
            userId: m.user?.id || m.userId,
            initials,
            name,
            email: m.user?.email || '',
            role,
            status,
            isCurrentUser: false,
          }
        })
        setMembers(mappedMembers)
        setUsers(
          mappedMembers.map((m) => [
            m.initials,
            m.name,
            m.email,
            m.role,
            m.status,
            m.membershipId,
          ])
        )
      }
    } catch (err: any) {
      console.warn('[Settings] Team members sync error:', err?.message)
    }
  }, [currentSchool?.id])

  useEffect(() => {
    void loadMembers()
  }, [loadMembers, schoolSwitchKey])

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    const email = inviteEmail.trim().toLowerCase()
    if (!email) {
      notify('Please enter an email address.')
      return
    }
    setIsInviting(true)
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      await api.schools.addMember({ email, role: inviteRole }, activeId)
      notify(`Invitation sent to ${email}`)
      setInviteEmail('')
      setInviteModalOpen(false)
      await loadMembers()
    } catch (err: any) {
      notify(`Invite failed: ${err?.message || 'Error sending invite'}`)
    } finally {
      setIsInviting(false)
    }
  }

  const handleUpdateRole = async (membershipId: string, newRole: string) => {
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      await api.schools.updateMemberRole(membershipId, newRole, activeId)
      notify(`Member role updated to ${newRole}`)
      await loadMembers()
    } catch (err: any) {
      notify(`Failed to update role: ${err?.message || 'Error'}`)
    }
  }

  const handleRemoveMember = async (membershipId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from this school?`)) return
    try {
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      await api.schools.removeMember(membershipId, activeId)
      notify(`${name} removed from workspace.`)
      await loadMembers()
    } catch (err: any) {
      notify(`Failed to remove member: ${err?.message || 'Error'}`)
    }
  }

  return {
    members,
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
    handleUpdateRole,
    handleRemoveMember,
    refreshMembers: loadMembers,
  }
}
