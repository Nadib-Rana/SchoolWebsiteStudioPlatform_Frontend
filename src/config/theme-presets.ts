import type { SchoolTheme } from '@/types/theme'
import { campusImage, heroImage, interiorImage } from '@/config/templates'

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
    eyebrow: 'RIGOR · SCHOLARSHIP · LEADERSHIP',
    headline: 'Ideas that move the\nworld forward.',
    description:
      'A collegiate atmosphere combining high expectations, peer scholarship, and university preparation.',
    primaryColor: '#581c87',
    secondaryColor: '#10b981',
    headerBg: '#581c87',
    heroImage: interiorImage,
    announcementText:
      '🎓 University admissions seminar & AP orientation this Saturday at 10 AM.',
    buttonLabel: 'Visit Campus',
    fontHeading: "'Playfair Display', serif",
  },
  'high-school': {
    id: 'high-school',
    templateName: 'Metro High School',
    schoolName: 'Metro High School',
    eyebrow: 'CONFIDENCE · CHARACTER · COMMUNITY',
    headline: 'Own your future.',
    description:
      'Dynamic college-prep, competitive athletics, and arts academies for aspiring young adults.',
    primaryColor: '#991b1b',
    secondaryColor: '#eab308',
    headerBg: '#991b1b',
    heroImage:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🏀 Metro Varsity takes the regional championship! Spirit wear available in the bookstore.',
    buttonLabel: 'Student Life',
    fontHeading: "'Montserrat', sans-serif",
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
    headerBg: '#ffffff',
    heroImage:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🌱 Kindergarten & Grade 1–5 admissions are now welcoming prospective young learners. Apply now →',
    buttonLabel: 'Discover Little Oak',
    fontHeading: "'Plus Jakarta Sans', sans-serif",
  },
  religious: {
    id: 'religious',
    templateName: 'St. Jude Grammar',
    schoolName: 'St. Jude Grammar School',
    eyebrow: 'FAITH · INTEGRITY · SCHOLARSHIP',
    headline: 'Faith, wisdom and\na life of service.',
    description:
      'Instilling moral strength, spiritual depth, and rigorous academic foundations for life.',
    primaryColor: '#312e81',
    secondaryColor: '#e0e7ff',
    headerBg: '#312e81',
    heroImage:
      'https://images.unsplash.com/photo-1548625361-195fe578cb26?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🕊️ Annual Community Service Day & Family Chapel this Sunday. All families welcome.',
    buttonLabel: 'Our Mission',
    fontHeading: "'Cinzel', serif",
  },
  minimal: {
    id: 'minimal',
    templateName: 'Studio Nordic',
    schoolName: 'Nordic School of Thought',
    eyebrow: 'PURPOSE · DESIGN · MINDFULNESS',
    headline: 'A thoughtful place to\nlearn and grow.',
    description:
      'Clean typography, calm aesthetics, and deep focus. Education distilled to what matters most.',
    primaryColor: '#18181b',
    secondaryColor: '#71717a',
    headerBg: '#18181b',
    heroImage:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '🌿 Spring term elective course registrations open for enrolled students.',
    buttonLabel: 'Learn More',
    fontHeading: "'Space Grotesk', sans-serif",
  },
  premium: {
    id: 'premium',
    templateName: 'The Royal Collegiate',
    schoolName: 'The Royal Collegiate',
    eyebrow: 'ESTABLISHED 1842 · HERITAGE & DISTINCTION',
    headline: 'An education of\nuncommon distinction.',
    description:
      'Pre-eminent boarding and day school preparing tomorrow’s global scholars, diplomats, and innovators.',
    primaryColor: '#0f172a',
    secondaryColor: '#d4af37',
    headerBg: '#0f172a',
    heroImage:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600',
    announcementText:
      '⚜️ The Headmaster’s Scholarship applications close 30 April for the upcoming Michaelmas term.',
    buttonLabel: 'Request Prospectus',
    fontHeading: "'Cormorant Garamond', serif",
  },
}
