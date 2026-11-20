import type { View } from '@/types/studio'

export type HelpLang = 'en' | 'bn'

export type HelpCategory =
  | 'getting-started'
  | 'content'
  | 'admissions-erp'
  | 'publish-governance'

export type StudioRole =
  | 'OWNER'
  | 'ADMIN'
  | 'EDITOR'
  | 'CONTENT_MANAGER'
  | 'ANALYST'

export interface BilingualText {
  en: string
  bn: string
}

export interface HelpStep {
  title: BilingualText
  detail: BilingualText
  tip?: BilingualText
}

export interface HelpGuide {
  id: string
  view: View
  category: HelpCategory
  estimatedTime: string
  roles: StudioRole[]
  title: BilingualText
  summary: BilingualText
  steps: HelpStep[]
  troubleshooting?: Array<{
    q: BilingualText
    a: BilingualText
  }>
  shortcuts?: Array<{ keys: string; label: BilingualText }>
}

export const HELP_CATEGORIES: Array<{
  id: HelpCategory | 'all'
  label: BilingualText
}> = [
  { id: 'all', label: { en: 'All Guides', bn: 'সব গাইড' } },
  {
    id: 'getting-started',
    label: { en: 'Getting Started & Design', bn: 'শুরু ও ডিজাইন' },
  },
  {
    id: 'content',
    label: { en: 'Content & Academics', bn: 'কন্টেন্ট ও একাডেমিকস' },
  },
  {
    id: 'admissions-erp',
    label: { en: 'Admissions, CRM & ERP', bn: 'অ্যাডমিশন, CRM ও ERP' },
  },
  {
    id: 'publish-governance',
    label: { en: 'Publish, SEO & Settings', bn: 'পাবলিশ, SEO ও সেটিংস' },
  },
]

export const QUICK_START_CHECKLIST: Array<{
  id: string
  targetView: View
  title: BilingualText
  detail: BilingualText
}> = [
  {
    id: 'pick-template',
    targetView: 'templates',
    title: { en: '1. Choose a School Template', bn: '১. স্কুলের টেমপ্লেট পছন্দ করুন' },
    detail: {
      en: 'Pick a modern or traditional school layout from the Design Library.',
      bn: 'Design Library থেকে আপনার স্কুলের জন্য উপযুক্ত টেমপ্লেট সিলেক্ট করুন।',
    },
  },
  {
    id: 'customize-theme',
    targetView: 'theme',
    title: { en: '2. Set Brand Colors & Fonts', bn: '২. স্কুলের ব্র্যান্ড কালার ও ফন্ট সেট করুন' },
    detail: {
      en: 'Match your school primary color, accent color, and typography.',
      bn: 'স্কুলের প্রাইমারি কালার, সেকেন্ডারি কালার এবং ফন্ট কাস্টমাইজ করুন।',
    },
  },
  {
    id: 'update-content',
    targetView: 'content',
    title: { en: '3. Update School Profile & Faculty', bn: '৩. স্কুলের তথ্য ও টিচার প্রোফাইল যোগ করুন' },
    detail: {
      en: 'Add motto, principal message, address, phone, teachers, and notices.',
      bn: 'স্কুলের ঠিকানা, ফোন, প্রিন্সিপালের বাণী, টিচার এবং নোটিশ আপডেট করুন।',
    },
  },
  {
    id: 'connect-erp',
    targetView: 'integrations',
    title: { en: '4. Connect School ERP (Optional)', bn: '৪. School ERP কানেক্ট করুন (ঐচ্ছিক)' },
    detail: {
      en: 'Paste your ERP Base URL & x-website-key for live admissions and alumni verify.',
      bn: 'লাইভ অ্যাডমিশন ও Alumni Verify-এর জন্য ERP URL ও x-website-key যুক্ত করুন।',
    },
  },
  {
    id: 'publish-live',
    targetView: 'publishing',
    title: { en: '5. Publish Website Live', bn: '৫. ওয়েবসাইট লাইভ পাবলিশ করুন' },
    detail: {
      en: 'Click Publish in the topbar or Publishing screen to push changes live instantly.',
      bn: 'টপবারের Publish বা Publishing পেজ থেকে ওয়েবসাইট সাথে সাথে লাইভ করুন।',
    },
  },
]

const ALL_ROLES: StudioRole[] = [
  'OWNER',
  'ADMIN',
  'EDITOR',
  'CONTENT_MANAGER',
  'ANALYST',
]
const EDIT_ROLES: StudioRole[] = ['OWNER', 'ADMIN', 'EDITOR', 'CONTENT_MANAGER']
const ADMIN_ROLES: StudioRole[] = ['OWNER', 'ADMIN']

