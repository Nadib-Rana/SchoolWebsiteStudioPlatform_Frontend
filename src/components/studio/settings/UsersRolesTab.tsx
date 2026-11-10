'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingsTitle } from './SettingsHeaderSave'

interface UsersRolesTabProps {
  users: Array<[string, string, string, string, string, string?]>
  setUsers: React.Dispatch<React.SetStateAction<Array<any>>>
  activeUsersCount: number
  pendingUsersCount: number
  availableSeats: number
  onInviteClick: () => void
  onViewPermMatrixClick: () => void
  onUpdateRole?: (membershipId: string, role: string) => void
  onRemoveMember?: (membershipId: string, name: string) => void
  notify: (msg: string) => void
}

const ROLE_OPTIONS = [
  { value: 'OWNER', label: 'Owner', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'ADMIN', label: 'Administrator', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'EDITOR', label: 'Editor', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'CONTENT_MANAGER', label: 'Content Manager', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'ANALYST', label: 'Analyst', badge: 'bg-slate-50 text-slate-700 border-slate-200' },
]

export function UsersRolesTab({
  users,
  setUsers,
  activeUsersCount,
  pendingUsersCount,
  availableSeats,
  onInviteClick,
  onViewPermMatrixClick,
  onUpdateRole,
  onRemoveMember,
  notify,
}: UsersRolesTabProps) {
  return (
    <div className="card settings-form users-settings">
      <SettingsTitle
        title="Users & Roles"
        description="Manage workspace team members, permission tiers and invitations."
        action={
          <Button kind="primary" icon="plus" onClick={onInviteClick}>
            Invite user
          </Button>
        }
      />
      <div className="role-summary">
        <div>
          <span>Active team</span>
          <strong>{activeUsersCount}</strong>
        </div>
        <div>
          <span>Pending invites</span>
          <strong>{pendingUsersCount}</strong>
        </div>
        <div>
          <span>Available seats</span>
          <strong>{availableSeats}</strong>
        </div>
      </div>

      <div className="settings-user-list">
        {users.map((u, i) => {
          const membershipId = u[5] || ''
          const currentRoleVal = (u[3] || 'EDITOR').toUpperCase().replace(/\s+/g, '_')
          const roleMeta = ROLE_OPTIONS.find((r) => r.value === currentRoleVal) || ROLE_OPTIONS[2]

          return (
            <div key={u[1] + i}>
              <span className={`person p${i % 4}`}>{u[0]}</span>
              <div>
                <strong>
                  {u[1]}
                  {i === 0 && <em>You</em>}
                </strong>
                <small>{u[2]}</small>
              </div>

              <select
                value={currentRoleVal}
                onChange={(e) => {
                  const newRole = e.target.value
                  if (onUpdateRole && membershipId) {
                    onUpdateRole(membershipId, newRole)
                  } else {
                    setUsers((prev) =>
                      prev.map((row, idx) =>
                        idx === i ? [row[0], row[1], row[2], newRole, row[4], row[5]] : row
                      )
                    )
                    notify(`Updated role for ${u[1]} to ${newRole}`)
                  }
                }}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${roleMeta.badge}`}>
                {roleMeta.label}
              </span>

              <button
                type="button"
                aria-label={`Remove ${u[1]}`}
                title="Remove member"
                onClick={() => {
                  if (i === 0 || currentRoleVal === 'OWNER') {
                    notify('Owner account cannot be removed.')
                  } else if (onRemoveMember && membershipId) {
                    onRemoveMember(membershipId, u[1])
                  } else {
                    if (window.confirm(`Remove user ${u[1]} (${u[2]}) from workspace?`)) {
                      setUsers((prev) => prev.filter((_, idx) => idx !== i))
                      notify(`User ${u[1]} removed.`)
                    }
                  }
                }}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          )
        })}
      </div>

      <div className="permission-note">
        <Icon name="help" />
        <div>
          <strong>Role capabilities & governance</strong>
          <p>
            Owners manage billing and security. Administrators manage the website and team. Editors customize builder layouts. Content managers manage announcements. Analysts have read-only analytics.
          </p>
        </div>
        <button type="button" onClick={onViewPermMatrixClick}>
          View permission matrix
        </button>
      </div>
    </div>
  )
}
