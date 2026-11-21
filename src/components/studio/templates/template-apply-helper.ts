import { THEME_CONFIGS } from '@/config/themes'
import { api } from '@/lib/api-client'
import { saveCustomThemeLocally } from '../theme/theme-sync-helper'
import {
  loadBuilderStateFromLocal,
  persistBuilderStateToLocal,
} from '../builder/builder-storage'
import type { SchoolTheme } from '@/types/theme'

export async function applyTemplateToBuilder(
  templateTheme: SchoolTheme,
  options?: { schoolId?: string; schoolName?: string },
): Promise<string> {
  const cfg = THEME_CONFIGS[templateTheme]
  const activeSchoolId = options?.schoolId || api.getActiveSchoolId()
  const preservedSchoolName = options?.schoolName?.trim()

  if (cfg && typeof window !== 'undefined') {
    try {
      const builderData = loadBuilderStateFromLocal(activeSchoolId) || {}
      const resolvedSchoolName =
        preservedSchoolName || builderData.schoolName || cfg.schoolName

      const updated = {
        ...builderData,
        schoolName: resolvedSchoolName,
        logoLetter: resolvedSchoolName.charAt(0),
        eyebrow: cfg.eyebrow,
        heading: cfg.headline,
        description: cfg.description,
        buttonLabel: cfg.buttonLabel,
        announcementText: cfg.announcementText,
        heroBg: cfg.heroImage,
        heroImages: [cfg.heroImage],
        appliedTheme: templateTheme,
        introKicker: `WELCOME TO ${resolvedSchoolName.toUpperCase()}`,
        sectionStyles: {
          ...(builderData.sectionStyles || {}),
          Header: {
            ...(builderData.sectionStyles?.Header || {}),
            bg: cfg.headerBg,
          },
          'Announcement bar': {
            ...(builderData.sectionStyles?.['Announcement bar'] || {}),
            bg: cfg.primaryColor,
          },
          Statistics: {
            ...(builderData.sectionStyles?.Statistics || {}),
            bg: cfg.primaryColor,
          },
          Footer: {
            ...(builderData.sectionStyles?.Footer || {}),
            bg: cfg.primaryColor,
          },
        },
      }

      persistBuilderStateToLocal(updated, activeSchoolId)
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
