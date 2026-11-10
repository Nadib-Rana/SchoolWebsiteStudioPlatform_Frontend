'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PublicAnalyticsTrackerProps {
  schoolSlug: string
}

export function PublicAnalyticsTracker({ schoolSlug }: PublicAnalyticsTrackerProps) {
  const pathname = usePathname()
  const lastTracked = useRef<string>('')

  useEffect(() => {
    if (!schoolSlug || !pathname) return

    const key = `${schoolSlug}:${pathname}`
    if (lastTracked.current === key) return
    lastTracked.current = key

    try {
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      const device = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
      const referrer = typeof document !== 'undefined' ? document.referrer : ''

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

      fetch(`${apiUrl}/public/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolSlug,
          path: pathname,
          referrer,
          device,
        }),
        keepalive: true,
      }).catch(() => {
        // Silent catch for ad-blockers or offline browsing
      })
    } catch {
      // Ignore client tracking errors
    }
  }, [schoolSlug, pathname])

  return null
}
