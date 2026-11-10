'use client'

import { useState } from 'react'
import type { SessionItem } from './SecuritySettingsTab'

export function useSettingsSecurity(notify: (msg: string) => void) {
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [strongPassword, setStrongPassword] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('8 hours')
  const [newDeviceAlerts, setNewDeviceAlerts] = useState(true)

  const [sessions, setSessions] = useState<SessionItem[]>([
    { id: 's1', device: 'Chrome on Windows', location: 'Dhaka, Bangladesh', current: true, lastActive: 'Active now' },
    { id: 's2', device: 'Safari on iPhone', location: 'Dhaka, Bangladesh', current: false, lastActive: 'Last active 2 hours ago' },
  ])

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    notify('Device session revoked successfully.')
  }

  const handleSignOutOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.current))
    notify('All other sessions signed out.')
  }

  const handleCycleSessionTimeout = () => {
    const timeouts = ['4 hours', '8 hours', '24 hours', '7 days']
    const nextIdx = (timeouts.indexOf(sessionTimeout) + 1) % timeouts.length
    setSessionTimeout(timeouts[nextIdx])
    notify(`Session timeout set to ${timeouts[nextIdx]}`)
  }

  return {
    twoFactorAuth,
    setTwoFactorAuth,
    strongPassword,
    setStrongPassword,
    sessionTimeout,
    newDeviceAlerts,
    setNewDeviceAlerts,
    sessions,
    handleRevokeSession,
    handleSignOutOtherDevices,
    handleCycleSessionTimeout,
  }
}
