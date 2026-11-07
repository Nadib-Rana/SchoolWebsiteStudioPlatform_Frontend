'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { IconName } from '@/types/studio'
import { useEffect, useState, type ReactNode } from 'react'

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
    <div className="form-title">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function SettingsSave({ text, notify }: { text: string; notify: () => void }) {
  return (
    <div className="form-actions">
      <span>{text}</span>
      <Button>Cancel</Button>
      <Button kind="primary" onClick={notify}>
        Save changes
      </Button>
    </div>
  )
}

export function Settings() {
  const { notify, setView } = useStudio()
  const [active, setActive] = useState('School profile')
  const [users, setUsers] = useState<Array<[string, string, string, string, string]>>([
    ['AR', 'Amina Rahman', 'admin@northfield.edu', 'Owner', 'Active'],
    ['MK', 'Mahmud Karim', 'mahmud@northfield.edu', 'Editor', 'Active'],
    ['SJ', 'Sara Jahan', 'sara@northfield.edu', 'Content manager', 'Active'],
    ['TN', 'Tanvir Noor', 'tanvir@northfield.edu', 'Analyst', 'Pending'],
  ])

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
    loadMembers()
    return () => {
      mounted = false
    }
  }, [])

  const tabs: [string, IconName][] = [
    ['School profile', 'home'],
    ['Account', 'users'],
    ['Users & roles', 'users'],
    ['Notifications', 'bell'],
    ['Website', 'globe'],
    ['Security', 'settings'],
    ['Backup & export', 'file'],
  ]

  return (
    <div className="settings-layout">
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
              <div>NH</div>
              <span>
                <strong>Workspace logo</strong>
                <small>Used in Studio and account emails</small>
                <button type="button">Replace logo</button>
              </span>
            </div>
            <div className="form-grid">
              <label>
                School display name
                <input defaultValue="Northfield High School" />
              </label>
              <label>
                School type
                <select defaultValue="Secondary school">
                  <option>Secondary school</option>
                </select>
              </label>
              <label>
                Timezone
                <select defaultValue="Asia/Dhaka (GMT+6)">
                  <option>Asia/Dhaka (GMT+6)</option>
                </select>
              </label>
              <label>
                Default language
                <select defaultValue="English">
                  <option>English</option>
                </select>
              </label>
              <label>
                Date format
                <select defaultValue="DD MMM YYYY">
                  <option>DD MMM YYYY</option>
                </select>
              </label>
              <label>
                Academic year starts
                <select defaultValue="January">
                  <option>January</option>
                </select>
              </label>
            </div>
            <SettingsSave
              text="Changes apply across the workspace"
              notify={() => notify('School profile saved')}
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
              <div>AR</div>
              <span>
                <strong>Amina Rahman</strong>
                <small>Workspace administrator</small>
                <button type="button">Upload new photo</button>
              </span>
            </div>
            <div className="form-grid">
              <label>
                First name
                <input defaultValue="Amina" />
              </label>
              <label>
                Last name
                <input defaultValue="Rahman" />
              </label>
              <label className="full">
                Email address
                <input type="email" defaultValue="admin@northfield.edu" />
              </label>
              <label>
                Phone number
                <input defaultValue="+880 1712 345 678" />
              </label>
              <label>
                Job title
                <input defaultValue="School Administrator" />
              </label>
            </div>
            <div className="settings-divider">
              <strong>Change password</strong>
              <p>Use at least 12 characters with a mix of letters, numbers, and symbols.</p>
            </div>
            <div className="form-grid">
              <label>
                Current password
                <input type="password" placeholder="Enter current password" />
              </label>
              <span />
              <label>
                New password
                <input type="password" placeholder="Create new password" />
              </label>
              <label>
                Confirm new password
                <input type="password" placeholder="Repeat new password" />
              </label>
            </div>
            <SettingsSave
              text="Last account update 18 days ago"
              notify={() => notify('Account settings updated')}
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
                  onClick={() => notify('User invitation opened')}
                >
                  Invite user
                </Button>
              }
            />
            <div className="role-summary">
              <div>
                <span>Active users</span>
                <strong>4</strong>
              </div>
              <div>
                <span>Pending invites</span>
                <strong>1</strong>
              </div>
              <div>
                <span>Available seats</span>
                <strong>5</strong>
              </div>
            </div>
            <div className="settings-user-list">
              {users.map((u, i) => (
                <div key={u[1]}>
                  <span className={`person p${i}`}>{u[0]}</span>
                  <div>
                    <strong>
                      {u[1]}
                      {i === 0 && <em>You</em>}
                    </strong>
                    <small>{u[2]}</small>
                  </div>
                  <select defaultValue={u[3]}>
                    <option>Owner</option>
                    <option>Administrator</option>
                    <option>Editor</option>
                    <option>Content manager</option>
                    <option>Analyst</option>
                  </select>
                  <span className={`state-badge ${u[4].toLowerCase()}`}>
                    <i />
                    {u[4]}
                  </span>
                  <button type="button" aria-label={`More options for ${u[1]}`}>
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
              <button type="button">View permission matrix</button>
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
            {[
              ['Publishing activity', 'Draft approvals, publishes, and version restores', true, true],
              ['Domain & SSL', 'Verification changes, renewals, and errors', true, true],
              ['ERP synchronization', 'Sync results and records requiring review', true, true],
              ['Admission API health', 'Gateway health warnings and connection failures', true, true],
              ['Team activity', 'Invites, role changes, and security events', false, true],
              ['Weekly analytics report', 'Traffic and content performance summary', true, false],
            ].map((x) => (
              <div className="notification-setting" key={String(x[0])}>
                <div>
                  <strong>{x[0]}</strong>
                  <small>{x[1]}</small>
                </div>
                <button
                  type="button"
                  className={x[2] ? 'toggle on' : 'toggle'}
                  aria-label={`Toggle email for ${x[0]}`}
                >
                  <i />
                </button>
                <button
                  type="button"
                  className={x[3] ? 'toggle on' : 'toggle'}
                  aria-label={`Toggle in-app for ${x[0]}`}
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
              notify={() => notify('Notification preferences saved')}
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
              ['Maintenance mode', 'Temporarily hide the public website from visitors', false],
              ['Search engine indexing', 'Allow approved pages to appear in search results', true],
              ['Automatic image optimization', 'Resize and compress uploaded images for performance', true],
              ['Show “Powered by SchoolCanvas”', 'Display platform attribution in the public footer', false],
              ['Cookie preference banner', 'Show visitors privacy and analytics choices', true],
            ].map((x) => (
              <div className="toggle-row" key={String(x[0])}>
                <div>
                  <strong>{x[0]}</strong>
                  <small>{x[1]}</small>
                </div>
                <button
                  type="button"
                  className={x[2] ? 'toggle on' : 'toggle'}
                  aria-label={`Toggle ${x[0]}`}
                >
                  <i />
                </button>
              </div>
            ))}
            <SettingsSave
              text="Website preferences affect the next published version"
              notify={() => notify('Website preferences saved')}
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
                ['Two-factor authentication', 'Require an additional verification code at sign in', 'Required'],
                ['Strong password policy', 'Require at least 12 characters for all team members', 'Enabled'],
                ['Session timeout', 'Automatically sign out inactive users', '8 hours'],
                ['New device alerts', 'Email account owners when a new device signs in', 'Enabled'],
              ].map((x) => (
                <div className="security-row" key={x[0]}>
                  <span>
                    <Icon name="check" size={13} />
                  </span>
                  <div>
                    <strong>{x[0]}</strong>
                    <small>{x[1]}</small>
                  </div>
                  <button type="button">
                    {x[2]} <Icon name="chevron" size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="card settings-form">
              <SettingsTitle
                title="Active sessions"
                description="Devices currently signed in to your account."
              />
              <div className="session-row">
                <span>
                  <Icon name="monitor" />
                </span>
                <div>
                  <strong>Chrome on Windows</strong>
                  <small>Dhaka, Bangladesh · Current session</small>
                </div>
                <em>Active now</em>
              </div>
              <div className="session-row">
                <span>
                  <Icon name="mobile" />
                </span>
                <div>
                  <strong>Safari on iPhone</strong>
                  <small>Dhaka, Bangladesh · Last active 2 hours ago</small>
                </div>
                <button type="button">Revoke</button>
              </div>
              <div className="danger-settings">
                <div>
                  <strong>Sign out everywhere</strong>
                  <p>End all sessions except the device you are using now.</p>
                </div>
                <Button onClick={() => notify('All other sessions signed out')}>
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
                <button
                  type="button"
                  onClick={() => notify('Website content export prepared')}
                >
                  <span>
                    <Icon name="file" />
                  </span>
                  <strong>Export website content</strong>
                  <p>Pages, notices, events, teachers, and settings in JSON format.</p>
                  <em>
                    Prepare export <Icon name="arrow" size={13} />
                  </em>
                </button>
                <button
                  type="button"
                  onClick={() => notify('Media archive preparation started')}
                >
                  <span>
                    <Icon name="image" />
                  </span>
                  <strong>Download media archive</strong>
                  <p>All uploaded images and documents in a ZIP archive.</p>
                  <em>
                    Prepare archive <Icon name="arrow" size={13} />
                  </em>
                </button>
                <button
                  type="button"
                  onClick={() => notify('Analytics report generated')}
                >
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
                    <Button
                      onClick={() =>
                        notify(`Restore confirmation opened for ${x[0]}`)
                      }
                    >
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
