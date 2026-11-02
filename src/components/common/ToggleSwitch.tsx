'use client'

import { useState } from 'react'

export interface ToggleSwitchProps {
  defaultOn?: boolean
  isOn?: boolean
  onChange?: (val: boolean) => void
  className?: string
  ariaLabel?: string
}

export function ToggleSwitch({
  defaultOn = false,
  isOn,
  onChange,
  className = '',
  ariaLabel,
}: ToggleSwitchProps) {
  const [internalOn, setInternalOn] = useState(defaultOn)
  const isControlled = isOn !== undefined
  const current = isControlled ? isOn : internalOn

  const handleToggle = () => {
    const next = !current
    if (!isControlled) setInternalOn(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={current}
      aria-label={ariaLabel}
      className={`toggle ${current ? 'on' : ''} ${className}`}
      onClick={handleToggle}
    >
      <i />
    </button>
  )
}
