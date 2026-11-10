'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface SchoolProfileTabProps {
  schoolLogo: string | null
  schoolName: string
  setSchoolName: (val: string) => void
  schoolType: string
  setSchoolType: (val: string) => void
  timezone: string
  setTimezone: (val: string) => void
  language: string
  setLanguage: (val: string) => void
  dateFormat: string
  setDateFormat: (val: string) => void
  academicYearStart: string
  setAcademicYearStart: (val: string) => void
  onReplaceLogoClick: () => void
  onSaveProfile: () => Promise<void> | void
  isSavingProfile: boolean
}

export function SchoolProfileTab({
  schoolLogo,
  schoolName,
  setSchoolName,
  schoolType,
  setSchoolType,
  timezone,
  setTimezone,
  language,
  setLanguage,
  dateFormat,
  setDateFormat,
  academicYearStart,
  setAcademicYearStart,
  onReplaceLogoClick,
  onSaveProfile,
  isSavingProfile,
}: SchoolProfileTabProps) {
  return (
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
          <button type="button" onClick={onReplaceLogoClick}>
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
        onSave={onSaveProfile}
        isSaving={isSavingProfile}
      />
    </div>
  )
}
