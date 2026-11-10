'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { SettingsTitle } from './SettingsHeaderSave'

interface UsersRolesTabProps {
  users: Array<[string, string, string, string, string]>
  setUsers: React.Dispatch<React.SetStateAction<Array<[string, string, string, string, string]>>>
  activeUsersCount: number
  pendingUsersCount: number
  availableSeats: number
  onInviteClick: () => void
  onViewPermMatrixClick: () => void
  notify: (msg: string) => void
}

export function UsersRolesTab({
  users,
  setUsers,
  activeUsersCount,
  pendingUsersCount,
  availableSeats,
  onInviteClick,
  onViewPermMatrixClick,
  notify,
}: UsersRolesTabProps) {
  return (
    <div className="card settings-form users-settings">
      <SettingsTitle
        title="Users & roles"
        description="Control who can access the Studio and what they can change."
        action={
          <Button kind="primary" icon="plus" onClick={onInviteClick}>
            Invite user
          </Button>
        }
      />
      <div className="role-summary">
        <div>
          <span>Active users</span>
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
        {users.map((u, i) => (
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
              value={u[3]}
              onChange={(e) => {
                const newRole = e.target.value
                setUsers((prev) =>
                  prev.map((row, idx) =>
                    idx === i ? [row[0], row[1], row[2], newRole, row[4]] : row
                  )
                )
                notify(`Updated role for ${u[1]} to ${newRole}`)
              }}
            >
              <option value="Owner">Owner</option>
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Content manager">Content manager</option>
              <option value="Analyst">Analyst</option>
            </select>
            <span className={`state-badge ${u[4].toLowerCase()}`}>
              <i />
              {u[4]}
            </span>
            <button
              type="button"
              aria-label={`Options for ${u[1]}`}
              onClick={() => {
                if (i === 0) {
                  notify('Owner account permissions cannot be modified directly.')
                } else {
                  const confirmRemove = window.confirm(`Remove user ${u[1]} (${u[2]}) from workspace?`)
                  if (confirmRemove) {
                    setUsers((prev) => prev.filter((_, idx) => idx !== i))
                    notify(`User ${u[1]} removed from workspace.`)
                  }
                }
              }}
            >
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
            website and team. Editors publish content. Analysts have read-only access.
          </p>
        </div>
        <button type="button" onClick={onViewPermMatrixClick}>
          View permission matrix
        </button>
      </div>
    </div>
  )
}
