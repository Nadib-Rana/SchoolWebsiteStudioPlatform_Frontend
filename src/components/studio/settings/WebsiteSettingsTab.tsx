'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface WebsiteSettingsTabProps {
  allowPublicAdmission: boolean
  setAllowPublicAdmission: React.Dispatch<React.SetStateAction<boolean>>
  showGoverningBody: boolean
  setShowGoverningBody: React.Dispatch<React.SetStateAction<boolean>>
  showNoticeTicker: boolean
  setShowNoticeTicker: React.Dispatch<React.SetStateAction<boolean>>
  showFloatingContact: boolean
  setShowFloatingContact: React.Dispatch<React.SetStateAction<boolean>>
  showWhatsappButton: boolean
  setShowWhatsappButton: React.Dispatch<React.SetStateAction<boolean>>
  showCallButton: boolean
  setShowCallButton: React.Dispatch<React.SetStateAction<boolean>>
  whatsappNumber: string
  setWhatsappNumber: React.Dispatch<React.SetStateAction<string>>
  callNumber: string
  setCallNumber: React.Dispatch<React.SetStateAction<string>>
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
  showGoverningBody,
  setShowGoverningBody,
  showNoticeTicker,
  setShowNoticeTicker,
  showWhatsappButton,
  setShowWhatsappButton,
  showCallButton,
  setShowCallButton,
  whatsappNumber,
  setWhatsappNumber,
  callNumber,
  setCallNumber,
  maintenanceMode,
  setMaintenanceMode,
  onSaveWebsite,
  isSavingWebsite,
}: WebsiteSettingsTabProps) {
  return (
    <div className="card settings-form">
      <SettingsTitle
        title="Website preferences"
        description="Control live visibility features and floating contact numbers for your public school website. Changes apply immediately on save."
      />

      <div className="toggle-row">
        <div>
          <strong>Public admissions portal</strong>
          <small>
            Show the /admissions page, Apply Now button, and accept online student applications
          </small>
        </div>
        <button
          type="button"
          className={allowPublicAdmission ? 'toggle on' : 'toggle'}
          onClick={() => setAllowPublicAdmission((prev) => !prev)}
          aria-label="Toggle Public admissions portal"
        >
          <i />
        </button>
      </div>

      <div className="toggle-row">
        <div>
          <strong>Governing Body / Managing Committee</strong>
          <small>
            Show the /governing-body page and committee sections on Homepage &amp; About page
          </small>
        </div>
        <button
          type="button"
          className={showGoverningBody ? 'toggle on' : 'toggle'}
          onClick={() => setShowGoverningBody((prev) => !prev)}
          aria-label="Toggle Governing Body section and page"
        >
          <i />
        </button>
      </div>

      <div className="toggle-row">
        <div>
          <strong>Latest Notices ticker bar</strong>
          <small>
            Show the scrolling public notices bar below the header on your website
          </small>
        </div>
        <button
          type="button"
          className={showNoticeTicker ? 'toggle on' : 'toggle'}
          onClick={() => setShowNoticeTicker((prev) => !prev)}
          aria-label="Toggle Latest Notices ticker bar"
        >
          <i />
        </button>
      </div>

      <div className="toggle-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <strong>Floating WhatsApp chat button</strong>
          <small>
            Display the quick WhatsApp chat button at the bottom-right corner of your public website
          </small>
        </div>
        <button
          type="button"
          className={showWhatsappButton ? 'toggle on' : 'toggle'}
          onClick={() => setShowWhatsappButton((prev) => !prev)}
          aria-label="Toggle Floating WhatsApp chat button"
        >
          <i />
        </button>
        <div className="w-full pt-1">
          <label className="block text-xs font-semibold text-slate-600">
            WhatsApp Number (Local 01XXXXXXXXX or International +880...)
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 01711-000000 or +880 1711-000000"
              className="mt-1.5 block w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600"
            />
          </label>
        </div>
      </div>

      <div className="toggle-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <strong>Floating Phone Call button</strong>
          <small>
            Display the direct Call Office button at the bottom-right corner of your public website
          </small>
        </div>
        <button
          type="button"
          className={showCallButton ? 'toggle on' : 'toggle'}
          onClick={() => setShowCallButton((prev) => !prev)}
          aria-label="Toggle Floating Phone Call button"
        >
          <i />
        </button>
        <div className="w-full pt-1">
          <label className="block text-xs font-semibold text-slate-600">
            Call Office Phone Number
            <input
              type="text"
              value={callNumber}
              onChange={(e) => setCallNumber(e.target.value)}
              placeholder="e.g. 01711-000000 or +880 1711-000000"
              className="mt-1.5 block w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600"
            />
          </label>
        </div>
      </div>

      <div className="toggle-row">
        <div>
          <strong>Maintenance mode</strong>
          <small>
            Temporarily hide the public website from visitors and display a maintenance screen
          </small>
        </div>
        <button
          type="button"
          className={maintenanceMode ? 'toggle on' : 'toggle'}
          onClick={() => setMaintenanceMode((prev) => !prev)}
          aria-label="Toggle Maintenance mode"
        >
          <i />
        </button>
      </div>

      <SettingsSave
        text="Website preferences and contact numbers apply immediately on save"
        onSave={onSaveWebsite}
        isSaving={isSavingWebsite}
      />
    </div>
  )
}
