'use client'

import { PublicFooter } from '@/components/public-site/PublicFooter'
import { PublicHeader } from '@/components/public-site/PublicHeader'
import { PublicHome } from '@/components/public-site/PublicHome'
import { PublicInnerPage } from '@/components/public-site/PublicInnerPage'
import { PublicPreviewBar } from '@/components/public-site/PublicPreviewBar'
import { useStudio } from '@/context/StudioContext'
import type { SchoolTheme } from '@/types/theme'
import { useState } from 'react'

export interface PublicSiteProps {
  initialTheme?: SchoolTheme
}

export function PublicSite({ initialTheme }: PublicSiteProps) {
  const { previewTheme, setPreviewTheme } = useStudio()
  const [theme, setTheme] = useState<SchoolTheme>(initialTheme || previewTheme)
  const [page, setPage] = useState('Home')

  const handleThemeChange = (newTheme: SchoolTheme) => {
    setTheme(newTheme)
    setPreviewTheme(newTheme)
  }

  return (
    <div className={`public-site theme-${theme}`}>
      <PublicPreviewBar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={handleThemeChange}
      />
      <PublicHeader setPage={setPage} />
      {page === 'Home' ? (
        <PublicHome theme={theme} setPage={setPage} />
      ) : (
        <PublicInnerPage page={page} setPage={setPage} />
      )}
      <PublicFooter />
    </div>
  )
}
