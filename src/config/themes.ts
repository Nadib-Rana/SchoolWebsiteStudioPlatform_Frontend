import type { SchoolTheme } from '@/types/theme'
import { campusImage, heroImage, interiorImage } from '@/config/templates'

export const themeLabels: Record<SchoolTheme, string> = {
  modern: 'Modern',
  classic: 'Traditional',
  international: 'International',
  college: 'College',
  'high-school': 'High School',
  primary: 'Primary',
  religious: 'Religious',
  minimal: 'Minimal',
  premium: 'Premium',
}

export const themeHeadlines: Record<SchoolTheme, string> = {
  modern: 'Shaping thinkers. Building character.',
  classic: 'Knowledge, character and a life of purpose.',
  international: 'One world. Limitless possibilities.',
  college: 'Ideas that move the world forward.',
  'high-school': 'Own your future.',
  primary: 'Big wonder starts here.',
  religious: 'Faith, wisdom and a life of service.',
  minimal: 'A thoughtful place to learn and grow.',
  premium: 'An education of uncommon distinction.',
}

export interface ThemeConfig {
  id: SchoolTheme
  templateName: string
  schoolName: string
  eyebrow: string
  headline: string
  description: string
  primaryColor: string
  secondaryColor: string
  headerBg: string
  heroImage: string
  announcementText: string
  buttonLabel: string
  fontHeading: string
}

