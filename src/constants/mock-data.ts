import { campusImage, heroImage, interiorImage } from '@/config/templates'
import type { ActivityItem, MetricItem } from '@/types/studio'

export const tableRows: Record<string, string[][]> = {
  pages: [
    ['Home', '/', 'Published', 'Updated 24 min ago'],
    ['About Us', '/about', 'Published', 'Updated yesterday'],
    ['Academics', '/academics', 'Published', 'Updated May 10'],
    ['Admissions', '/admissions', 'Draft', 'Updated May 9'],
    ['Teachers', '/teachers', 'Published', 'Updated May 7'],
    ['Contact Us', '/contact', 'Published', 'Updated Apr 28'],
  ],
  teachers: [
    ['Dr. Farhana Noor', 'Principal', 'Leadership', 'Published'],
    ['Mahmud Karim', 'Head of Science', 'Science', 'Published'],
    ['Sara Jahan', 'Senior Teacher', 'English', 'Published'],
    ['Nabil Chowdhury', 'Teacher', 'Mathematics', 'Draft'],
    ['Nusrat Ahmed', 'Counselor', 'Student Support', 'Published'],
  ],
  notices: [
    ['Summer schedule and office hours', 'General', 'May 12, 2025', 'Published'],
    ['Science Fair registration', 'Academic', 'May 10, 2025', 'Published'],
    ['Parent–teacher meetings', 'Parents', 'May 8, 2025', 'Draft'],
    ['Annual sports day notice', 'Activities', 'May 2, 2025', 'Expired'],
  ],
  events: [
    ['Inter-school Science Fair', 'May 18, 2025', 'Main Auditorium', 'Published'],
    ['Spring Music Evening', 'May 22, 2025', 'Performing Arts Hall', 'Published'],
    ['Parent Orientation', 'Jun 2, 2025', 'Conference Center', 'Draft'],
    ['Graduation Ceremony', 'Jun 15, 2025', 'School Grounds', 'Published'],
  ],
}

export const overviewMetrics: MetricItem[] = [
  { label: 'Total visitors', value: '12,842', change: '+18.4%', icon: 'users', tone: 'blue' },
  { label: 'Page views', value: '34,291', change: '+12.8%', icon: 'eye', tone: 'violet' },
  { label: 'Published pages', value: '18', detail: '2 drafts', icon: 'file', tone: 'green' },
  { label: 'Upcoming events', value: '6', detail: 'Next: May 18', icon: 'calendar', tone: 'orange' },
]

export const overviewActivities: ActivityItem[] = [
  { initials: 'AR', title: 'Homepage hero updated', detail: 'Amina Rahman · 24 min ago', tone: 'blue' },
  { initials: 'MK', title: 'New notice published', detail: 'Mahmud Karim · 2 hrs ago', tone: 'green' },
  { initials: 'AR', title: 'Science Fair 2025 added', detail: 'Amina Rahman · Yesterday', tone: 'orange' },
  { initials: 'SJ', title: 'Teacher profile updated', detail: 'Sara Jahan · Yesterday', tone: 'violet' },
]

export const mediaItems: [string, string, string][] = [
  [heroImage, 'school-campus-hero.jpg', '2.4 MB'],
  [campusImage, 'northfield-courtyard.jpg', '1.8 MB'],
  [interiorImage, 'learning-commons.jpg', '1.2 MB'],
  ['', 'admission-guide-2025.pdf', '840 KB'],
  ['', 'school-calendar.pdf', '420 KB'],
  [
    'https://images.unsplash.com/photo-1787401963343-d81b68a5a059?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=500',
    'science-building.jpg',
    '1.6 MB',
  ],
]

export const albumItems = [
  ['Campus life', heroImage, '42 photos'],
  ['Science Fair 2025', campusImage, '28 photos'],
  ['Arts & culture', interiorImage, '34 photos'],
  [
    'Sports Day',
    'https://images.unsplash.com/photo-1769209435699-9cc1fd8e7f57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=600',
    '51 photos',
  ],
] as const

export const academicCards = [
  ['Academic programs', '3', 'Primary, Middle and Senior School'],
  ['Classes & grades', '12', 'Grades 1 through 12'],
  ['Subjects', '28', 'Across all academic levels'],
  ['Facilities', '14', 'Labs, library, arts and sports'],
  ['Achievements', '36', 'Academic and co-curricular awards'],
] as const

export const contentItems = [
  ['School information', 'Core identity, contact details, logo and address', '100%'],
  ['About school', 'History, mission, vision and educational values', '92%'],
  ['Principal message', 'Public welcome message and principal profile', '100%'],
  ['Academic information', 'Curriculum, teaching approach and school calendar', '78%'],
  ['Classes and grades', 'Grade levels, sections and enrollment information', '85%'],
  ['Subjects', 'Subject catalog organized by grade and program', '64%'],
  ['Facilities', 'Campus facilities and approved public details', '90%'],
  ['Achievements', 'Awards, distinctions and school milestones', '72%'],
] as const

