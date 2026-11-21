'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { SettingsTitle } from './SettingsHeaderSave'

interface BackupExportTabProps {
  onExportContent: () => void
  onExportMediaArchive: () => void
  onExportAnalytics: () => void
  onSelectRestoreBackup: (backupName: string) => void
}

export function BackupExportTab({
  onExportContent,
  onExportMediaArchive,
  onExportAnalytics,
}: BackupExportTabProps) {
  const { setView } = useStudio()

  return (
    <div className="settings-content-stack">
      <div className="card settings-form">
        <SettingsTitle
          title="Backup & export"
          description="Download real-time JSON/CSV exports of your school data or manage snapshots in Publishing."
        />
        <div className="backup-status">
          <span>
            <Icon name="check" />
          </span>
          <div>
            <strong>Version snapshots are managed in Publishing</strong>
            <p>Every published version creates a real PostgreSQL snapshot you can restore anytime.</p>
          </div>
          <Button kind="primary" onClick={() => setView('publishing')}>
            Open Version History
          </Button>
        </div>
        <div className="export-grid">
          <button type="button" onClick={onExportContent}>
            <span>
              <Icon name="file" />
            </span>
            <strong>Export website content</strong>
            <p>Pages, notices, events, teachers, and settings in JSON format.</p>
            <em>
              Prepare export <Icon name="arrow" size={13} />
            </em>
          </button>
          <button type="button" onClick={onExportMediaArchive}>
            <span>
              <Icon name="image" />
            </span>
            <strong>Download media archive</strong>
            <p>All uploaded images and documents in a manifest format.</p>
            <em>
              Prepare archive <Icon name="arrow" size={13} />
            </em>
          </button>
          <button type="button" onClick={onExportAnalytics}>
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
    </div>
  )
}
