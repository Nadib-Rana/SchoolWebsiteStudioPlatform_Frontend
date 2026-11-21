'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface WebsiteSettingsTabProps {
  allowPublicAdmission: boolean
  setAllowPublicAdmission: React.Dispatch<React.SetStateAction<boolean>>
  showNoticeTicker: boolean
  setShowNoticeTicker: React.Dispatch<React.SetStateAction<boolean>>
  showFloatingContact: boolean
  setShowFloatingContact: React.Dispatch<React.SetStateAction<boolean>>
  maintenanceMode: boolean
  setMaintenanceMode: React.Dispatch<React.SetStateAction<boolean>>
  searchIndexing: boolean
  setSearchIndexing: React.Dispatch<React.SetStateAction<boolean>>
  autoImageOpt: boolean
  setAutoImageOpt: React.Dispatch<React.SetStateAction<boolean>>
  showAttribution: boolean
  setShowAttribution: React.Dispatch<React.SetStateAction<boolean>>
  cookieBanner: boolean
  setCookieBanner: React.Dispatch<React.SetStateAction<boolean>>
  onSaveWebsite: () => Promise<void> | void
  isSavingWebsite: boolean
}

export function WebsiteSettingsTab({
  allowPublicAdmission,
  setAllowPublicAdmission,
  showNoticeTicker,
  setShowNoticeTicker,
  showFloatingContact,
  setShowFloatingContact,
  maintenanceMode,
  setMaintenanceMode,
  searchIndexing,
  setSearchIndexing,
  autoImageOpt,
  setAutoImageOpt,
  showAttribution,
  setShowAttribution,
  cookieBanner,
  setCookieBanner,
  onSaveWebsite,
  isSavingWebsite,
}: WebsiteSettingsTabProps) {
  const toggleItems = [
    {
      title: 'Public admissions portal',
      desc: 'Show the /admissions page, Apply Now button, and accept online student applications',
      active: allowPublicAdmission,
      toggle: () => setAllowPublicAdmission((prev) => !prev),
    },
    {
      title: 'Latest Notices ticker bar',
      desc: 'Show the scrolling public notices bar below the header on your website',
      active: showNoticeTicker,
      toggle: () => setShowNoticeTicker((prev) => !prev),
    },
    {
      title: 'Floating WhatsApp & Call buttons',
      desc: 'Display quick WhatsApp chat and phone call buttons at the bottom-right corner',
      active: showFloatingContact,
      toggle: () => setShowFloatingContact((prev) => !prev),
    },
    {
      title: 'Maintenance mode',
      desc: 'Temporarily hide the public website from visitors and display a maintenance screen',
      active: maintenanceMode,
      toggle: () => setMaintenanceMode((prev) => !prev),
    },
  ]

  return (
    <div className="card settings-form">
      <SettingsTitle
        title="Website preferences"
        description="Control live visibility features for your public school website. Changes apply immediately on save."
      />

      {toggleItems.map((x) => (
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
        onSave={onSaveWebsite}
        isSaving={isSavingWebsite}
      />
    </div>
  )
}
