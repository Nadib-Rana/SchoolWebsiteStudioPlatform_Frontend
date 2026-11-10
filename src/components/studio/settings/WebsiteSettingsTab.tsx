'use client'

import { SettingsTitle, SettingsSave } from './SettingsHeaderSave'

interface WebsiteSettingsTabProps {
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
  ]

  return (
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
