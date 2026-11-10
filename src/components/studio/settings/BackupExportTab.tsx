'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
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
  onSelectRestoreBackup,
}: BackupExportTabProps) {
  const backups = [
    ['Today, 03:15 AM', 'Automatic backup', '2.8 GB'],
    ['Yesterday, 03:14 AM', 'Automatic backup', '2.8 GB'],
    ['May 10, 10:42 AM', 'Before version 2.7 publish', '2.7 GB'],
  ]

  return (
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

      <div className="card settings-form">
        <SettingsTitle
          title="Backup history"
          description="Daily backups are retained for 30 days."
        />
        <div className="backup-list">
          {backups.map((x) => (
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
              <Button onClick={() => onSelectRestoreBackup(x[0])}>
                Restore
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