export const THEME_CONFIGS: Record<SchoolTheme, ThemeConfig> = {
  modern: {
    id: 'modern',
    templateName: 'Aster Academy',
    schoolName: 'Aster Academy',
    eyebrow: 'LEARN · LEAD · MAKE A DIFFERENCE',
    headline: 'Shaping thinkers.\nBuilding character.',
    description:
      'A vibrant learning community where every student is known, challenged, and inspired to thrive.',
    primaryColor: '#193b76',
    secondaryColor: '#efb736',
    headerBg: '#193b76',
    heroImage: heroImage,
    announcementText:
      '📢 Admissions open for the 2026–2027 Academic Year · Limited seats available!',
    buttonLabel: 'Discover Northfield',
    fontHeading: "'DM Serif Display', serif",
  },
  classic: {
    id: 'classic',
    templateName: 'Heritage High',
    schoolName: 'Heritage High School',
    eyebrow: 'FOUNDED 1894 · TRADITION OF EXCELLENCE',
    headline: 'Knowledge, character and\na life of purpose.',
    description:
      'A timeless academic institution fostering deep intellect, integrity, and disciplined leadership for generations.',
    primaryColor: '#173d32',
    secondaryColor: '#c6a15b',
    headerBg: '#173d32',
    heroImage:
      'https://images.unsplash.com/photo-1657035008863-eaac81a9b65d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🏛️ Enrolment now open for the centenary academic session · Schedule your campus tour.',
    buttonLabel: 'Explore Heritage',
    fontHeading: 'Georgia, serif',
  },
  international: {
    id: 'international',
    templateName: 'Horizon International',
    schoolName: 'Horizon International Academy',
    eyebrow: 'GLOBAL CITIZENSHIP · IB WORLD SCHOOL',
    headline: 'One world.\nLimitless possibilities.',
    description:
      'Empowering curious minds through multilingual inquiry, global diplomacy, and world-class STEAM innovation.',
    primaryColor: '#075985',
    secondaryColor: '#f97316',
    headerBg: '#075985',
    heroImage: campusImage,
    announcementText:
      '🌍 International Baccalaureate (IB) 2026 Diploma & Middle Years enrolment open!',
    buttonLabel: 'Explore Horizon',
    fontHeading: "'Inter', sans-serif",
  },
  college: {
    id: 'college',
    templateName: 'Scholar Preparatory',
    schoolName: 'Scholar College Preparatory',
    eyebrow: 'INQUIRY · INNOVATION · DISCOVERY',
    headline: 'Ideas that move\nthe world forward.',
    description:
      'Collegiate academic rigor, collegiate research labs, and dedicated mentorship for university excellence.',
    primaryColor: '#3b0764',
    secondaryColor: '#c4b5fd',
    headerBg: '#3b0764',
    heroImage:
      'https://images.unsplash.com/photo-1787401963343-d81b68a5a059?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🎓 Advanced Placement & Pre-Collegiate Honors admissions open for Fall 2026.',
    buttonLabel: 'Academics & Research',
    fontHeading: "'DM Serif Display', serif",
  },
  'high-school': {
    id: 'high-school',
    templateName: 'Momentum High',
    schoolName: 'Momentum High School',
    eyebrow: 'CHAMPIONS IN CLASSROOM & ON THE FIELD',
    headline: 'Own your future.\nMake your mark.',
    description:
      'Uniting championship athletics, rigorous STEM competitions, robotics, and creative arts leadership.',
    primaryColor: '#9f1239',
    secondaryColor: '#fbbf24',
    headerBg: '#9f1239',
    heroImage:
      'https://images.unsplash.com/photo-1780562451592-ffafe674c4fa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🏆 Varsity athletic trials and academic scholarship testing schedules announced!',
    buttonLabel: 'Join Momentum',
    fontHeading: "'Inter', sans-serif",
  },
  primary: {
    id: 'primary',
    templateName: 'Little Oak Academy',
    schoolName: 'Little Oak Academy',
    eyebrow: 'EARLY YEARS & ELEMENTARY EDUCATION',
    headline: 'Big wonder\nstarts here.',
    description:
      'Nurturing boundless curiosity, joyful learning, and kind hearts in a playful, supportive elementary environment.',
    primaryColor: '#047857',
    secondaryColor: '#fbbf24',
    headerBg: '#047857',
    heroImage:
      'https://images.unsplash.com/photo-1769209435699-9cc1fd8e7f57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🌱 Kindergarten & Grade 1-5 admissions are now welcoming prospective young learners.',
    buttonLabel: 'Discover Little Oak',
    fontHeading: "'Inter', sans-serif",
  },
  religious: {
    id: 'religious',
    templateName: 'Covenant Academy',
    schoolName: 'Covenant Christian Academy',
    eyebrow: 'CHARACTER · FAITH · COMMUNITY',
    headline: 'Faith, wisdom and\na life of service.',
    description:
      'A respectful values-led community balancing high intellectual ambition with spiritual formation and ethical service.',
    primaryColor: '#312e81',
    secondaryColor: '#d4af37',
    headerBg: '#312e81',
    heroImage:
      'https://images.unsplash.com/photo-1656772133661-644caa299e8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=82&w=1600',
    announcementText:
      '⛪ Faith & Scholarship Open House scheduled for Saturday · Register online.',
    buttonLabel: 'Our Mission & Faith',
    fontHeading: 'Georgia, serif',
  },
  minimal: {
    id: 'minimal',
    templateName: 'Clarity Commons',
    schoolName: 'Clarity Learning Commons',
    eyebrow: 'SIMPLICITY · FOCUS · MINDFULNESS',
    headline: 'A thoughtful place\nto learn and grow.',
    description:
      'A serene, distraction-free environment dedicated to deep mastery, critical inquiry, and independent research.',
    primaryColor: '#171717',
    secondaryColor: '#d8ff52',
    headerBg: '#ffffff',
    heroImage: interiorImage,
    announcementText:
      '🕊️ Admissions open for self-directed and mindful academic learning cohorts.',
    buttonLabel: 'Explore Clarity',
    fontHeading: "'Inter', sans-serif",
  },
  premium: {
    id: 'premium',
    templateName: 'Élan Academy',
    schoolName: 'Élan Academy of Distinguished Scholars',
    eyebrow: 'PRESTIGE · INTEGRITY · DISTINCTION',
    headline: 'An education of\nuncommon distinction.',
    description:
      'An elevated, bespoke academic sanctuary shaping world diplomats, scientific pioneers, and visionary artists.',
    primaryColor: '#0b0f18',
    secondaryColor: '#b68b4c',
    headerBg: '#0b0f18',
    heroImage:
      'https://images.unsplash.com/photo-1782080226307-c13e13acf62d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1600',
    announcementText:
      '✨ Private campus tours and selective admissions interviews are now open by appointment.',
    buttonLabel: 'Enter Élan Academy',
    fontHeading: "'DM Serif Display', serif",
  },
}
