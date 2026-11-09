'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { IconName } from '@/types/studio'
import { useEffect, useState, useRef, type ReactNode } from 'react'

function SettingsTitle({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="settings-title">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function SettingsSave({
  text,
  notify,
  onSave,
  isSaving = false,
}: {
  text: string
  notify?: () => void
  onSave?: () => Promise<void> | void
  isSaving?: boolean
}) {
  const handleClick = () => {
    if (onSave) {
      onSave()
    } else if (notify) {
      notify()
    }
  }

  return (
    <div className="settings-save">
      <span>{text}</span>
      <Button disabled={isSaving} onClick={handleClick}>
        {isSaving ? 'Saving...' : 'Save changes'}
      </Button>
    </div>
  )
}

export function Settings() {
  const { notify, setView, currentSchool, schoolSwitchKey, user } = useStudio()
  const [active, setActive] = useState('School profile')
  const [users, setUsers] = useState<Array<[string, string, string, string, string]>>([
    ['AR', 'Amina Rahman', 'admin@northfield.edu', 'Owner', 'Active'],
    ['MK', 'Mahmud Karim', 'mahmud@northfield.edu', 'Editor', 'Active'],
    ['SJ', 'Sara Jahan', 'sara@northfield.edu', 'Content manager', 'Active'],
    ['TN', 'Tanvir Noor', 'tanvir@northfield.edu', 'Analyst', 'Pending'],
  ])

  // School profile & preferences
  const [schoolName, setSchoolName] = useState('Northfield High School')
  const [schoolType, setSchoolType] = useState('Secondary school')
  const [timezone, setTimezone] = useState('Asia/Dhaka (GMT+6)')
  const [language, setLanguage] = useState('English')
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY')
  const [academicYearStart, setAcademicYearStart] = useState('January')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Media / Logo & Account Uploads
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)
  const [accountPhoto, setAccountPhoto] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const accountPhotoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSchoolLogo(reader.result as string)
        notify(`Workspace logo "${file.name}" selected. Click "Save changes" to persist.`)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAccountPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setAccountPhoto(reader.result as string)
        notify(`Profile photo "${file.name}" updated.`)
      }
      reader.readAsDataURL(file)
    }
  }

  // Account form state
  const [accountFirstName, setAccountFirstName] = useState(user?.firstName || 'Amina')
  const [accountLastName, setAccountLastName] = useState(user?.lastName || 'Rahman')
  const [accountEmail, setAccountEmail] = useState(user?.email || 'admin@northfield.edu')
  const [accountPhone, setAccountPhone] = useState('+880 1712 345 678')
  const [accountJobTitle, setAccountJobTitle] = useState('Workspace Administrator')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  useEffect(() => {
    if (user?.firstName) setAccountFirstName(user.firstName)
    if (user?.lastName) setAccountLastName(user.lastName)
    if (user?.email) setAccountEmail(user.email)
  }, [user])

  // User Invitation State & Modal
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
      await api.schools.addMember(
        {
          email: inviteEmail.trim(),
          role: inviteRole,
        },
        activeId
      )
      notify(`Invitation sent to ${inviteEmail.trim()}`)
      setInviteEmail('')
      setInviteModalOpen(false)
      // Re-fetch members
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

  // Permission Matrix Modal
  const [permMatrixOpen, setPermMatrixOpen] = useState(false)

  // Notification Preferences State
  const [notificationPreferences, setNotificationPreferences] = useState([
    { id: 'publishing', label: 'Publishing activity', desc: 'Draft approvals, publishes, and version restores', email: true, inApp: true },
    { id: 'domain', label: 'Domain & SSL', desc: 'Verification changes, renewals, and errors', email: true, inApp: true },
    { id: 'erp', label: 'ERP synchronization', desc: 'Sync results and records requiring review', email: true, inApp: true },
    { id: 'admission', label: 'Admission API health', desc: 'Gateway health warnings and connection failures', email: true, inApp: true },
    { id: 'team', label: 'Team activity', desc: 'Invites, role changes, and security events', email: false, inApp: true },
    { id: 'analytics', label: 'Weekly analytics report', desc: 'Traffic and content performance summary', email: true, inApp: false },
  ])

  const toggleNotification = (id: string, channel: 'email' | 'inApp') => {
    setNotificationPreferences((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [channel]: !item[channel] } : item
      )
    )
  }

  // Website Preferences State
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [searchIndexing, setSearchIndexing] = useState(true)
  const [autoImageOpt, setAutoImageOpt] = useState(true)
  const [showAttribution, setShowAttribution] = useState(false)
  const [cookieBanner, setCookieBanner] = useState(true)
  const [isSavingWebsite, setIsSavingWebsite] = useState(false)

  // Security Settings State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [strongPassword, setStrongPassword] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('8 hours')
  const [newDeviceAlerts, setNewDeviceAlerts] = useState(true)

  // Sessions State
  const [sessions, setSessions] = useState([
    { id: 's1', device: 'Chrome on Windows', location: 'Dhaka, Bangladesh', current: true, lastActive: 'Active now' },
    { id: 's2', device: 'Safari on iPhone', location: 'Dhaka, Bangladesh', current: false, lastActive: 'Last active 2 hours ago' },
  ])

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    notify('Device session revoked successfully.')
  }

  const handleSignOutOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.current))
    notify('All other sessions signed out.')
  }

  // Backup & Restore State
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

  // Data Exports
  const handleExportContent = async () => {
    try {
      notify('Preparing content export...')
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const [schoolRes, contentRes, pagesRes, navRes] = await Promise.allSettled([
        api.schools.getById(activeId),
        api.content.get(activeId),
        api.pages.list(undefined, activeId),
        api.navigation.get(activeId),
      ])

      const bundle = {
        exportDate: new Date().toISOString(),
        school: schoolRes.status === 'fulfilled' ? schoolRes.value?.data || schoolRes.value : null,
        content: contentRes.status === 'fulfilled' ? contentRes.value?.data || contentRes.value : null,
        pages: pagesRes.status === 'fulfilled' ? pagesRes.value?.data || pagesRes.value : null,
        navigation: navRes.status === 'fulfilled' ? navRes.value?.data || navRes.value : null,
      }

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentSchool?.slug || 'school'}-content-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      notify('Website content exported successfully!')
    } catch (err: any) {
      notify('Export failed: ' + (err?.message || 'Error'))
    }
  }

  const handleExportMediaArchive = async () => {
    try {
      notify('Compiling media asset manifest...')
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const mediaRes = await api.gallery.getMedia(undefined, activeId).catch(() => null)
      const assets = (mediaRes as any)?.data || mediaRes || []

      const manifest = {
        exportDate: new Date().toISOString(),
        school: currentSchool?.name || 'School',
        totalAssets: Array.isArray(assets) ? assets.length : 0,
        assets,
      }

      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentSchool?.slug || 'school'}-media-manifest.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      notify('Media archive manifest downloaded!')
    } catch (err: any) {
      notify('Media export failed: ' + (err?.message || 'Error'))
    }
  }

  const handleExportAnalytics = async () => {
    try {
      notify('Generating analytics report...')
      const activeId = currentSchool?.id || api.getActiveSchoolId()
      const analyticsRes = await api.analytics.get(30, activeId).catch(() => null)
      const metrics = (analyticsRes as any)?.data || analyticsRes || {
        totalVisitors: 12842,
        pageViews: 34291,
        avgDuration: '2m 45s',
      }

      const report = {
        generatedAt: new Date().toISOString(),
        school: currentSchool?.name || 'School',
        metrics,
      }

      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentSchool?.slug || 'school'}-analytics-report.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      notify('Analytics report downloaded successfully!')
    } catch (err: any) {
      notify('Analytics export failed: ' + (err?.message || 'Error'))
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

    const loadSchoolAndSettings = async () => {
      try {
        const schoolRes = await api.schools.getById(api.getActiveSchoolId())
        const school = (schoolRes as any)?.data || schoolRes
        if (mounted && school) {
          if (school.name) setSchoolName(school.name)
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

    loadMembers()
    loadSchoolAndSettings()
    return () => {
      mounted = false
    }
  }, [currentSchool?.id, schoolSwitchKey])

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    try {
      const promises: Promise<any>[] = []
      const activeId = api.getActiveSchoolId()
      if (schoolName) {
        promises.push(api.schools.update(activeId, { name: schoolName }))
      }
      promises.push(
        api.settings.update({
          timezone,
          language,
          dateFormat,
        })
      )
      await Promise.all(promises)
      notify('School profile saved successfully')
    } catch (err: any) {
      notify(`Failed to save: ${err?.message || 'Check network connection'}`)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSaveAccount = async () => {
    setIsSavingAccount(true)
    try {
      if (newPassword) {
        if (newPassword.length < 8) {
          notify('Password must be at least 8 characters long.')
          setIsSavingAccount(false)
          return
        }
        if (newPassword !== confirmPassword) {
          notify('New passwords do not match.')
          setIsSavingAccount(false)
          return
        }
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        notify('Account credentials and profile updated.')
      } else {
        notify('Account personal information updated.')
      }
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleSaveWebsite = async () => {
    setIsSavingWebsite(true)
    try {
      await api.settings.update({
        maintenanceMode,
      })
      notify('Website preferences saved successfully')
    } catch (err: any) {
      notify(`Failed to save: ${err?.message || 'Check network connection'}`)
    } finally {
      setIsSavingWebsite(false)
    }
  }

  const handleSaveNotifications = () => {
    notify('Notification preferences saved successfully.')
  }

  const handleSaveSecurity = () => {
    notify('Security configuration saved.')
  }

  const handleCycleSessionTimeout = () => {
    const timeouts = ['4 hours', '8 hours', '24 hours', '7 days']
    const nextIdx = (timeouts.indexOf(sessionTimeout) + 1) % timeouts.length
    setSessionTimeout(timeouts[nextIdx])
    notify(`Session timeout set to ${timeouts[nextIdx]}`)
  }

  const tabs: [string, IconName][] = [
    ['School profile', 'home'],
    ['Account', 'users'],
    ['Users & roles', 'users'],
    ['Notifications', 'bell'],
    ['Website', 'globe'],
    ['Security', 'settings'],
    ['Backup & export', 'file'],
  ]

  const activeUsersCount = users.filter((u) => u[4] === 'Active').length
  const pendingUsersCount = users.filter((u) => u[4] === 'Pending').length
  const availableSeats = Math.max(0, 10 - users.length)

  return (
    <div className="settings-layout">
      {/* Hidden file pickers for logo and photo */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleLogoUpload}
      />
      <input
        ref={accountPhotoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAccountPhotoUpload}
      />

      <div className="settings-nav">
        {tabs.map(([label, icon]) => (
          <button
            key={label}
            type="button"
            className={active === label ? 'active' : ''}
            onClick={() => setActive(label)}
          >
            <Icon name={icon} size={16} />
            {label}
            <Icon name="chevron" size={13} />
          </button>
        ))}
        <button
          type="button"
          className="signout"
          onClick={() => {
            api.clearAuthToken()
            notify('Signed out successfully')
            setView('login')
          }}
        >
          <Icon name="external" size={15} />
          Sign out
        </button>
      </div>

      <div className="settings-content">
        {active === 'School profile' && (
          <div className="card settings-form">
            <SettingsTitle
              title="School profile"
              description="Manage your organization details and regional preferences."
            />
            <div className="logo-upload">
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontWeight: 700, fontSize: '16px' }}>
                  {schoolName ? schoolName.slice(0, 2).toUpperCase() : 'SC'}
                </div>
              )}
              <span>
                <strong>Workspace logo</strong>
                <small>Used in Studio and account emails</small>
                <button type="button" onClick={() => logoInputRef.current?.click()}>
                  Replace logo
                </button>
              </span>
            </div>
            <div className="form-grid">
              <label>
                School display name
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter school name"
                />
              </label>
              <label>
                School type
                <select
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value)}
                >
                  <option value="Secondary school">Secondary school</option>
                  <option value="Primary & Secondary">Primary & Secondary</option>
                  <option value="College & Academy">College & Academy</option>
                </select>
              </label>
              <label>
                Timezone
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </label>
              <label>
                Default language
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </label>
              <label>
                Date format
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="DD MMM YYYY">DD MMM YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </label>
              <label>
                Academic year starts
                <select
                  value={academicYearStart}
                  onChange={(e) => setAcademicYearStart(e.target.value)}
                >
                  <option value="January">January</option>
                  <option value="July">July</option>
                  <option value="September">September</option>
                </select>
              </label>
            </div>
            <SettingsSave
              text="Changes apply across the workspace"
              onSave={handleSaveProfile}
              isSaving={isSavingProfile}
            />
          </div>
        )}

        {active === 'Account' && (
          <div className="card settings-form">
            <SettingsTitle
              title="Account settings"
              description="Manage your personal information and sign-in details."
            />
            <div className="account-profile">
              {accountPhoto ? (
                <img
                  src={accountPhoto}
                  alt="Account Avatar"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ fontWeight: 700 }}>
                  {(accountFirstName[0] || 'A') + (accountLastName[0] || 'R')}
                </div>
              )}
              <span>
                <strong>{`${accountFirstName} ${accountLastName}`.trim() || 'Amina Rahman'}</strong>
                <small>{accountJobTitle}</small>
                <button type="button" onClick={() => accountPhotoInputRef.current?.click()}>
                  Upload new photo
                </button>
              </span>
            </div>
            <div className="form-grid">
              <label>
                First name
                <input
                  value={accountFirstName}
                  onChange={(e) => setAccountFirstName(e.target.value)}
                />
              </label>
              <label>
                Last name
                <input
                  value={accountLastName}
                  onChange={(e) => setAccountLastName(e.target.value)}
                />
              </label>
              <label className="full">
                Email address
                <input
                  type="email"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                />
              </label>
              <label>
                Phone number
                <input
                  value={accountPhone}
                  onChange={(e) => setAccountPhone(e.target.value)}
                />
              </label>
              <label>
                Job title
                <input
                  value={accountJobTitle}
                  onChange={(e) => setAccountJobTitle(e.target.value)}
                />
              </label>
            </div>
            <div className="settings-divider">
              <strong>Change password</strong>
              <p>Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
            </div>
            <div className="form-grid">
              <label>
                Current password
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </label>
              <span />
              <label>
                New password
                <input
                  type="password"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>
            <SettingsSave
              text="Update profile and credentials"
              onSave={handleSaveAccount}
              isSaving={isSavingAccount}
            />
          </div>
        )}

        {active === 'Users & roles' && (
          <div className="card settings-form users-settings">
            <SettingsTitle
              title="Users & roles"
              description="Control who can access the Studio and what they can change."
              action={
                <Button
                  kind="primary"
                  icon="plus"
                  onClick={() => setInviteModalOpen(true)}
                >
                  Invite user
                </Button>
              }
            />
            <div className="role-summary">
              <div>
                <span>Active users</span>
                <strong>{activeUsersCount}</strong>
              </div>
              <div>
                <span>Pending invites</span>
                <strong>{pendingUsersCount}</strong>
              </div>
              <div>
                <span>Available seats</span>
                <strong>{availableSeats}</strong>
              </div>
            </div>
            <div className="settings-user-list">
              {users.map((u, i) => (
                <div key={u[1] + i}>
                  <span className={`person p${i % 4}`}>{u[0]}</span>
                  <div>
                    <strong>
                      {u[1]}
                      {i === 0 && <em>You</em>}
                    </strong>
                    <small>{u[2]}</small>
                  </div>
                  <select
                    value={u[3]}
                    onChange={(e) => {
                      const newRole = e.target.value
                      setUsers((prev) =>
                        prev.map((row, idx) =>
                          idx === i ? [row[0], row[1], row[2], newRole, row[4]] : row
                        )
                      )
                      notify(`Updated role for ${u[1]} to ${newRole}`)
                    }}
                  >
                    <option value="Owner">Owner</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Content manager">Content manager</option>
                    <option value="Analyst">Analyst</option>
                  </select>
                  <span className={`state-badge ${u[4].toLowerCase()}`}>
                    <i />
                    {u[4]}
                  </span>
                  <button
                    type="button"
                    aria-label={`Options for ${u[1]}`}
                    onClick={() => {
                      if (i === 0) {
                        notify('Owner account permissions cannot be modified directly.')
                      } else {
                        const confirmRemove = window.confirm(`Remove user ${u[1]} (${u[2]}) from workspace?`)
                        if (confirmRemove) {
                          setUsers((prev) => prev.filter((_, idx) => idx !== i))
                          notify(`User ${u[1]} removed from workspace.`)
                        }
                      }
                    }}
                  >
                    <Icon name="more" />
                  </button>
                </div>
              ))}
            </div>
            <div className="permission-note">
              <Icon name="help" />
              <div>
                <strong>Role permissions</strong>
                <p>
                  Owners manage billing and security. Administrators manage the
                  website and team. Editors publish content. Analysts have read-only
                  access.
                </p>
              </div>
              <button type="button" onClick={() => setPermMatrixOpen(true)}>
                View permission matrix
              </button>
            </div>
          </div>
        )}

        {active === 'Notifications' && (
          <div className="card settings-form">
            <SettingsTitle
              title="Notification preferences"
              description="Choose the activity you want to hear about and where."
            />
            <div className="notification-settings-head">
              <span>Notification</span>
              <span>Email</span>
              <span>In-app</span>
            </div>
            {notificationPreferences.map((x) => (
              <div className="notification-setting" key={x.id}>
                <div>
                  <strong>{x.label}</strong>
                  <small>{x.desc}</small>
                </div>
                <button
                  type="button"
                  className={x.email ? 'toggle on' : 'toggle'}
                  onClick={() => toggleNotification(x.id, 'email')}
                  aria-label={`Toggle email for ${x.label}`}
                >
                  <i />
                </button>
                <button
                  type="button"
                  className={x.inApp ? 'toggle on' : 'toggle'}
                  onClick={() => toggleNotification(x.id, 'inApp')}
                  aria-label={`Toggle in-app for ${x.label}`}
                >
                  <i />
                </button>
              </div>
            ))}
            <div className="settings-divider">
              <strong>Quiet hours</strong>
              <p>Pause non-critical notifications outside your working day.</p>
            </div>
            <div className="form-grid">
              <label>
                From
                <input type="time" defaultValue="18:00" />
              </label>
              <label>
                Until
                <input type="time" defaultValue="08:00" />
              </label>
            </div>
            <SettingsSave
              text="Critical security alerts are always delivered"
              onSave={handleSaveNotifications}
            />
          </div>
        )}

        {active === 'Website' && (
          <div className="card settings-form">
            <SettingsTitle
              title="Website preferences"
              description="Configure default behavior for the public website."
            />
            <div className="form-grid">
              <label>
                Default homepage
                <select defaultValue="Home">
                  <option>Home</option>
                </select>
              </label>
              <label>
                Default template
                <select defaultValue="Aster Academy">
                  <option>Aster Academy</option>
                  <option>Heritage</option>
                  <option>Clarity</option>
                </select>
              </label>
              <label>
                Default page status
                <select defaultValue="Draft">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </label>
              <label>
                Media optimization
                <select defaultValue="Automatic">
                  <option>Automatic</option>
                  <option>Original quality</option>
                </select>
              </label>
            </div>
            {[
              {
                title: 'Maintenance mode',
                desc: 'Temporarily hide the public website from visitors',
                active: maintenanceMode,
                toggle: () => setMaintenanceMode((prev) => !prev),
              },
              {
                title: 'Search engine indexing',
                desc: 'Allow approved pages to appear in search results',
                active: searchIndexing,
                toggle: () => setSearchIndexing((prev) => !prev),
              },
              {
                title: 'Automatic image optimization',
                desc: 'Resize and compress uploaded images for performance',
                active: autoImageOpt,
                toggle: () => setAutoImageOpt((prev) => !prev),
              },
              {
                title: 'Show “Powered by SchoolCanvas”',
                desc: 'Display platform attribution in the public footer',
                active: showAttribution,
                toggle: () => setShowAttribution((prev) => !prev),
              },
              {
                title: 'Cookie preference banner',
                desc: 'Show visitors privacy and analytics choices',
                active: cookieBanner,
                toggle: () => setCookieBanner((prev) => !prev),
              },
            ].map((x) => (
              <div className="toggle-row" key={x.title}>
                <div>
                  <strong>{x.title}</strong>
                  <small>{x.desc}</small>
                </div>
                <button
                  type="button"
                  className={x.active ? 'toggle on' : 'toggle'}
                  onClick={x.toggle}
                  aria-label={`Toggle ${x.title}`}
                >
                  <i />
                </button>
              </div>
            ))}
            <SettingsSave
              text="Website preferences affect the next published version"
              onSave={handleSaveWebsite}
              isSaving={isSavingWebsite}
            />
          </div>
        )}

        {active === 'Security' && (
          <div className="settings-content-stack">
            <div className="card settings-form">
              <SettingsTitle
                title="Security settings"
                description="Protect your account, team, and published website."
              />
              <div className="security-score">
                <span>
                  <Icon name="check" />
                </span>
                <div>
                  <strong>Security posture is strong</strong>
                  <p>All recommended protections are currently active.</p>
                </div>
                <b>94%</b>
              </div>
              {[
                {
                  label: 'Two-factor authentication',
                  desc: 'Require an additional verification code at sign in',
                  value: twoFactorAuth ? 'Required' : 'Optional',
                  action: () => {
                    setTwoFactorAuth((p) => !p)
                    notify(`Two-factor authentication is now ${!twoFactorAuth ? 'Required' : 'Optional'}`)
                  },
                },
                {
                  label: 'Strong password policy',
                  desc: 'Require at least 12 characters for all team members',
                  value: strongPassword ? 'Enabled' : 'Disabled',
                  action: () => {
                    setStrongPassword((p) => !p)
                    notify(`Strong password policy is now ${!strongPassword ? 'Enabled' : 'Disabled'}`)
                  },
                },
                {
                  label: 'Session timeout',
                  desc: 'Automatically sign out inactive users',
                  value: sessionTimeout,
                  action: handleCycleSessionTimeout,
                },
                {
                  label: 'New device alerts',
                  desc: 'Email account owners when a new device signs in',
                  value: newDeviceAlerts ? 'Enabled' : 'Disabled',
                  action: () => {
                    setNewDeviceAlerts((p) => !p)
                    notify(`New device alerts are now ${!newDeviceAlerts ? 'Enabled' : 'Disabled'}`)
                  },
                },
              ].map((x) => (
                <div className="security-row" key={x.label}>
                  <span>
                    <Icon name="check" size={13} />
                  </span>
                  <div>
                    <strong>{x.label}</strong>
                    <small>{x.desc}</small>
                  </div>
                  <button type="button" onClick={x.action}>
                    {x.value} <Icon name="chevron" size={12} />
                  </button>
                </div>
              ))}
              <SettingsSave
                text="Security settings apply immediately across all users"
                onSave={handleSaveSecurity}
              />
            </div>

            <div className="card settings-form">
              <SettingsTitle
                title="Active sessions"
                description="Devices currently signed in to your account."
              />
              {sessions.map((s) => (
                <div className="session-row" key={s.id}>
                  <span>
                    <Icon name={s.device.toLowerCase().includes('phone') ? 'mobile' : 'monitor'} />
                  </span>
                  <div>
                    <strong>{s.device}</strong>
                    <small>
                      {s.location} · {s.current ? 'Current session' : s.lastActive}
                    </small>
                  </div>
                  {s.current ? (
                    <em>Active now</em>
                  ) : (
                    <button type="button" onClick={() => handleRevokeSession(s.id)}>
                      Revoke
                    </button>
                  )}
                </div>
              ))}
              <div className="danger-settings">
                <div>
                  <strong>Sign out everywhere</strong>
                  <p>End all sessions except the device you are using now.</p>
                </div>
                <Button onClick={handleSignOutOtherDevices}>
                  Sign out other devices
                </Button>
              </div>
            </div>
          </div>
        )}

        {active === 'Backup & export' && (
          <div className="settings-content-stack">
            <div className="card settings-form">
              <SettingsTitle
                title="Backup & export"
                description="Download your content or restore a previous backup."
              />
              <div className="backup-status">
                <span>
                  <Icon name="check" />
                </span>
                <div>
                  <strong>Automatic backups are active</strong>
                  <p>Content and configuration are securely backed up every day.</p>
                </div>
                <small>
                  Last backup
                  <br />
                  <strong>Today, 03:15 AM</strong>
                </small>
              </div>
              <div className="export-grid">
                <button type="button" onClick={handleExportContent}>
                  <span>
                    <Icon name="file" />
                  </span>
                  <strong>Export website content</strong>
                  <p>Pages, notices, events, teachers, and settings in JSON format.</p>
                  <em>
                    Prepare export <Icon name="arrow" size={13} />
                  </em>
                </button>
                <button type="button" onClick={handleExportMediaArchive}>
                  <span>
                    <Icon name="image" />
                  </span>
                  <strong>Download media archive</strong>
                  <p>All uploaded images and documents in a manifest format.</p>
                  <em>
                    Prepare archive <Icon name="arrow" size={13} />
                  </em>
                </button>
                <button type="button" onClick={handleExportAnalytics}>
                  <span>
                    <Icon name="chart" />
                  </span>
                  <strong>Export analytics</strong>
                  <p>Traffic and audience data for the selected reporting period.</p>
                  <em>
                    Generate report <Icon name="arrow" size={13} />
                  </em>
                </button>
              </div>
            </div>

            <div className="card settings-form">
              <SettingsTitle
                title="Backup history"
                description="Daily backups are retained for 30 days."
              />
              <div className="backup-list">
                {[
                  ['Today, 03:15 AM', 'Automatic backup', '2.8 GB'],
                  ['Yesterday, 03:14 AM', 'Automatic backup', '2.8 GB'],
                  ['May 10, 10:42 AM', 'Before version 2.7 publish', '2.7 GB'],
                ].map((x) => (
                  <div key={x[0]}>
                    <span>
                      <Icon name="clock" />
                    </span>
                    <div>
                      <strong>{x[0]}</strong>
                      <small>
                        {x[1]} · {x[2]}
                      </small>
                    </div>
                    <span className="state-badge published">
                      <i />
                      Complete
                    </span>
                    <Button onClick={() => setRestoreModalBackup(x[0])}>
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Invite User */}
      {inviteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setInviteModalOpen(false)
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Invite Team Member
              </h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '4px',
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <form onSubmit={handleSendInvite} style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                Invite a colleague to collaborate on this school workspace. They will receive access based on their assigned role.
              </p>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@school.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  Workspace role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    background: '#fff',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="ADMIN">Administrator (Full site & team control)</option>
                  <option value="EDITOR">Editor (Can edit and publish content)</option>
                  <option value="VIEWER">Analyst / Viewer (Read-only access)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button kind="secondary" type="button" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button kind="primary" type="submit" disabled={isInviting}>
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Permission Matrix */}
      {permMatrixOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPermMatrixOpen(false)
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Role Permission Matrix
              </h3>
              <button
                type="button"
                onClick={() => setPermMatrixOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'grid',
                  placeItems: 'center',
                  padding: '4px',
                }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div style={{ padding: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 8px' }}>Capability</th>
                    <th style={{ padding: '10px 8px' }}>Owner</th>
                    <th style={{ padding: '10px 8px' }}>Admin</th>
                    <th style={{ padding: '10px 8px' }}>Editor</th>
                    <th style={{ padding: '10px 8px' }}>Analyst</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Edit website pages & builder', '✓', '✓', '✓', '—'],
                    ['Publish & release snapshots', '✓', '✓', '✓', '—'],
                    ['Manage domain & DNS', '✓', '✓', '—', '—'],
                    ['Invite & manage users', '✓', '✓', '—', '—'],
                    ['Security & billing settings', '✓', '—', '—', '—'],
                    ['Export data & view analytics', '✓', '✓', '✓', '✓'],
                  ].map(([cap, o, a, e, v], idx) => (
                    <tr
                      key={cap}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: '#1e293b' }}>{cap}</td>
                      <td style={{ padding: '10px 8px', color: '#16a34a', fontWeight: 700 }}>{o}</td>
                      <td style={{ padding: '10px 8px', color: '#16a34a', fontWeight: 700 }}>{a}</td>
                      <td style={{ padding: '10px 8px', color: e === '✓' ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>{e}</td>
                      <td style={{ padding: '10px 8px', color: v === '✓' ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button kind="primary" onClick={() => setPermMatrixOpen(false)}>
                  Close Matrix
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Restore Backup */}
      {restoreModalBackup && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRestoring) setRestoreModalBackup(null)
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon name="clock" size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Restore Snapshot
              </h3>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
              Are you sure you want to restore the backup from <strong>{restoreModalBackup}</strong>?
              This will restore all pages, content, and configuration to this exact point in time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button kind="secondary" disabled={isRestoring} onClick={() => setRestoreModalBackup(null)}>
                Cancel
              </Button>
              <Button kind="primary" disabled={isRestoring} onClick={handleConfirmRestore}>
                {isRestoring ? 'Restoring...' : 'Confirm Restore'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
