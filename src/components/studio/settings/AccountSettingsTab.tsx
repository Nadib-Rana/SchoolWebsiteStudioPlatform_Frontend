'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface AccountSettingsTabProps {
  accountPhoto: string | null
  accountFirstName: string
  setAccountFirstName: (val: string) => void
  accountLastName: string
  setAccountLastName: (val: string) => void
  accountEmail: string
  setAccountEmail: (val: string) => void
  accountPhone: string
  setAccountPhone: (val: string) => void
  accountJobTitle: string
  setAccountJobTitle: (val: string) => void
  currentPassword: string
  setCurrentPassword: (val: string) => void
  newPassword: string
  setNewPassword: (val: string) => void
  confirmPassword: string
  setConfirmPassword: (val: string) => void
  onUploadPhotoClick: () => void
  onSaveAccount: () => Promise<void> | void
  isSavingAccount: boolean
}

export function AccountSettingsTab({
  accountPhoto,
  accountFirstName,
  setAccountFirstName,
  accountLastName,
  setAccountLastName,
  accountEmail,
  setAccountEmail,
  accountPhone,
  setAccountPhone,
  accountJobTitle,
  setAccountJobTitle,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onUploadPhotoClick,
  onSaveAccount,
  isSavingAccount,
}: AccountSettingsTabProps) {
  return (
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
          <button type="button" onClick={onUploadPhotoClick}>
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
        onSave={onSaveAccount}
        isSaving={isSavingAccount}
      />
    </div>
  )
}
