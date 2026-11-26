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
      en: 'Paste your Website API Key (x-website-key) for live admissions and alumni verify.',
      bn: 'লাইভ অ্যাডমিশন ও Alumni Verify-এর জন্য Website API Key (x-website-key) যুক্ত করুন।',
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
        title: { en: 'Quick-Search any page or setting in the Header (Ctrl + K)', bn: 'হেডার সার্চ দিয়ে যেকোনো অপশন দ্রুত খুঁজুন (Ctrl + K)' },
        detail: {
          en: 'Use the search bar in the top Studio Header (or press Ctrl+K / Cmd+K) to jump straight to Governing Body, Advisory Board card styles, Academics, ERP Login & Footer social links, Admissions, or Maintenance Mode.',
          bn: 'উপরের Studio হেডারের সার্চ বক্স (অথবা Ctrl+K) ব্যবহার করে এক ক্লিকেই Governing Body, Advisory Board কার্ড স্টাইল, Academics, ERP Login ও Footer সোশ্যাল লিংক বা Maintenance Mode-এ চলে যান।',
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
        title: { en: 'Customize Hero Slider, Photo Position, Colors & Nav Alignment', bn: 'হিরো স্লাইডার, ছবির পজিশন, কালার ও মেনু অ্যালাইনমেন্ট' },
        detail: {
          en: 'In Hero section, add 2–6 images for an automatic crossfade slider (3s–12s). In School Introduction, edit campus photo & Image Badge Title/Subtitle. In the Style tab, set Background Color, Text Color, Header Nav Alignment (Left/Center/Right), and Photo Position (Left/Right) for Principal Message & School Introduction.',
          bn: 'Hero সেকশনে ২–৬টি ছবি দিয়ে অটো-স্লাইডার চালু করুন। School Introduction-এ ক্যাম্পাস ছবি ও Image Badge এডিট করুন। Style ট্যাব থেকে Background/Text Color, Header মেনুর Left/Center/Right অ্যালাইনমেন্ট এবং Principal Message ও School Introduction-এর Photo Left/Right পজিশন বদলানো যাবে।',
        },
      },
      {
        title: { en: 'Show / Hide Any Section & Sync All Homepage Styles Live', bn: 'যেকোনো সেকশন Show / Hide ও লাইভ স্টাইল সিঙ্ক করুন' },
        detail: {
          en: 'Select any section (Announcement, Header, Hero, Statistics, School Introduction, Principal Message, Latest Notices, Upcoming Events, Gallery, Custom Sections, or Footer) to customize Background Color, Text Color, Padding, Border, Shadow, Header Logo Letter, Footer contacts, or toggle "Hide completely (All devices)" / "Hide on mobile" — everything syncs live to your public homepage.',
          bn: 'Builder-এর যেকোনো সেকশন (Header, Hero, Statistics, School Introduction, Principal, Latest Notices, Upcoming Events, Gallery, Custom Section বা Footer) থেকে Background Color, Text Color, Padding, Border, Shadow, Logo Letter ও Footer তথ্য পরিবর্তন বা "Hide completely / Hide on mobile" অন/অফ করলে সাথে সাথেই লাইভ ওয়েবসাইটে দেখাবে।',
        },
      },
      {
        title: { en: 'Add, Style & Delete Custom Sections (FAQ, Facilities, CTA)', bn: 'Custom Section যোগ, স্টাইল ও ডিলিট করুন' },
        detail: {
          en: 'Click "+ Add section" or switch to the Components tab to add FAQ, Testimonials, Campus Facilities, Admission Call-to-Action (with live button link), or Rich Text blocks. Custom sections save to the database, reload across devices, and cleanly delete from the live website when removed.',
          bn: '"+ Add section" বা Components ট্যাব থেকে FAQ, Testimonials, Campus Facilities, Admission CTA বা Rich Text ব্লক যোগ করুন। এগুলো ডাটাবেজে সেভ থাকে এবং Builder থেকে রিমুভ করলে লাইভ সাইট থেকেও মুছে যায়।',
        },
      },
      {
        title: { en: 'One-click Publish (Auto-saves Builder changes)', bn: '১ ক্লিকে Publish (অটো-সেভসহ)' },
        detail: {
          en: 'Click "Preview" anytime to inspect live colors/styles, "Save draft" to keep changes private, or click topbar "Publish" directly — it automatically saves your latest Builder edits and publishes live immediately.',
          bn: 'যেকোনো সময় "Preview" দিয়ে লাইভ লুক দেখুন, অথবা সরাসরি টপবারের "Publish" বাটনে ক্লিক করুন—এটা অটোমেটিক আপনার সর্বশেষ এডিট সেভ করে সাথে সাথেই লাইভ সাইটে পাবলিশ করে দেবে।',
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
        title: { en: 'Create, Edit, or Toggle Publish / Draft in 1 Click', bn: 'নতুন পেজ তৈরি, Edit ও ১ ক্লিকে Publish / Unpublish' },
        detail: {
          en: 'Click "New page" to create a page, or use the "Edit" and "Publish / Unpublish" action buttons on any table row to update details or move a page between Live and Draft instantly.',
          bn: '"New page" ক্লিক করে পেজ তৈরি করুন, অথবা টেবিলের যেকোনো রো-তে থাকা "Edit" এবং "Publish / Unpublish" বাটনে ক্লিক করে পেজের তথ্য আপডেট বা ড্রাফট/লাইভ করুন।',
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
        title: { en: 'Update contact, principal profile & ERP / social links', bn: 'যোগাযোগ, প্রিন্সিপাল ও ERP / সোশ্যাল লিংক দিন' },
        detail: {
          en: 'Keep address, phone, email, and office hours accurate for /{schoolSlug}/contact, and add your ERP Login URL + Facebook, YouTube, Instagram, LinkedIn, X, and Official Website links under "ERP Login & Public Social Profile Links" (saved per-school in PostgreSQL) to display icons in the Footer and an ERP Login button in both Header & Footer.',
          bn: 'ঠিকানা, ফোন, ইমেইল ও অফিস সময় /{schoolSlug}/contact পেজের জন্য ঠিক রাখুন এবং "ERP Login & Public Social Profile Links" অংশে ERP Login URL ও Facebook, YouTube, Instagram, LinkedIn, X, Official Website লিংক দিন—এগুলো প্রতি স্কুলের জন্য আলাদাভাবে ডাটাবেসে সেভ থাকে এবং Header ও Footer-এ অটোমেটিক দেখায়।',
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
    id: 'governing-body',
    view: 'governing-body',
    category: 'content',
    estimatedTime: '2 min',
    roles: EDIT_ROLES,
    title: {
      en: 'Governing Body, Advisory Board & Managing Committee',
      bn: 'গভর্নিং বডি, অ্যাডভাইজরি বোর্ড ও ম্যানেজিং কমিটি (SMC)',
    },
    summary: {
      en: 'Publish Chairman spotlight, Governing Body / Advisory Board / SMC members, customize card styles & colors, and toggle visibility On/Off.',
      bn: 'চেয়ারম্যান স্পটলাইট, গভর্নিং বডি / অ্যাডভাইজরি বোর্ড / ম্যানেজিং কমিটি (SMC) সদস্য যোগ করুন এবং কার্ড স্টাইল, কালার ও On/Off কন্ট্রোল করুন।',
    },
    steps: [
      {
        title: {
          en: 'Add committee members with roles & term period',
          bn: 'পদবি ও মেয়াদকালসহ কমিটির সদস্য যোগ করুন',
        },
        detail: {
          en: 'Click "Add member", upload a portrait photo, pick or type a designation (Chairman, President, Member Secretary, Guardian Representative, Donor Member), select a committee category (Governing Body, Managing Committee (SMC), Board of Trustees, Advisory Board), enter Term Period (e.g. 2025–2027), and toggle "Highlight as Chairman / President Spotlight" for featured leaders.',
          bn: '"Add member" ক্লিক করে ছবি আপলোড করুন, পদবি (Chairman, President, Member Secretary, Guardian Representative ইত্যাদি), কমিটির ধরন (Governing Body / Managing Committee (SMC) / Board of Trustees / Advisory Board), মেয়াদকাল (যেমন 2025–2027) এবং চাইলে Chairman Spotlight অপশন চালু করুন।',
        },
      },
      {
        title: {
          en: '1-Click On/Off, Card Styles & Visual Customization',
          bn: '১ ক্লিকে On/Off, কার্ড স্টাইল ও কালার কাস্টমাইজ করুন',
        },
        detail: {
          en: 'Use the top "Page & Section Visibility / Customization" panel (and Settings → Website) to toggle /{schoolSlug}/governing-body ON/OFF, control Homepage/About visibility, Chairman Spotlight & public phone/email, customize Kicker/Title/Subtitle & column count, and style Advisory Board / Committee cards (Horizontal, Portrait, Executive, or Minimal layout; Rounded/Circle/Square photo; Flat/Soft/Elevated shadow; custom Section, Card & Accent colors).',
          bn: 'উপরের "Page & Section Visibility / Customization" প্যানেল (এবং Settings → Website) থেকে ১ ক্লিকে /{schoolSlug}/governing-body পেজ On/Off, Homepage ও About দৃশ্যমানতা, কাস্টম টাইটেল/সাবটাইটেল ছাড়াও কার্ডের ডিজাইন (Horizontal, Portrait, Executive, Minimal লেআউট; Rounded/Circle/Square ছবি; Shadow ও কাস্টম Section/Card/Accent কালার) পরিবর্তন করতে পারবেন।',
        },
      },
      {
        title: {
          en: 'Link Governing Body in Header or Footer Menu',
          bn: 'হেডার বা ফুটার মেনুতে পেজটি যুক্ত করুন',
        },
        detail: {
          en: 'Open Navigation, choose the "Governing Body (/governing-body)" preset link, and save so visitors can jump directly to the full committee directory with category filters.',
          bn: 'Navigation স্ক্রিনে গিয়ে "Governing Body (/governing-body)" প্রিসেট লিংকটি হেডার বা ফুটারে যুক্ত করুন, যাতে ভিজিটররা সরাসরি ক্যাটাগরি ফিল্টারসহ পুরো কমিটি দেখতে পারেন।',
        },
      },
    ],
    troubleshooting: [
      {
        q: {
          en: 'Why is the Governing Body section not appearing on the Homepage or About page?',
          bn: 'হোমপেজ বা About পেজে গভর্নিং বডি সেকশন না দেখালে কী করব?',
        },
        a: {
          en: 'Check two things: (1) At least one member must have status "Published" (Active) in this table, and (2) both the master toggle and "Show on Homepage" / "Show on About Page" must be enabled in the Customize & Visibility panel above.',
          bn: 'দুটি বিষয় নিশ্চিত করুন: (১) তালিকায় অন্তত একজন সদস্য "Published" অবস্থায় আছে, এবং (২) উপরের Customize & Visibility প্যানেলে মাস্টার টগল ও "Show on Homepage" / "Show on About Page" চালু (On) আছে।',
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
    title: { en: 'Academic Programs Page Editor', bn: 'একাডেমিক প্রোগ্রাম পেজ এডিটর' },
    summary: {
      en: 'Edit /academics hero headings, customizable Program Division cards, curriculum, grades, subjects, facilities, and honors directly.',
      bn: 'সরাসরি এই স্ক্রিন থেকেই /academics পেজের শিরোনাম, প্রোগ্রাম ডিভিশন কার্ড, কারিকুলাম, গ্রেড, বিষয়, ফ্যাসিলিটিজ ও সম্মাননা এডিট ও পাবলিশ করুন।',
    },
    steps: [
      {
        title: { en: 'Customize Hero Title & Program Division Cards', bn: 'Hero শিরোনাম ও প্রোগ্রাম ডিভিশন কার্ড এডিট করুন' },
        detail: {
          en: 'Edit Hero Kicker, Page Title ("Academic Programs at ..."), Subtitle, and Framework Heading, then add, edit, or remove Program Division cards (e.g. Primary Years, Middle School, Senior Secondary) with custom icons.',
          bn: 'Hero Kicker, Page Title ("Academic Programs at ..."), Subtitle এবং Framework Heading পরিবর্তন করুন এবং আপনার স্কুলের প্রয়োজন অনুযায়ী Program Division কার্ড যোগ/এডিট বা রিমুভ করুন।',
        },
      },
      {
        title: { en: 'Edit Curriculum, Grades, Facilities & Save Live', bn: 'কারিকুলাম, গ্রেড, ফ্যাসিলিটিজ সেভ করে লাইভ করুন' },
        detail: {
          en: 'Update Classes & Grades, Curriculum, Subjects, Learning Facilities, and Academic Honors, then click "Save & Publish Academics" to update /{schoolSlug}/academics immediately in your school database.',
          bn: 'Classes & Grades, Curriculum, Subjects, Learning Facilities ও Academic Honors আপডেট করে "Save & Publish Academics" ক্লিক করলেই ডাটাবেসে সেভ হয়ে /{schoolSlug}/academics লাইভ হয়ে যাবে।',
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
        title: { en: 'Create a notice & upload PDF attachment', bn: 'নতুন নোটিশ তৈরি ও PDF আপলোড করুন' },
        detail: {
          en: 'Click "Create notice", pick a category (General, Routine, Syllabus, Examinations, Holiday, Admissions), and use "Upload PDF / File" to attach downloadable documents directly.',
          bn: '"Create notice" ক্লিক করে ক্যাটাগরি (Routine, Syllabus, Examinations, Holiday ইত্যাদি) সিলেক্ট করুন এবং "Upload PDF / File" বাটন দিয়ে সরাসরি PDF ফাইল যুক্ত করুন।',
        },
      },
      {
        title: { en: 'Pin important circulars & Notice Ticker', bn: 'জরুরি নোটিশ পিন ও চলমান নোটিশ বার' },
        detail: {
          en: 'Enable "Pinned" to keep critical notices at the top. Published notices automatically scroll in the public "Latest Notices" ticker bar (toggleable ON/OFF in Settings → Website).',
          bn: 'জরুরি নোটিশ সবার উপরে রাখতে "Pinned" চালু করুন। পাবলিশ করা নোটিশগুলো অটোমেটিক পাবলিক সাইটের "Latest Notices" চলমান বারে দেখাবে (Settings → Website থেকে On/Off করা যাবে)।',
        },
      },
      {
        title: { en: 'Public Download Center (/{schoolSlug}/downloads)', bn: 'পাবলিক ডাউনলোড সেন্টার (রুটিন/সিলেবাস PDF)' },
        detail: {
          en: 'Any PUBLISHED notice with a PDF/file attachment automatically appears in the public Download Center with category filters and search. Private ERP notices or DRAFT notices are never shown publicly.',
          bn: 'PDF বা ফাইল যুক্ত যেকোনো PUBLISHED নোটিশ অটোমেটিক পাবলিক Download Center (/{schoolSlug}/downloads)-এ ক্যাটাগরি ফিল্টার ও সার্চসহ দেখাবে। DRAFT বা ERP-এর প্রাইভেট নোটিশ কখনোই পাবলিক হয় না।',
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
          en: 'Published upcoming events automatically replace the Builder sample events on your Homepage with crisp Day/Month date badges and a balanced 2- or 3-column grid alongside the full Events directory.',
          bn: 'পাবলিশ করা ইভেন্টগুলো হোমপেজ ও Events পেজে অটোমেটিক দেখাবে (পরিষ্কার Day/Month ব্যাজ ও ২ বা ৩ কলামের ব্যালেন্সড কার্ড গ্রিডসহ)।',
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
        title: { en: 'Copy URL or Delete files with Icon Buttons', bn: 'Copy ও Trash আইকন দিয়ে URL কপি বা ফাইল ডিলিট করুন' },
        detail: {
          en: 'Use the Copy icon button on any media card to copy its public URL for Builder, Notices, or Teachers. Click the red Trash icon button on any card (or top-left inside the Media Picker modal and Gallery albums) to permanently delete unused files and free storage.',
          bn: 'যেকোনো মিডিয়া কার্ডের Copy আইকনে ক্লিক করে ফাইলের URL কপি করুন। অপ্রয়োজনীয় ছবি বা ফাইল মুছে স্টোরেজ খালি করতে লাল Trash (ডিলিট) আইকন বাটনে ক্লিক করুন (Media Library, Media Picker পপ-আপ এবং Gallery অ্যালবাম—সব জায়গায় এই আইকন রয়েছে)।',
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
        title: { en: 'Choose menu location & preset links', bn: 'মেনু লোকেশন ও প্রিসেট লিংক সিলেক্ট করুন' },
        detail: {
          en: 'Switch between Header and Footer menus, pick built-in school pages (including Governing Body at /governing-body), reorder links, or add external portal URLs (e.g. ERP Login).',
          bn: 'Header বা Footer মেনু সিলেক্ট করে স্কুলের প্রিসেট পেজ (যেমন Governing Body /governing-body) বা এক্সটার্নাল লিংক (যেমন ERP Login) যুক্ত ও সাজিয়ে নিন।',
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
        title: {
          en: 'Online Admissions, Fees, Payment & Single-Page A4 PDF Slip',
          bn: 'অনলাইন অ্যাডমিশন, ফি, পেমেন্ট ও সিঙ্গেল-পেজ A4 PDF স্লিপ',
        },
        detail: {
          en: 'Parents apply at /{schoolSlug}/admissions with class-wise admission fees shown automatically, passport photo (preserved across payment redirects and status tracking), Birth Registration & parent details, and instant Online Payment (bKash, Nagad, SSLCommerz, ShurjoPay, SonaliPay, Stripe) or Manual TrxID submission. Both the Admission Confirmation Receipt and Status Slip print cleanly on a single A4 page with school logo, applicant photo, PAID/UNPAID/VERIFYING stamp, 4 structured detail/fee cards, and signature lines.',
          bn: 'অভিভাবকরা /{schoolSlug}/admissions থেকে ক্লাস-ভিত্তিক ফি দেখে শিক্ষার্থীর পাসপোর্ট সাইজ ছবি, জন্ম নিবন্ধন ও মা-বাবার তথ্যসহ আবেদন করে অনলাইন পেমেন্ট (bKash, Nagad, SSLCommerz, ShurjoPay, SonaliPay, Stripe) বা ম্যানুয়াল TrxID দিতে পারবেন। আবেদন ও ট্র্যাকিং উভয় জায়গা থেকেই স্কুলের লোগো, শিক্ষার্থীর ছবি, PAID/UNPAID/VERIFYING স্ট্যাম্প, ৪টি কাঠামোবদ্ধ সেকশন কার্ড ও স্বাক্ষর লাইনসহ এক পেজের A4 PDF রিসিট প্রিন্ট করা যায়।',
        },
      },
      {
        title: { en: '1-Click Hide / Open Admissions Page', bn: '১ ক্লিকে অ্যাডমিশন পেজ Hide / Open করুন' },
        detail: {
          en: 'Use the top visibility banner here (or Settings → Website) to hide the /admissions page, Apply Now button, and pause new applications between admission seasons — then reopen in 1 click when admissions start again.',
          bn: 'এই পেজের একদম উপরের ব্যানার (বা Settings → Website) থেকে ১ ক্লিকে অ্যাডমিশন পেজ ও Apply Now বাটন হাইড/বন্ধ করে রাখতে পারবেন, আর নতুন সেশন শুরু হলে আবার ১ ক্লিকে চালু করে দিতে পারবেন।',
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
        title: { en: 'Receive validated public Contact inquiries', bn: 'Contact পেজ থেকে ভ্যালিডেটেড ইনকোয়ারি দেখুন' },
        detail: {
          en: 'The redesigned /{schoolSlug}/contact page validates fields cleanly, saves each inquiry into this inbox (and opens the visitor’s email app pre-filled), and automatically pauses submissions during Maintenance Mode.',
          bn: 'নতুন ডিজাইন করা /{schoolSlug}/contact পেজ থেকে ভ্যালিডেশনসহ পাঠানো প্রতিটি প্রশ্ন এই ইনবক্সে সেভ হয় (এবং ভিজিটরের ইমেইল অ্যাপও খোলে)। Maintenance Mode চালু থাকলে ইনকোয়ারি ফর্ম অটোমেটিক বন্ধ থাকে।',
        },
      },
      {
        title: { en: 'Review & mark as Responded with notes', bn: 'রিভিউ ও নোটসহ Responded মার্ক করুন' },
        detail: {
          en: 'Open any NEW inquiry to view parent contact details, add internal follow-up notes, and update status to READ, RESPONDED, or ARCHIVED.',
          bn: 'যেকোনো NEW ইনকোয়ারিতে ক্লিক করে অভিভাবকের ফোন, ইমেইল ও মেসেজ দেখুন, ফলো-আপ নোট লিখুন এবং স্ট্যাটাস READ, RESPONDED বা ARCHIVED করুন।',
        },
      },
    ],
  },
  {
    id: 'integrations',
    view: 'integrations',
    category: 'admissions-erp',
    estimatedTime: '3 min',
    roles: ADMIN_ROLES,
    title: { en: 'School ERP & Alumni Integration', bn: 'School ERP ও Alumni ইন্টিগ্রেশন' },
    summary: {
      en: 'Connect your School ERP with just your Website API Key (x-website-key) for live open classes, admissions with student photoUrl sync, status webhooks, faculty/notices sync, and Alumni Verification.',
      bn: 'শুধুমাত্র Website API Key (x-website-key) দিয়ে School ERP কানেক্ট করে লাইভ ক্লাস, ফটোসহ অ্যাডমিশন, ওয়েবহুক, টিচার/নোটিশ সিঙ্ক ও Alumni Verify চালু করুন।',
    },
    steps: [
      {
        title: { en: 'Copy Website API Key from your ERP', bn: '১. ERP ড্যাশবোর্ড থেকে Website API Key কপি করুন' },
        detail: {
          en: 'In your ERP Dashboard, open System → Website Integration, make sure "Enable External Website Integration" is checked, and copy your sk_web_... Website API Key. No ERP Base URL is needed — it is pre-configured securely on our server.',
          bn: 'ERP Dashboard → System → Website Integration থেকে "Enable External Website Integration" চালু রেখে sk_web_... Website API Key কপি করুন। আলাদা কোনো Base URL দেওয়ার প্রয়োজন নেই—তা সার্ভারেই সুরক্ষিতভাবে সেট করা আছে।',
        },
      },
      {
        title: { en: 'Save Key & Test Live Connection here', bn: '২. শুধু API Key বসিয়ে Save ও Test করুন' },
        detail: {
          en: 'Paste your sk_web_... Website API Key into Integrations, keep "Enable Live ERP" checked, click "Save ERP Settings", and then click "Test Live Connection" to verify your ERP school & open classes immediately.',
          bn: 'Integrations ফর্মে শুধু Website API Key (x-website-key) পেস্ট করে "Save ERP Settings" এবং তারপর "Test Live Connection" ক্লিক করলে সাথে সাথেই আপনার স্কুল ও ওপেন ক্লাস ভেরিফাই হয়ে যাবে।',
        },
      },
      {
        title: { en: 'Copy Webhook URL into ERP for Real-Time Status', bn: '৩. রিয়েল-টাইম স্ট্যাটাসের জন্য Webhook URL দিন' },
        detail: {
          en: 'Copy the ERP Status Webhook URL shown here and paste it into ERP Website Integration settings (with optional HMAC Signing Secret for X-ERP-Signature verification) so ERP admission status changes update your website instantly.',
          bn: 'এখানে থাকা ERP Status Webhook URL কপি করে ERP-র Webhook সেটিংসে দিন (চাইলে HMAC Signing Secret সহ)—তাহলে ERP থেকে স্ট্যাটাস পরিবর্তন করলেই ওয়েবসাইটে অটো আপডেট হয়ে যাবে।',
        },
      },
      {
        title: { en: 'Live Admissions Payment, Photo, Alumni Verify & Draft Sync', bn: 'অ্যাডমিশন পেমেন্ট, ফটো, Alumni Verify ও সিঙ্ক সুবিধা' },
        detail: {
          en: 'Class-wise admission fees, enabled online gateways (bKash, Nagad, SSLCommerz, ShurjoPay, SonaliPay, Stripe), manual instructions, and passport photos sync directly with ERP via x-website-key. For production online payments, add your live school website domain in ERP Settings → Website Integration → Allowed Domains.',
          bn: 'ক্লাস-ভিত্তিক অ্যাডমিশন ফি, চালু পেমেন্ট গেটওয়ে, ম্যানুয়াল নির্দেশনা ও স্টুডেন্ট ফটো x-website-key দিয়ে সরাসরি ERP-তে সিঙ্ক হয়। প্রোডাকশনে অনলাইন পেমেন্টের জন্য ERP-র Settings → Website Integration → Allowed Domains-এ আপনার লাইভ স্কুল ডোমেইন যুক্ত রাখুন।',
        },
      },
    ],
    troubleshooting: [
      {
        q: {
          en: 'What if "Test Live Connection" returns a 401 or 403 error?',
          bn: '"Test Live Connection" ক্লিক করলে 401 বা 403 এরর দেখালে কী করব?',
        },
        a: {
          en: 'Confirm your sk_web_... key was not rotated or revoked in ERP, ensure "Enable External Website Integration" is turned ON, and verify "Allowed Website Domains" in ERP either includes this backend API host or is left blank.',
          bn: 'ERP-তে গিয়ে নিশ্চিত হন কী-টি Rotate/Revoke করা হয়নি, "Enable External Website Integration" অন আছে এবং Allowed Website Domains খালি আছে বা সঠিক ডোমেইন দেওয়া আছে।',
        },
      },
      {
        q: {
          en: 'What if I see "ERP server connection is not yet enabled on this platform"?',
          bn: '"ERP server connection is not yet enabled" বার্তা দেখালে কী করব?',
        },
        a: {
          en: 'Contact the platform system administrator so the server-side ERP connection environment variable is configured and restarted.',
          bn: 'প্ল্যাটফর্মের সিস্টেম অ্যাডমিনকে জানান যেন সার্ভারের .env ফাইলে ERP_BASE_URL সেট করে ব্যাকএন্ড রিস্টার্ট করা হয়।',
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
        title: {
          en: 'Manage ERP Login URL & Public Social Links (Settings → School profile)',
          bn: 'ERP Login ও সোশ্যাল প্রোফাইল লিংক (Settings → School profile)',
        },
        detail: {
          en: 'Under Settings → School profile (or Content Management → School information), add your ERP Login URL/Label and Facebook, YouTube, Instagram, LinkedIn, X, and Official Website links. They save per-school in PostgreSQL and appear automatically in your Header & Footer.',
          bn: 'Settings → School profile (অথবা Content Management → School information) থেকে ERP Login URL/Label এবং Facebook, YouTube, Instagram, LinkedIn, X ও Official Website লিংক দিন—প্রতি স্কুলের জন্য আলাদাভাবে ডাটাবেসে সেভ হয়ে Header ও Footer-এ দেখাবে।',
        },
      },
      {
        title: {
          en: 'Control Admissions, Governing Body, Notice Ticker, WhatsApp / Call Buttons & Maintenance Mode',
          bn: 'অ্যাডমিশন, গভর্নিং বডি, নোটিশ বার, WhatsApp / Call বাটন ও মেইনটেন্যান্স কন্ট্রোল',
        },
        detail: {
          en: 'In Website Preferences, toggle Public Admissions Portal, Governing Body / Managing Committee (full title, Homepage/About visibility, and grid layout can also be customized under Governing Body → Customize & Visibility), Latest Notices Ticker Bar, Floating WhatsApp Button (with editable WhatsApp number), Floating Phone Call Button (with editable Call Office phone number), or Maintenance Mode ON/OFF independently anytime. Maintenance Mode applies immediately (0-second live switch), warns admins inside Studio Preview, and blocks public Admission & Contact submissions.',
          bn: 'Website Preferences থেকে Public Admissions, Governing Body / Managing Committee (পূর্ণ টাইটেল, Homepage/About দৃশ্যমানতা ও গ্রিড লেআউট Governing Body → Customize & Visibility থেকে কাস্টমাইজ করা যাবে), Latest Notices চলমান বার, Floating WhatsApp বাটন, Floating Phone Call বাটন এবং Maintenance Mode আলাদাভাবে On/Off করা যাবে। Maintenance Mode চালু করলে সাথে সাথেই লাইভ সাইটে মেইনটেন্যান্স স্ক্রিন আসে এবং পাবলিক ফর্ম জমা নেওয়া বন্ধ থাকে।',
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

