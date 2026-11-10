'use client'

import { useState, useEffect, useRef } from 'react'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { NotificationPref } from './NotificationsTab'
import { useSettingsExports } from './useSettingsExports'
import { useSettingsMembers } from './useSettingsMembers'
import { useSettingsSecurity } from './useSettingsSecurity'
import { useSettingsAccount } from './useSettingsAccount'

export function useSettingsState() {
  const { notify, setView, currentSchool, schoolSwitchKey, user } = useStudio()
  const [active, setActive] = useState('School profile')

  const members = useSettingsMembers(currentSchool, schoolSwitchKey, notify)
  const exportsData = useSettingsExports(currentSchool, notify)
  const security = useSettingsSecurity(notify)
  const account = useSettingsAccount(user, notify)

  const [schoolName, setSchoolName] = useState('Northfield High School')
  const [schoolType, setSchoolType] = useState('Secondary school')
  const [timezone, setTimezone] = useState('Asia/Dhaka (GMT+6)')
  const [language, setLanguage] = useState('English')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY')
  const [academicYearStart, setAcademicYearStart] = useState('January')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        notify(`Uploading workspace logo "${file.name}" to storage...`)
        const uploadRes = await api.storage.upload(file)
        setSchoolLogo(uploadRes.publicUrl)
        const activeId = api.getActiveSchoolId()
        await api.schools.update(activeId, { logoUrl: uploadRes.publicUrl })
        notify('Workspace logo updated and saved successfully!')
      } catch (err: any) {
        notify(`Logo upload failed: ${err?.message || 'Error'}`)
      }
    }
  }

  const [permMatrixOpen, setPermMatrixOpen] = useState(false)

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPref[]>([
    { id: 'publishing', label: 'Publishing activity', desc: 'Draft approvals, publishes, and version restores', email: true, inApp: true },
    { id: 'domain', label: 'Domain & SSL', desc: 'Verification changes, renewals, and errors', email: true, inApp: true },
    { id: 'erp', label: 'ERP synchronization', desc: 'Sync results and records requiring review', email: true, inApp: true },
    { id: 'admission', label: 'Admission API health', desc: 'Gateway health warnings and connection failures', email: true, inApp: true },
    { id: 'team', label: 'Team activity', desc: 'Invites, role changes, and security events', email: false, inApp: true },
    { id: 'analytics', label: 'Weekly analytics report', desc: 'Traffic and content performance summary', email: true, inApp: false },
  ])

  const toggleNotification = (id: string, channel: 'email' | 'inApp') => {
    setNotificationPreferences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [channel]: !item[channel] } : item))
    )
  }

  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [searchIndexing, setSearchIndexing] = useState(true)
  const [autoImageOpt, setAutoImageOpt] = useState(true)
  const [showAttribution, setShowAttribution] = useState(false)
  const [cookieBanner, setCookieBanner] = useState(true)
  const [isSavingWebsite, setIsSavingWebsite] = useState(false)

  const [restoreModalBackup, setRestoreModalBackup] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleConfirmRestore = async () => {
    if (!restoreModalBackup) return
    setIsRestoring(true)
    setTimeout(() => {
      setIsRestoring(false)
      notify(`System restored to backup: ${restoreModalBackup}`)
      setRestoreModalBackup(null)
    }, 700)
  }

  useEffect(() => {
    let mounted = true
    const loadSchoolAndSettings = async () => {
      try {
        const schoolRes = await api.schools.getById(api.getActiveSchoolId())
        const school = (schoolRes as any)?.data || schoolRes
        if (mounted && school) {
          if (school.name) setSchoolName(school.name)
          if (school.logoUrl) setSchoolLogo(school.logoUrl)
        }
      } catch (err: any) {
        console.warn('[Settings] School load warning:', err?.message)
      }

      try {
        const settingsRes = await api.settings.get()
        const settings = (settingsRes as any)?.data || settingsRes
        if (mounted && settings) {
          if (settings.timezone) setTimezone(settings.timezone)
          if (settings.language) setLanguage(settings.language)
          if (settings.dateFormat) setDateFormat(settings.dateFormat)
          if (typeof settings.maintenanceMode === 'boolean') {
            setMaintenanceMode(settings.maintenanceMode)
          }
        }
      } catch (err: any) {
        console.warn('[Settings] Settings load warning:', err?.message)
      }
    }

    loadSchoolAndSettings()
    return () => { mounted = false }
  }, [currentSchool?.id, schoolSwitchKey])

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    try {
      const promises: Promise<any>[] = []
      const activeId = api.getActiveSchoolId()
      if (schoolName) promises.push(api.schools.update(activeId, { name: schoolName }))
      promises.push(api.settings.update({ timezone, language, dateFormat }))
      await Promise.all(promises)
      notify('School profile saved successfully')
    } catch (err: any) {
      notify(`Failed to save: ${err?.message || 'Check network connection'}`)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveWebsite = async () => {
    setIsSavingWebsite(true)
    try {
      await api.settings.update({ maintenanceMode })
      notify('Website preferences saved successfully')
    } catch (err: any) {
      notify(`Failed to save: ${err?.message || 'Check network connection'}`)
    } finally {
      setIsSavingWebsite(false)
    }
  }

  return {
    notify, setView, active, setActive,
    users: members.users, setUsers: members.setUsers,
    inviteModalOpen: members.inviteModalOpen, setInviteModalOpen: members.setInviteModalOpen,
    inviteEmail: members.inviteEmail, setInviteEmail: members.setInviteEmail,
    inviteRole: members.inviteRole, setInviteRole: members.setInviteRole,
    isInviting: members.isInviting, handleSendInvite: members.handleSendInvite,
    schoolName, setSchoolName, schoolType, setSchoolType, timezone, setTimezone,
    language, setLanguage, dateFormat, setDateFormat, academicYearStart, setAcademicYearStart,
    isSavingProfile, schoolLogo, logoInputRef, handleLogoUpload,
    accountPhoto: account.accountPhoto, accountPhotoInputRef: account.accountPhotoInputRef,
    handleAccountPhotoUpload: account.handleAccountPhotoUpload,
    accountFirstName: account.accountFirstName, setAccountFirstName: account.setAccountFirstName,
    accountLastName: account.accountLastName, setAccountLastName: account.setAccountLastName,
    accountEmail: account.accountEmail, setAccountEmail: account.setAccountEmail,
    accountPhone: account.accountPhone, setAccountPhone: account.setAccountPhone,
    accountJobTitle: account.accountJobTitle, setAccountJobTitle: account.setAccountJobTitle,
    currentPassword: account.currentPassword, setCurrentPassword: account.setCurrentPassword,
    newPassword: account.newPassword, setNewPassword: account.setNewPassword,
    confirmPassword: account.confirmPassword, setConfirmPassword: account.setConfirmPassword,
    isSavingAccount: account.isSavingAccount, handleSaveAccount: account.handleSaveAccount,
    permMatrixOpen, setPermMatrixOpen, notificationPreferences, toggleNotification,
    maintenanceMode, setMaintenanceMode, searchIndexing, setSearchIndexing, autoImageOpt, setAutoImageOpt,
    showAttribution, setShowAttribution, cookieBanner, setCookieBanner, isSavingWebsite,
    twoFactorAuth: security.twoFactorAuth, setTwoFactorAuth: security.setTwoFactorAuth,
    strongPassword: security.strongPassword, setStrongPassword: security.setStrongPassword,
    sessionTimeout: security.sessionTimeout,
    newDeviceAlerts: security.newDeviceAlerts, setNewDeviceAlerts: security.setNewDeviceAlerts,
    sessions: security.sessions, handleRevokeSession: security.handleRevokeSession,
    handleSignOutOtherDevices: security.handleSignOutOtherDevices,
    restoreModalBackup, setRestoreModalBackup, isRestoring, handleConfirmRestore,
    handleExportContent: exportsData.handleExportContent,
    handleExportMediaArchive: exportsData.handleExportMediaArchive,
    handleExportAnalytics: exportsData.handleExportAnalytics,
    handleSaveProfile, handleSaveWebsite,
    handleCycleSessionTimeout: security.handleCycleSessionTimeout,
  }
}
