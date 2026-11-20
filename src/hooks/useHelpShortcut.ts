'use client'

import { useEffect } from 'react'

export function useHelpShortcut(
  isOpen: boolean,
  onToggle: () => void,
  onClose: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        onClose()
        return
      }

      const target = event.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        Boolean(target?.isContentEditable)

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        event.preventDefault()
        onToggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onToggle, onClose])
}