export const HELP_GUIDES: HelpGuide[] = [
  {
    id: 'overview',
    view: 'overview',
    category: 'getting-started',
    estimatedTime: '1 min',
    roles: ALL_ROLES,
    title: { en: 'Studio Overview & Dashboard', bn: 'স্টুডিও ওভারভিউ ও ড্যাশবোর্ড' },
    summary: {
      en: 'Monitor website live status, quick metrics, recent activity, and jump into common actions.',
      bn: 'ওয়েবসাইটের লাইভ স্ট্যাটাস, ভিজিটর মেট্রিকস এবং সাম্প্রতিক কার্যক্রম এক নজরে দেখুন।',
    },
    steps: [
      {
        title: { en: 'Check live status in the top bar', bn: 'টপবারে লাইভ স্ট্যাটাস দেখুন' },
        detail: {
          en: 'A green dot indicates your school website is live. Click "View Live Site" anytime to open your public URL.',
          bn: 'সবুজ ডট মানে আপনার স্কুলের ওয়েবসাইট লাইভ আছে। "View Live Site" ক্লিক করে পাবলিক সাইট দেখতে পারবেন।',
        },
      },
      {
        title: { en: 'Switch between schools (Multi-Tenant)', bn: 'একাধিক স্কুল সুইচ করুন' },
        detail: {
          en: 'If your account manages multiple schools, use the school switcher in the sidebar to change active workspace.',
          bn: 'আপনার অ্যাকাউন্টে একাধিক স্কুল থাকলে সাইডবারের স্কুল সুইচার থেকে অ্যাক্টিভ স্কুল পরিবর্তন করতে পারবেন।',
        },
      },
      {
        title: { en: 'Use Shift + ? anywhere for instant help', bn: 'যেকোনো পেজে Shift + ? চাপুন' },
        detail: {
          en: 'Press Shift + ? on any screen to open step-by-step instructions tailored to that exact page.',
          bn: 'যেকোনো পেজে থাকাকালীন Shift + ? চাপলে ওই পেজের তাৎক্ষণিক গাইড খুলে যাবে।',
        },
      },
    ],
  },
  {
    id: 'templates',
    view: 'templates',
    category: 'getting-started',
    estimatedTime: '2 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Design Library & Templates', bn: 'ডিজাইন লাইব্রেরি ও টেমপ্লেট' },
    summary: {
      en: 'Switch between ready-made school website designs without losing your notices, teachers, or pages.',
      bn: 'আপনার কনটেন্ট না হারিয়েই রেডিমেড স্কুল টেমপ্লেট পরিবর্তন করুন।',
    },
    steps: [
      {
        title: { en: 'Filter or search templates', bn: 'টেমপ্লেট ফিল্টার বা সার্চ করুন' },
        detail: {
          en: 'Use category tabs (Modern, Traditional, International, College, etc.) and toggle Desktop/Mobile preview.',
          bn: 'ক্যাটাগরি ট্যাব (Modern, Traditional, College ইত্যাদি) এবং Desktop/Mobile প্রিভিউ দিয়ে টেমপ্লেট দেখুন।',
        },
      },
      {
        title: { en: 'Apply a template to the Website Builder', bn: 'টেমপ্লেট অ্যাপ্লাই করুন' },
        detail: {
          en: 'Click "Use template" to stage the template colors and layout into your Website Builder draft.',
          bn: '"Use template" ক্লিক করলে টেমপ্লেটের কালার ও লেআউট Website Builder-এ ড্রাফট হিসেবে সেট হবে।',
        },
      },
      {
        title: { en: 'Save & Publish to make it live', bn: 'Save ও Publish করে লাইভ করুন' },
        detail: {
          en: 'After reviewing in Builder, click "Save draft" and then click the topbar "Publish" button so visitors see the new look immediately.',
          bn: 'Builder-এ দেখে "Save draft" করুন এবং টপবারের "Publish" বাটনে ক্লিক করলে সাথে সাথে লাইভ সাইটে আপডেট হয়ে যাবে।',
        },
        tip: {
          en: 'Your teachers, notices, events, and admission records remain untouched when switching templates.',
          bn: 'টেমপ্লেট পাল্টালেও আপনার টিচার, নোটিশ, ইভেন্ট ও অ্যাডমিশন ডেটা নিরাপদ থাকে।',
        },
      },
    ],
  },
  {
    id: 'builder',
    view: 'builder',
    category: 'getting-started',
    estimatedTime: '5 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Visual Website Builder', bn: 'ভিজ্যুয়াল ওয়েবসাইট বিল্ডার' },
    summary: {
      en: 'Edit homepage hero text, announcement bar, principal message, stats, and custom sections visually.',
      bn: 'হোমপেজের হিরো ব্যানার, অ্যানাউন্সমেন্ট বার, প্রিন্সিপালের বাণী ও সেকশন ভিজ্যুয়ালি এডিট করুন।',
    },
    steps: [
      {
        title: { en: 'Select any section on the canvas or left list', bn: 'যেকোনো সেকশন সিলেক্ট করুন' },
        detail: {
          en: 'Click a section (Announcement, Hero, Principal, Stats, Gallery, Footer) to open its properties on the right panel.',
          bn: 'বাম পাশের তালিকা বা ক্যানভাসে যেকোনো সেকশনে ক্লিক করলে ডান পাশে এডিট প্যানেল খুলবে।',
        },
      },
      {
        title: { en: 'Customize content, background, and visibility', bn: 'টেক্সট, ছবি ও স্টাইল পরিবর্তন করুন' },
        detail: {
          en: 'Update headings, button labels, hero banner images, or toggle section visibility. Use Undo/Redo anytime.',
          bn: 'হেডিং, বাটন টেক্সট, হিরো ইমেজ পরিবর্তন করুন এবং প্রয়োজনে Undo/Redo ব্যবহার করুন।',
        },
      },
      {
        title: { en: 'Click "Save draft" then "Publish"', bn: '"Save draft" এবং পরে "Publish" ক্লিক করুন' },
        detail: {
          en: 'Click "Save draft" in the Builder toolbar to persist sections to the database, then click topbar "Publish" to refresh the live site.',
          bn: 'বিল্ডার টুলবারের "Save draft" ক্লিক করে ডাটাবেজে সেভ করুন, তারপর টপবারের "Publish" বাটনে ক্লিক করে লাইভ করুন।',
        },
      },
    ],
  },
  {
    id: 'theme',
    view: 'theme',
    category: 'getting-started',
    estimatedTime: '2 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Theme Customization', bn: 'থিম কাস্টমাইজেশন' },
    summary: {
      en: 'Customize primary/secondary brand colors, heading & body fonts, button shapes, and header layout.',
      bn: 'স্কুলের প্রাইমারি/সেকেন্ডারি কালার, ফন্ট, বাটন স্টাইল ও হেডার লেআউট সেট করুন।',
    },
    steps: [
      {
        title: { en: 'Pick your school brand colors', bn: 'স্কুলের ব্র্যান্ড কালার বেছে নিন' },
        detail: {
          en: 'Set Primary Color (used in header, buttons, and footer) and Secondary Accent Color. Preview live on Desktop, Tablet, or Mobile.',
          bn: 'Primary Color (হেডার, বাটন ও ফুটারে ব্যবহৃত) ও Secondary Color সিলেক্ট করে লাইভ প্রিভিউ দেখুন।',
        },
      },
      {
        title: { en: 'Choose typography & button radius', bn: 'ফন্ট ও বাটন স্টাইল সিলেক্ট করুন' },
        detail: {
          en: 'Select heading/body fonts and button style (Rounded, Pill, or Square).',
          bn: 'হেডিং ও বডি ফন্ট এবং বাটন শেপ (Rounded, Pill বা Square) পছন্দ করুন।',
        },
      },
      {
        title: { en: 'Save draft or Publish changes directly', bn: 'ড্রাফট সেভ বা সরাসরি পাবলিশ করুন' },
        detail: {
          en: 'Click "Save draft" to review later, or "Publish changes" to apply immediately to your live school website.',
          bn: 'পরে রিভিউ করতে "Save draft" অথবা সাথে সাথে লাইভ করতে "Publish changes" ক্লিক করুন।',
        },
      },
    ],
    troubleshooting: [
      {
        q: { en: 'Why did my color change not appear on the live site?', bn: 'কালার চেঞ্জ করার পর লাইভ সাইটে দেখা যাচ্ছে না কেন?' },
        a: {
          en: 'Make sure you clicked "Publish changes" (not only "Save draft"). Draft changes stay private until published.',
          bn: 'নিশ্চিত হন আপনি "Save draft"-এর বদলে "Publish changes" (বা টপবারের Publish) ক্লিক করেছেন।',
        },
      },
    ],
  },
  {
    id: 'pages',
    view: 'pages',
    category: 'content',
    estimatedTime: '3 min',
    roles: EDIT_ROLES,
    title: { en: 'Pages Management', bn: 'পেজ ম্যানেজমেন্ট' },
    summary: {
      en: 'Create, organize, draft, and publish pages on your school website.',
      bn: 'স্কুল ওয়েবসাইটের সব পেজ তৈরি, সাজানো ও পাবলিশ করুন।',
    },
    steps: [
      {
        title: { en: 'Create a new page', bn: 'নতুন পেজ তৈরি করুন' },
        detail: {
          en: 'Click "New page", enter title, URL slug, and meta description, then choose Draft or Published status.',
          bn: '"New page" ক্লিক করে টাইটেল, URL স্লাগ ও বিবরণ দিন এবং Draft বা Published সিলেক্ট করুন।',
        },
      },
      {
        title: { en: 'Link page in Navigation', bn: 'নেভিগেশন মেনুতে যুক্ত করুন' },
        detail: {
          en: 'Open the Navigation screen to add your new page to the website Header or Footer menu.',
          bn: 'নতুন পেজটি হেডার বা ফুটার মেনুতে দেখাতে Navigation স্ক্রিনে গিয়ে যুক্ত করুন।',
        },
      },
    ],
  },
  {
    id: 'content',
    view: 'content',
    category: 'content',
    estimatedTime: '3 min',
    roles: EDIT_ROLES,
    title: { en: 'School Profile & Core Content', bn: 'স্কুল প্রোফাইল ও মূল তথ্য' },
    summary: {
      en: 'Maintain school motto, mission/vision, principal bio, office hours, contact info, and social links.',
      bn: 'স্কুলের মোটো, মিশন/ভিশন, প্রিন্সিপালের বাণী, অফিস সময় ও যোগাযোগের তথ্য আপডেট করুন।',
    },
    steps: [
      {
        title: { en: 'Fill institutional details', bn: 'প্রতিষ্ঠানের তথ্য পূরণ করুন' },
        detail: {
          en: 'Update established year, motto, short bio, vision, and mission statements.',
          bn: 'প্রতিষ্ঠার সাল, মোটো, সংক্ষিপ্ত বিবরণ, ভিশন ও মিশন আপডেট করুন।',
        },
      },
      {
        title: { en: 'Update contact & principal profile', bn: 'যোগাযোগ ও প্রিন্সিপালের তথ্য দিন' },
        detail: {
          en: 'Keep address, phone, email, and office hours accurate — they appear automatically in your public header, footer, and Contact page.',
          bn: 'ঠিকানা, ফোন, ইমেইল ও অফিস সময় ঠিক রাখুন—এগুলো অটোমেটিক পাবলিক ফুটার ও Contact পেজে দেখাবে।',
        },
      },
    ],
  },
  {
    id: 'teachers',
    view: 'teachers',
    category: 'content',
    estimatedTime: '2 min',
    roles: EDIT_ROLES,
    title: { en: 'Teachers & Faculty Directory', bn: 'টিচার ও ফ্যাকাল্টি ডিরেক্টরি' },
    summary: {
      en: 'Add faculty profiles manually or auto-sync PII-safe teacher profiles from your connected School ERP.',
      bn: 'ম্যানুয়ালি টিচার যোগ করুন অথবা কানেক্টেড School ERP থেকে অটোমেটিক সিঙ্ক করুন।',
    },
    steps: [
      {
        title: { en: 'Add or edit a teacher', bn: 'টিচার যোগ বা এডিট করুন' },
        detail: {
          en: 'Click "Add teacher" and enter name, designation, department, qualification, photo, and bio.',
          bn: '"Add teacher" ক্লিক করে নাম, পদবি, ডিপার্টমেন্ট, যোগ্যতা, ছবি ও বায়ো দিন।',
        },
      },
      {
        title: { en: 'Auto-sync from School ERP', bn: 'ERP থেকে অটো-সিঙ্ক করুন' },
        detail: {
          en: 'If School ERP is connected in Integrations, clicking "Sync ERP now" automatically imports and updates active faculty profiles.',
          bn: 'Integrations-এ School ERP কানেক্ট থাকলে "Sync ERP now" ক্লিক করলেই টিচার লিস্ট অটো সিঙ্ক হয়ে যাবে।',
        },
      },
    ],
  },
  {
    id: 'academics',
    view: 'academics',
    category: 'content',
    estimatedTime: '3 min',
    roles: EDIT_ROLES,
    title: { en: 'Academic Programs & Facilities', bn: 'একাডেমিক প্রোগ্রাম ও ফ্যাসিলিটিজ' },
    summary: {
      en: 'Showcase academic divisions, curriculum highlights, labs, library, and student achievements.',
      bn: 'একাডেমিক বিভাগ, কারিকুলাম, ল্যাব, লাইব্রেরি ও শিক্ষার্থীদের অর্জন তুলে ধরুন।',
    },
    steps: [
      {
        title: { en: 'Add programs and facilities', bn: 'প্রোগ্রাম ও ফ্যাসিলিটি যোগ করুন' },
        detail: {
          en: 'Organize Primary, Secondary, and Higher Secondary programs along with campus facilities.',
          bn: 'প্রাইমারি, সেকেন্ডারি ও কলেজ প্রোগ্রাম এবং ক্যাম্পাসের সুযোগ-সুবিধা যুক্ত করুন।',
        },
      },
      {
        title: { en: 'Save changes to update /academics page', bn: 'সেভ করে /academics পেজ আপডেট করুন' },
        detail: {
          en: 'Saved academic data renders automatically on your public Academics page.',
          bn: 'সেভ করা তথ্য আপনার পাবলিক Academics পেজে অটোমেটিক প্রদর্শিত হবে।',
        },
      },
    ],
  },
  {
    id: 'notices',
    view: 'notices',
    category: 'content',
    estimatedTime: '2 min',
    roles: EDIT_ROLES,
    title: { en: 'Notices & Circulars', bn: 'নোটিশ ও সার্কুলার' },
    summary: {
      en: 'Publish urgent notices, exam routines, PDF attachments, and pinned announcements.',
      bn: 'জরুরি নোটিশ, পরীক্ষার রুটিন, PDF ফাইল এবং পিন করা ঘোষণা প্রকাশ করুন।',
    },
    steps: [
      {
        title: { en: 'Create a notice', bn: 'নতুন নোটিশ তৈরি করুন' },
        detail: {
          en: 'Click "Create notice", add title, category, description, optional PDF/image attachment, and set priority.',
          bn: '"Create notice" ক্লিক করে শিরোনাম, ক্যাটাগরি, বিস্তারিত ও প্রয়োজনীয় PDF ফাইল যুক্ত করুন।',
        },
      },
      {
        title: { en: 'Pin important circulars', bn: 'গুরুত্বপূর্ণ নোটিশ পিন করুন' },
        detail: {
          en: 'Enable "Pinned" to keep critical notices (like Admission Open or Exam Schedule) at the top of the public notice board.',
          bn: 'ভর্তি বা পরীক্ষার রুটিনের মতো জরুরি নোটিশ সবার উপরে রাখতে "Pinned" চালু করুন।',
        },
      },
    ],
  },
  {
    id: 'events',
    view: 'events',
    category: 'content',
    estimatedTime: '2 min',
    roles: EDIT_ROLES,
    title: { en: 'School Events Calendar', bn: 'স্কুল ইভেন্ট ক্যালেন্ডার' },
    summary: {
      en: 'Schedule and showcase annual sports, parent-teacher meetings, cultural programs, and seminars.',
      bn: 'বার্ষিক ক্রীড়া, অভিভাবক সমাবেশ, সাংস্কৃতিক অনুষ্ঠান ও সেমিনার যোগ করুন।',
    },
    steps: [
      {
        title: { en: 'Create an event', bn: 'ইভেন্ট তৈরি করুন' },
        detail: {
          en: 'Click "Create event" and set title, date, time, venue, category, and optional banner image.',
          bn: '"Create event" ক্লিক করে শিরোনাম, তারিখ, সময়, ভেন্যু ও ব্যানার ছবি যুক্ত করুন।',
        },
      },
      {
        title: { en: 'Publish to Events page & Homepage', bn: 'ইভেন্ট পাবলিশ করুন' },
        detail: {
          en: 'Published upcoming events appear automatically on both the Homepage and Events directory.',
          bn: 'পাবলিশ করা ইভেন্টগুলো হোমপেজ ও Events পেজে অটোমেটিক দেখাবে।',
        },
      },
    ],
  },
  {
    id: 'gallery',
    view: 'gallery',
    category: 'content',
    estimatedTime: '2 min',
    roles: EDIT_ROLES,
    title: { en: 'Photo Gallery & Albums', bn: 'ফটো গ্যালারি ও অ্যালবাম' },
    summary: {
      en: 'Create photo albums for campus life, graduation, science fairs, and sports days.',
      bn: 'ক্যাম্পাস লাইফ, বিজ্ঞান মেলা ও অনুষ্ঠানের ছবির অ্যালবাম তৈরি করুন।',
    },
    steps: [
      {
        title: { en: 'Create an album', bn: 'অ্যালবাম তৈরি করুন' },
        detail: {
          en: 'Click "Create album", set a title, category, and cover photo.',
          bn: '"Create album" ক্লিক করে নাম, ক্যাটাগরি ও কভার ছবি দিন।',
        },
      },
      {
        title: { en: 'Upload photos with captions', bn: 'ক্যাপশনসহ ছবি আপলোড করুন' },
        detail: {
          en: 'Add multiple photos to the album; they are automatically optimized for the public gallery lightbox.',
          bn: 'অ্যালবামে একাধিক ছবি যোগ করুন—পাবলিক গ্যালারিতে সুন্দরভাবে প্রদর্শিত হবে।',
        },
      },
    ],
  },
  {
    id: 'media',
    view: 'media',
    category: 'content',
    estimatedTime: '1 min',
    roles: EDIT_ROLES,
    title: { en: 'Media Library', bn: 'মিডিয়া লাইব্রেরি' },
    summary: {
      en: 'Central storage for school logos, hero banners, teacher photos, and PDF circulars.',
      bn: 'স্কুলের লোগো, ব্যানার, টিচারের ছবি এবং PDF ডকুমেন্ট এক জায়গায় সংরক্ষণ করুন।',
    },
    steps: [
      {
        title: { en: 'Upload files', bn: 'ফাইল আপলোড করুন' },
        detail: {
          en: 'Click "Upload media" to store images or PDFs securely in your school storage bucket.',
          bn: '"Upload media" ক্লিক করে ছবি বা PDF ফাইল আপলোড করুন।',
        },
      },
      {
        title: { en: 'Copy URL to reuse anywhere', bn: 'URL কপি করে ব্যবহার করুন' },
        detail: {
          en: 'Copy any uploaded asset URL to reuse in Builder banners, Notices, or Teachers.',
          bn: 'আপলোড করা ফাইলের URL কপি করে বিল্ডার, নোটিশ বা টিচার প্রোফাইলে ব্যবহার করুন।',
        },
      },
    ],
  },
  {
    id: 'navigation',
    view: 'navigation',
    category: 'content',
    estimatedTime: '2 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Navigation & Menus', bn: 'নেভিগেশন ও মেনু' },
    summary: {
      en: 'Configure Header, Footer, and Portal navigation links for visitors.',
      bn: 'ওয়েবসাইটের হেডার, ফুটার ও পোর্টাল মেনুর লিংক সাজিয়ে নিন।',
    },
    steps: [
      {
        title: { en: 'Choose menu location', bn: 'মেনু লোকেশন সিলেক্ট করুন' },
        detail: {
          en: 'Switch between Header and Footer menus, reorder links, or add external portal URLs (e.g. ERP Login).',
          bn: 'Header বা Footer মেনু সিলেক্ট করে লিংক সাজান বা এক্সটার্নাল লিংক (যেমন ERP Login) যোগ করুন।',
        },
      },
      {
        title: { en: 'Save menu changes', bn: 'মেনু সেভ করুন' },
        detail: {
          en: 'Click Save to update navigation across every public page of your school.',
          bn: 'Save ক্লিক করলেই স্কুলের সব পাবলিক পেজের মেনু আপডেট হয়ে যাবে।',
        },
      },
    ],
  },
  {
    id: 'admissions',
    view: 'admissions',
    category: 'admissions-erp',
    estimatedTime: '3 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Admissions & Application Pipeline', bn: 'অ্যাডমিশন ও আবেদন ম্যানেজমেন্ট' },
    summary: {
      en: 'Review online student applications, update review statuses, schedule interviews, and track ERP sync.',
      bn: 'অনলাইন ভর্তি আবেদন রিভিউ, স্ট্যাটাস আপডেট, ইন্টারভিউ শিডিউল এবং ERP সিঙ্ক ম্যানেজ করুন।',
    },
    steps: [
      {
        title: { en: 'Public admission & tracking portal', bn: 'পাবলিক অ্যাডমিশন ও ট্র্যাকিং পোর্টাল' },
        detail: {
          en: 'Parents apply at /{schoolSlug}/admissions and immediately receive a unique application number (ADM-YYYY-XXXX) to track status.',
          bn: 'অভিভাবকরা /{schoolSlug}/admissions পেজ থেকে আবেদন করলে সাথে সাথে একটি ইউনিক নম্বর (ADM-YYYY-XXXX) পাবেন।',
        },
      },
      {
        title: { en: 'Review & update status', bn: 'আবেদন রিভিউ ও স্ট্যাটাস আপডেট' },
        detail: {
          en: 'Switch between Pipeline and Table views. When ERP is connected, status updates in ERP automatically sync back via HMAC Webhook.',
          bn: 'Pipeline বা Table ভিউয়ে আবেদন দেখুন। ERP কানেক্ট থাকলে ERP-র স্ট্যাটাস আপডেট ওয়েবহুকের মাধ্যমে অটো চলে আসবে।',
        },
      },
      {
        title: { en: 'Zero-Downtime Offline Fallback', bn: 'ERP ডাউন থাকলেও অ্যাডমিশন চালু থাকে' },
        detail: {
          en: 'If ERP is temporarily offline during submission, applications are safely queued locally and pushed automatically on next ERP sync.',
          bn: 'ERP সাময়িকভাবে অফলাইন থাকলেও আবেদন লোকালি কিউ হয়ে সেভ থাকে এবং পরে Sync করলেই ERP-তে চলে যায়।',
        },
      },
    ],
  },
  {
    id: 'inquiries',
    view: 'inquiries',
    category: 'admissions-erp',
    estimatedTime: '2 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'Contact Inquiries & Lead CRM', bn: 'যোগাযোগ ও ইনকোয়ারি ইনবক্স' },
    summary: {
      en: 'Manage parent questions and campus tour requests submitted from your public Contact page.',
      bn: 'পাবলিক Contact পেজ থেকে আসা অভিভাবকদের প্রশ্ন ও ক্যাম্পাস ট্যুর রিকোয়েস্ট ম্যানেজ করুন।',
    },
    steps: [
      {
        title: { en: 'Review new inquiries', bn: 'নতুন ইনকোয়ারি দেখুন' },
        detail: {
          en: 'Open any NEW inquiry to view parent contact details and message.',
          bn: 'যেকোনো NEW ইনকোয়ারিতে ক্লিক করে অভিভাবকের ফোন, ইমেইল ও মেসেজ দেখুন।',
        },
      },
      {
        title: { en: 'Mark as Responded with notes', bn: 'নোটসহ Responded মার্ক করুন' },
        detail: {
          en: 'Add internal follow-up notes and update status to READ, RESPONDED, or ARCHIVED.',
          bn: 'ফলো-আপ নোট লিখে স্ট্যাটাস READ, RESPONDED বা ARCHIVED করুন।',
        },
      },
    ],
  },
  {
    id: 'integrations',
    view: 'integrations',
    category: 'admissions-erp',
    estimatedTime: '4 min',
    roles: ADMIN_ROLES,
    title: { en: 'School ERP & Alumni Integration', bn: 'School ERP ও Alumni ইন্টিগ্রেশন' },
    summary: {
      en: 'Connect your external School ERP using x-website-key for live classes, admissions, status webhooks, teachers/notices sync, and Alumni Verification.',
      bn: 'x-website-key দিয়ে আপনার School ERP কানেক্ট করে লাইভ ক্লাস, অ্যাডমিশন, ওয়েবহুক, টিচার/নোটিশ সিঙ্ক ও Alumni Verify চালু করুন।',
    },
    steps: [
      {
        title: { en: 'Generate API Key in your ERP', bn: '১. ERP ড্যাশবোর্ড থেকে API Key নিন' },
        detail: {
          en: 'In your ERP Dashboard, go to System → Website Integration, generate a sk_web_... key, and copy your ERP Base URL (e.g. https://erp.school.edu/api/v1).',
          bn: 'ERP Dashboard → System → Website Integration থেকে sk_web_... কী জেনারেট করুন এবং ERP Base URL কপি করুন।',
        },
      },
      {
        title: { en: 'Save & Test Live Connection here', bn: '২. এখানে Save করে Test Live Connection দিন' },
        detail: {
          en: 'Paste ERP Base URL and x-website-key into the Integrations form, check "Enable Live ERP", and click "Test Live Connection". Keys are encrypted server-side.',
          bn: 'Integrations ফর্মে ERP Base URL ও API Key দিয়ে "Test Live Connection" ক্লিক করুন। কী সার্ভারে এনক্রিপ্টেড অবস্থায় সেভ হয়।',
        },
      },
      {
        title: { en: 'Copy Webhook URL into ERP', bn: '৩. Webhook URL কপি করে ERP-তে দিন' },
        detail: {
          en: 'Click "Copy" on the ERP Status Webhook URL and paste it in ERP Website Integration settings (with optional HMAC secret) for real-time status updates.',
          bn: 'ERP Status Webhook URL-এর Copy বাটনে ক্লিক করে ERP সেটিংসে পেস্ট করুন, যাতে স্ট্যাটাস আপডেট রিয়েল-টাইমে চলে আসে।',
        },
      },
      {
        title: { en: 'Sync Teachers, Notices & Queued Admissions', bn: '৪. টিচার, নোটিশ ও কিউড অ্যাডমিশন সিঙ্ক করুন' },
        detail: {
          en: 'Click "Sync ERP now" anytime to pull latest classes, faculty profiles, published notices, and flush any offline queued admissions.',
          bn: '"Sync ERP now" ক্লিক করলেই ক্লাস, টিচার, নোটিশ এবং অফলাইনে জমা হওয়া আবেদন ERP-র সাথে সিঙ্ক হয়ে যাবে।',
        },
        tip: {
          en: 'Once verified, your public Alumni Verification portal is automatically live at /{schoolSlug}/alumni-verify.',
          bn: 'কানেকশন ভেরিফাই হলেই /{schoolSlug}/alumni-verify পেজে Alumni Verification অটো চালু হয়ে যাবে।',
        },
      },
    ],
  },
  {
    id: 'publishing',
    view: 'publishing',
    category: 'publish-governance',
    estimatedTime: '2 min',
    roles: ADMIN_ROLES,
    title: { en: 'Publishing, Snapshots & Rollback', bn: 'পাবলিশিং, ব্যাকআপ ও রোলব্যাক' },
    summary: {
      en: 'Review staged changes, publish new versions with instant cache refresh, create backups, or restore older versions.',
      bn: 'ড্রাফট পরিবর্তন রিভিউ করে পাবলিশ করুন, ব্যাকআপ নিন বা পুরোনো ভার্সনে ফিরে যান।',
    },
    steps: [
      {
        title: { en: 'Review staged changes', bn: 'স্টেজড পরিবর্তন দেখুন' },
        detail: {
          en: 'Check pending draft theme changes, pages, notices, and events listed in the Publish Release card.',
          bn: 'ড্রাফট থিম, পেজ, নোটিশ ও ইভেন্টের তালিকা চেক করুন।',
        },
      },
      {
        title: { en: 'Publish new version', bn: 'নতুন ভার্সন পাবলিশ করুন' },
        detail: {
          en: 'Click Publish (here or in the Topbar). A version snapshot is saved and your live site cache refreshes immediately.',
          bn: 'Publish ক্লিক করলেই ভার্সন স্ন্যাপশট সেভ হয়ে সাথে সাথে লাইভ সাইট আপডেট হয়ে যাবে।',
        },
      },
      {
        title: { en: 'One-click Restore or Unpublish', bn: 'রিস্টোর বা আনপাবলিশ করুন' },
        detail: {
          en: 'Use Version History to restore any previous snapshot, or use the Danger Zone to temporarily take the site offline.',
          bn: 'Version History থেকে যেকোনো পুরোনো ভার্সন রিস্টোর করতে পারবেন অথবা Danger Zone থেকে সাইট সাময়িক অফলাইন করতে পারবেন।',
        },
      },
    ],
  },
  {
    id: 'domains',
    view: 'domains',
    category: 'publish-governance',
    estimatedTime: '5 min',
    roles: ADMIN_ROLES,
    title: { en: 'Custom Domain Management', bn: 'কাস্টম ডোমেইন ম্যানেজমেন্ট' },
    summary: {
      en: 'Connect your official school domain (e.g. www.myschool.edu.bd) with DNS verification and SSL.',
      bn: 'আপনার স্কুলের নিজস্ব ডোমেইন (যেমন www.myschool.edu.bd) DNS ও SSL সহ কানেক্ট করুন।',
    },
    steps: [
      {
        title: { en: 'Add your custom domain', bn: 'কাস্টম ডোমেইন যোগ করুন' },
        detail: {
          en: 'Click "Connect domain" and enter your domain name without https://.',
          bn: '"Connect domain" ক্লিক করে https:// ছাড়া আপনার ডোমেইন নাম লিখুন।',
        },
      },
      {
        title: { en: 'Configure DNS & Verify', bn: 'DNS সেট করে ভেরিফাই করুন' },
        detail: {
          en: 'Add the shown CNAME / TXT records at your domain registrar, then click Verify and set as Primary.',
          bn: 'প্রদর্শিত CNAME / TXT রেকর্ড আপনার ডোমেইন প্রোভাইডারে যুক্ত করে Verify ও Set Primary করুন।',
        },
      },
    ],
  },
  {
    id: 'seo',
    view: 'seo',
    category: 'publish-governance',
    estimatedTime: '2 min',
    roles: ['OWNER', 'ADMIN', 'EDITOR'],
    title: { en: 'SEO & Social Sharing Manager', bn: 'SEO ও সোশ্যাল শেয়ারিং' },
    summary: {
      en: 'Control Google search title, meta description, keywords, OpenGraph preview image, and Analytics ID.',
      bn: 'গুগল সার্চ টাইটেল, মেটা ডেসক্রিপশন, কীওয়ার্ড ও সোশ্যাল শেয়ারিং প্রিভিউ কন্ট্রোল করুন।',
    },
    steps: [
      {
        title: { en: 'Set Site Title & Meta Description', bn: 'সাইট টাইটেল ও মেটা ডেসক্রিপশন দিন' },
        detail: {
          en: 'Write a concise title (under 60 chars) and description (under 160 chars) with your school name and city.',
          bn: 'স্কুলের নাম ও শহরসহ ৬০ অক্ষরের মধ্যে টাইটেল এবং ১৬০ অক্ষরের মধ্যে বিবরণ লিখুন।',
        },
      },
      {
        title: { en: 'Add OG Image & Google Analytics', bn: 'OG ইমেজ ও Google Analytics যোগ করুন' },
        detail: {
          en: 'Upload a social share banner so links shared on Facebook/WhatsApp show a rich preview card.',
          bn: 'ফেসবুক বা হোয়াটসঅ্যাপে লিংক শেয়ার করলে সুন্দর প্রিভিউ দেখাতে OG Image যুক্ত করুন।',
        },
      },
    ],
  },
  {
    id: 'analytics',
    view: 'analytics',
    category: 'publish-governance',
    estimatedTime: '1 min',
    roles: ALL_ROLES,
    title: { en: 'Website Analytics', bn: 'ওয়েবসাইট অ্যানালিটিক্স' },
    summary: {
      en: 'Track daily page views, unique visitors, top pages, and device breakdown.',
      bn: 'দৈনিক ভিজিটর, পেজ ভিউ, জনপ্রিয় পেজ এবং ডিভাইস রিপোর্ট দেখুন।',
    },
    steps: [
      {
        title: { en: 'Filter by date range', bn: 'সময়সীমা সিলেক্ট করুন' },
        detail: {
          en: 'Switch between 7, 30, or 90 days to monitor admission season traffic spikes.',
          bn: '৭, ৩০ বা ৯০ দিনের ডেটা ফিল্টার করে ভর্তির মৌসুমে ভিজিটর ট্রেন্ড দেখুন।',
        },
      },
    ],
  },
  {
    id: 'audit-logs',
    view: 'audit-logs',
    category: 'publish-governance',
    estimatedTime: '1 min',
    roles: ADMIN_ROLES,
    title: { en: 'Audit Logs & Activity Timeline', bn: 'অডিট লগ ও সিকিউরিটি টাইমলাইন' },
    summary: {
      en: 'Inspect who published changes, edited content, updated domains, or changed team roles.',
      bn: 'কে কখন পাবলিশ করেছে, কনটেন্ট এডিট করেছে বা রোল বদলেছে তার সম্পূর্ণ লগ দেখুন।',
    },
    steps: [
      {
        title: { en: 'Review & export audit trail', bn: 'অডিট লগ দেখুন ও এক্সপোর্ট করুন' },
        detail: {
          en: 'Filter recent security/publishing actions and export CSV reports for institutional compliance.',
          bn: 'সাম্প্রতিক কার্যক্রম ফিল্টার করুন এবং প্রয়োজনে CSV রিপোর্ট এক্সপোর্ট করুন।',
        },
      },
    ],
  },
  {
    id: 'settings',
    view: 'settings',
    category: 'publish-governance',
    estimatedTime: '3 min',
    roles: ADMIN_ROLES,
    title: { en: 'Workspace Settings & Team Roles', bn: 'সেটিংস ও টিম রোল ম্যানেজমেন্ট' },
    summary: {
      en: 'Invite team members with granular roles, toggle public admissions, and configure security.',
      bn: 'টিম মেম্বার ইনভাইট করুন, রোল নির্ধারণ করুন এবং পাবলিক অ্যাডমিশন ও সিকিউরিটি কন্ট্রোল করুন।',
    },
    steps: [
      {
        title: { en: 'Invite staff with appropriate roles', bn: 'সঠিক রোল দিয়ে স্টাফ ইনভাইট করুন' },
        detail: {
          en: 'Assign ADMIN for full management, EDITOR/CONTENT_MANAGER for notices/teachers/pages, or ANALYST for read-only analytics.',
          bn: 'সম্পূর্ণ কন্ট্রোলের জন্য ADMIN, কনটেন্টের জন্য EDITOR/CONTENT_MANAGER এবং শুধু রিপোর্ট দেখার জন্য ANALYST রোল দিন।',
        },
      },
      {
        title: { en: 'Toggle Public Admissions or Maintenance Mode', bn: 'পাবলিক অ্যাডমিশন বা মেইনটেন্যান্স মোড' },
        detail: {
          en: 'Use Website Settings to open/close online admission applications anytime.',
          bn: 'Website Settings থেকে যেকোনো সময় অনলাইন ভর্তি ফর্ম চালু বা বন্ধ করতে পারবেন।',
        },
      },
    ],
  },
]

export function getGuideForView(view: View): HelpGuide {
  return (
    HELP_GUIDES.find((g) => g.view === view) || HELP_GUIDES[0]
  )
}

export function normalizeSchoolRole(role?: string | null): StudioRole {
  const upper = (role || 'OWNER').trim().toUpperCase()
  if (
    upper === 'OWNER' ||
    upper === 'ADMIN' ||
    upper === 'EDITOR' ||
    upper === 'CONTENT_MANAGER' ||
    upper === 'ANALYST'
  ) {
    return upper
  }
  return 'OWNER'
}

