'use client'

import type { SchoolSocialLinks } from '@/lib/social-links'
import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface SchoolProfileTabProps {
  schoolLogo: string | null
  schoolFavicon?: string | null
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
  onReplaceFaviconClick?: () => void
  socialLinks: SchoolSocialLinks
  setSocialLinks: React.Dispatch<React.SetStateAction<SchoolSocialLinks>>
  onSaveProfile: () => Promise<void> | void
  isSavingProfile: boolean
}

export function SchoolProfileTab({
  schoolLogo,
  schoolFavicon,
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
  onReplaceFaviconClick,
  socialLinks,
  setSocialLinks,
  onSaveProfile,
  isSavingProfile,
}: SchoolProfileTabProps) {
  return (
    <div className="card settings-form">
      <SettingsTitle
        title="School profile"
        description="Manage your organization details and regional preferences."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
        <div className="logo-upload" style={{ margin: 0 }}>
          {schoolLogo ? (
            <img src={schoolLogo} alt="School Logo" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{schoolName ? schoolName.slice(0, 2).toUpperCase() : 'SC'}</div>
          )}
          <span>
            <strong>Workspace logo</strong>
            <small>Used in Studio and account emails</small>
            <button type="button" onClick={onReplaceLogoClick}>Replace logo</button>
          </span>
        </div>

        <div className="logo-upload" style={{ margin: 0, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#fff', border: '1px solid #cbd5e1', display: 'grid', placeItems: 'center' }}>
            {schoolFavicon || schoolLogo ? (
              <img src={schoolFavicon || schoolLogo!} alt="Favicon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb' }}>{(schoolName || 'S').charAt(0)}</span>
            )}
          </div>
          <span>
            <strong>Website Favicon</strong>
            <small style={{ fontSize: '11px', color: '#64748b' }}>Appears in browser tab & bookmarks</small>
            <button type="button" onClick={onReplaceFaviconClick} style={{ color: '#2563eb', fontWeight: 600 }}>
              {schoolFavicon ? 'Replace favicon' : 'Upload favicon'}
            </button>
          </span>
        </div>
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

      <div
        style={{
          marginTop: '22px',
          paddingTop: '18px',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
          ERP Login &amp; Public Social Profile Links
        </strong>
        <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
          Add your ERP portal link and official social links to display in the public website Footer and Header. Leave blank to hide.
        </span>

        <div className="form-grid">
          <label>
            ERP Login Portal URL
            <input
              type="url"
              value={socialLinks.erpLoginUrl || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, erpLoginUrl: e.target.value }))
              }
              placeholder="https://erp.yourschool.com/login"
            />
          </label>
          <label>
            ERP Button Label
            <input
              value={socialLinks.erpLoginLabel || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, erpLoginLabel: e.target.value }))
              }
              placeholder="ERP Login"
            />
          </label>
          <label>
            Facebook Page URL
            <input
              type="url"
              value={socialLinks.facebook || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, facebook: e.target.value }))
              }
              placeholder="https://facebook.com/yourschool"
            />
          </label>
          <label>
            YouTube Channel URL
            <input
              type="url"
              value={socialLinks.youtube || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, youtube: e.target.value }))
              }
              placeholder="https://youtube.com/@yourschool"
            />
          </label>
          <label>
            Instagram URL
            <input
              type="url"
              value={socialLinks.instagram || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }))
              }
              placeholder="https://instagram.com/yourschool"
            />
          </label>
          <label>
            LinkedIn URL
            <input
              type="url"
              value={socialLinks.linkedin || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/school/yourschool"
            />
          </label>
          <label>
            X (Twitter) URL
            <input
              type="url"
              value={socialLinks.twitter || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, twitter: e.target.value }))
              }
              placeholder="https://x.com/yourschool"
            />
          </label>
          <label>
            Official Website / Portal URL
            <input
              type="url"
              value={socialLinks.website || ''}
              onChange={(e) =>
                setSocialLinks((prev) => ({ ...prev, website: e.target.value }))
              }
              placeholder="https://www.yourschool.edu.bd"
            />
          </label>
        </div>
      </div>

      <SettingsSave
        text="Changes apply across the workspace & public footer"
        onSave={onSaveProfile}
        isSaving={isSavingProfile}
      />
    </div>
  )
}
