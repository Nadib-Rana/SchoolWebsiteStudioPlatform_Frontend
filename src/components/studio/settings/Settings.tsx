'use client'

import { useSettingsState } from './useSettingsState'
import { SettingsNav } from './SettingsNav'
import { SchoolProfileTab } from './SchoolProfileTab'
import { AccountSettingsTab } from './AccountSettingsTab'
import { UsersRolesTab } from './UsersRolesTab'
import { NotificationsTab } from './NotificationsTab'
import { WebsiteSettingsTab } from './WebsiteSettingsTab'
import { SecuritySettingsTab } from './SecuritySettingsTab'
import { BackupExportTab } from './BackupExportTab'
import { InviteUserModal } from './InviteUserModal'
import { RolePermissionModal } from './RolePermissionModal'
import { RestoreBackupModal } from './RestoreBackupModal'

export function Settings() {
  const s = useSettingsState()

  const activeUsersCount = s.users.filter((u) => u[4] === 'Active').length
  const pendingUsersCount = s.users.filter((u) => u[4] === 'Pending').length
  const availableSeats = Math.max(0, 10 - s.users.length)

  return (
    <div className="settings-layout">
      <input
        ref={s.logoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={s.handleLogoUpload}
      />
      <input
        ref={s.faviconInputRef}
        type="file"
        accept="image/*,.ico"
        style={{ display: 'none' }}
        onChange={s.handleFaviconUpload}
      />
      <input
        ref={s.accountPhotoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={s.handleAccountPhotoUpload}
      />

      <SettingsNav
        active={s.active}
        setActive={s.setActive}
        notify={s.notify}
        setView={s.setView}
      />

      <div className="settings-content">
        {s.active === 'School profile' && (
          <SchoolProfileTab
            schoolLogo={s.schoolLogo}
            schoolName={s.schoolName}
            setSchoolName={s.setSchoolName}
            schoolType={s.schoolType}
            setSchoolType={s.setSchoolType}
            timezone={s.timezone}
            setTimezone={s.setTimezone}
            language={s.language}
            setLanguage={s.setLanguage}
            dateFormat={s.dateFormat}
            setDateFormat={s.setDateFormat}
            academicYearStart={s.academicYearStart}
            setAcademicYearStart={s.setAcademicYearStart}
            onReplaceLogoClick={() => s.logoInputRef.current?.click()}
            schoolFavicon={s.schoolFavicon}
            onReplaceFaviconClick={() => s.faviconInputRef.current?.click()}
            onSaveProfile={s.handleSaveProfile}
            isSavingProfile={s.isSavingProfile}
          />
        )}

        {s.active === 'Account' && (
          <AccountSettingsTab
            accountPhoto={s.accountPhoto}
            accountFirstName={s.accountFirstName}
            setAccountFirstName={s.setAccountFirstName}
            accountLastName={s.accountLastName}
            setAccountLastName={s.setAccountLastName}
            accountEmail={s.accountEmail}
            setAccountEmail={s.setAccountEmail}
            accountPhone={s.accountPhone}
            setAccountPhone={s.setAccountPhone}
            accountJobTitle={s.accountJobTitle}
            setAccountJobTitle={s.setAccountJobTitle}
            currentPassword={s.currentPassword}
            setCurrentPassword={s.setCurrentPassword}
            newPassword={s.newPassword}
            setNewPassword={s.setNewPassword}
            confirmPassword={s.confirmPassword}
            setConfirmPassword={s.setConfirmPassword}
            onUploadPhotoClick={() => s.accountPhotoInputRef.current?.click()}
            onSaveAccount={s.handleSaveAccount}
            isSavingAccount={s.isSavingAccount}
          />
        )}

        {s.active === 'Users & roles' && (
          <UsersRolesTab
            users={s.users}
            setUsers={s.setUsers}
            activeUsersCount={activeUsersCount}
            pendingUsersCount={pendingUsersCount}
            availableSeats={availableSeats}
            onInviteClick={() => s.setInviteModalOpen(true)}
            onViewPermMatrixClick={() => s.setPermMatrixOpen(true)}
            notify={s.notify}
          />
        )}

        {s.active === 'Notifications' && (
          <NotificationsTab
            notificationPreferences={s.notificationPreferences}
            toggleNotification={s.toggleNotification}
            onSaveNotifications={() => s.notify('Notification preferences saved successfully.')}
          />
        )}

        {s.active === 'Website' && (
          <WebsiteSettingsTab
            maintenanceMode={s.maintenanceMode}
            setMaintenanceMode={s.setMaintenanceMode}
            searchIndexing={s.searchIndexing}
            setSearchIndexing={s.setSearchIndexing}
            autoImageOpt={s.autoImageOpt}
            setAutoImageOpt={s.setAutoImageOpt}
            showAttribution={s.showAttribution}
            setShowAttribution={s.setShowAttribution}
            cookieBanner={s.cookieBanner}
            setCookieBanner={s.setCookieBanner}
            onSaveWebsite={s.handleSaveWebsite}
            isSavingWebsite={s.isSavingWebsite}
          />
        )}

        {s.active === 'Security' && (
          <SecuritySettingsTab
            twoFactorAuth={s.twoFactorAuth}
            setTwoFactorAuth={s.setTwoFactorAuth}
            strongPassword={s.strongPassword}
            setStrongPassword={s.setStrongPassword}
            sessionTimeout={s.sessionTimeout}
            handleCycleSessionTimeout={s.handleCycleSessionTimeout}
            newDeviceAlerts={s.newDeviceAlerts}
            setNewDeviceAlerts={s.setNewDeviceAlerts}
            sessions={s.sessions}
            handleRevokeSession={s.handleRevokeSession}
            handleSignOutOtherDevices={s.handleSignOutOtherDevices}
            handleSaveSecurity={() => s.notify('Security configuration saved.')}
            notify={s.notify}
          />
        )}

        {s.active === 'Backup & export' && (
          <BackupExportTab
            onExportContent={s.handleExportContent}
            onExportMediaArchive={s.handleExportMediaArchive}
            onExportAnalytics={s.handleExportAnalytics}
            onSelectRestoreBackup={(backupName) => s.setRestoreModalBackup(backupName)}
          />
        )}
      </div>

      {s.inviteModalOpen && (
        <InviteUserModal
          inviteEmail={s.inviteEmail}
          setInviteEmail={s.setInviteEmail}
          inviteRole={s.inviteRole}
          setInviteRole={s.setInviteRole}
          isInviting={s.isInviting}
          onClose={() => s.setInviteModalOpen(false)}
          onSendInvite={s.handleSendInvite}
        />
      )}

      {s.permMatrixOpen && (
        <RolePermissionModal onClose={() => s.setPermMatrixOpen(false)} />
      )}

      {s.restoreModalBackup && (
        <RestoreBackupModal
          backupName={s.restoreModalBackup}
          isRestoring={s.isRestoring}
          onClose={() => s.setRestoreModalBackup(null)}
          onConfirm={s.handleConfirmRestore}
        />
      )}
    </div>
  )
}