export const navigationMenu = [
  'Home',
  'About Us',
  'Academics',
  'Teachers',
  'Admissions',
  'Notices',
  'Events',
  'Gallery',
  'Contact Us',
] as const

export const syncHistory = [
  ['ERP automatic sync', '36 records reviewed', 'Success · 12 min ago'],
  ['Admission API health check', 'Gateway responded in 142 ms', 'Healthy · 2 hrs ago'],
  ['ERP teacher import', '3 records awaiting approval', 'Review needed · Yesterday'],
] as const

export const settingsUsers = [
  ['AR', 'Amina Rahman', 'admin@northfield.edu', 'Owner', 'Active'],
  ['MK', 'Mahmud Karim', 'mahmud@northfield.edu', 'Editor', 'Active'],
  ['SJ', 'Sara Jahan', 'sara@northfield.edu', 'Content manager', 'Active'],
  ['TN', 'Tanvir Noor', 'tanvir@northfield.edu', 'Analyst', 'Pending'],
] as const

export const publicPagesContent: Record<string, { kicker: string; title: string; intro: string }> = {
  'About School': {
    kicker: 'OUR STORY',
    title: 'A school built around possibility.',
    intro:
      'For more than four decades, Northfield has combined academic ambition with a culture of care, belonging, and purposeful growth.',
  },
  'Principal’s Message': {
    kicker: 'FROM OUR PRINCIPAL',
    title: 'Every learner deserves to be truly known.',
    intro:
      'Welcome to a community where achievement and character grow together, and where every student is encouraged to contribute with confidence.',
  },
  'Academic Programs': {
    kicker: 'ACADEMIC JOURNEY',
    title: 'Learning designed for every stage.',
    intro:
      'A coherent journey from strong foundations to confident independence, shaped by inquiry, challenge, and meaningful real-world connections.',
  },
  'Classes & Grades': {
    kicker: 'GRADES 1–12',
    title: 'A connected path through school.',
    intro:
      'Explore each grade level, learning priorities, subjects, and the milestones that guide students forward.',
  },
  'Teachers & Faculty': {
    kicker: 'OUR PEOPLE',
    title: 'Educators who see the whole child.',
    intro:
      'Experienced teachers, mentors, and leaders working together to help every student feel known, supported, and challenged.',
  },
  'Teacher Profile': {
    kicker: 'FACULTY PROFILE',
    title: 'Mahmud Karim',
    intro: 'Head of Science · M.Sc. in Physics · 14 years of teaching experience',
  },
  Facilities: {
    kicker: 'CAMPUS LIFE',
    title: 'Spaces made for discovery.',
    intro:
      'Purpose-built learning environments support science, technology, creativity, performance, wellbeing, and play.',
  },
  Notices: {
    kicker: 'SCHOOL UPDATES',
    title: 'Latest notices.',
    intro:
      'Important updates, schedules, announcements, and documents for students and families.',
  },
  'Notice Details': {
    kicker: 'ACADEMIC NOTICE',
    title: 'Science Fair registration is now open.',
    intro: 'Published 10 May 2025 · Registration closes 16 May 2025',
  },
  Events: {
    kicker: 'WHAT’S ON',
    title: 'Events that bring us together.',
    intro:
      'Discover upcoming celebrations, performances, competitions, and community gatherings.',
  },
  'Event Details': {
    kicker: '18 MAY 2025',
    title: 'Inter-school Science Fair 2025',
    intro: 'Main Auditorium · 9:00 AM–4:00 PM · Open to the Northfield community',
  },
  'Photo Gallery': {
    kicker: 'SCHOOL GALLERY',
    title: 'Moments from Northfield.',
    intro:
      'A glimpse into learning, friendship, creativity, competition, and everyday life across our campus.',
  },
  'Gallery Album': {
    kicker: '42 PHOTOS',
    title: 'Campus life.',
    intro:
      'Everyday moments from classrooms, shared spaces, clubs, and the wider Northfield community.',
  },
  'Admission Information': {
    kicker: 'ADMISSIONS 2025–26',
    title: 'Your Northfield journey starts here.',
    intro:
      'Explore eligibility, key dates, and the application process before continuing securely to our existing admissions portal.',
  },
  'Contact Us': {
    kicker: 'GET IN TOUCH',
    title: 'We would love to hear from you.',
    intro:
      'Contact our school office, arrange a visit, or find the right person to answer your question.',
  },
  'Search Results': {
    kicker: 'SEARCH',
    title: 'Results for “admissions”',
    intro: '8 results found across pages, notices, events, and documents.',
  },
}
