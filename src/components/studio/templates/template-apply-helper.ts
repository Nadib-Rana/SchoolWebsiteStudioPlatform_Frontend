import { THEME_CONFIGS } from '@/config/themes'
import { api } from '@/lib/api-client'
import { saveCustomThemeLocally } from '../theme/theme-sync-helper'
import type { SchoolTheme } from '@/types/theme'

export async function applyTemplateToBuilder(templateTheme: SchoolTheme): Promise<string> {
  const cfg = THEME_CONFIGS[templateTheme]
  if (cfg && typeof window !== 'undefined') {
    try {
      let builderData: any = {}
      const saved = localStorage.getItem('studio_builder_homepage_data')
      if (saved) {
        try {
          builderData = JSON.parse(saved)
        } catch {}
      }

      const updated = {
        ...builderData,
        schoolName: cfg.schoolName,
        logoLetter: cfg.schoolName.charAt(0),
        eyebrow: cfg.eyebrow,
        heading: cfg.headline,
        description: cfg.description,
        buttonLabel: cfg.buttonLabel,
        announcementText: cfg.announcementText,
        heroBg: cfg.heroImage,
        appliedTheme: templateTheme,
        introKicker: `WELCOME TO ${cfg.schoolName.toUpperCase()}`,
        sectionStyles: {
          ...(builderData.sectionStyles || {}),
          Header: { ...(builderData.sectionStyles?.Header || {}), bg: cfg.headerBg },
          'Announcement bar': { ...(builderData.sectionStyles?.['Announcement bar'] || {}), bg: cfg.primaryColor },
          Statistics: { ...(builderData.sectionStyles?.Statistics || {}), bg: cfg.primaryColor },
          Footer: { ...(builderData.sectionStyles?.Footer || {}), bg: cfg.primaryColor },
        },
      }

      localStorage.setItem('studio_builder_homepage_data', JSON.stringify(updated))
      localStorage.setItem('studio_selected_theme', templateTheme)
      saveCustomThemeLocally({
        primaryColor: cfg.primaryColor,
        secondaryColor: cfg.secondaryColor,
        fontHeading: cfg.fontHeading,
      })
    } catch (e) {
      console.debug('Failed to update builder data with template:', e)
    }
  }

  try {
    if (cfg) {
      await api.theme.saveDraft({
        activeTheme: `theme-${templateTheme}`,
        selectedTemplate: cfg.templateName,
        primaryColor: cfg.primaryColor,
        secondaryColor: cfg.secondaryColor,
        fontHeading: cfg.fontHeading,
        fontBody: 'Inter',
      })
    }
  } catch (e) {
    console.debug('Backend theme sync notice:', e)
  }

  return cfg?.templateName || templateTheme
}
