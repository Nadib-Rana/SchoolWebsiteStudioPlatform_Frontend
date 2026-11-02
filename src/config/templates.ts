import type { TemplateItem } from '@/types/theme'

export const heroImage =
  'https://images.unsplash.com/photo-1656772133661-644caa299e8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600'
export const campusImage =
  'https://images.unsplash.com/photo-1782080226307-c13e13acf62d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200'
export const interiorImage =
  'https://images.unsplash.com/photo-1758413350815-7b06dbbfb9a7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200'

export const templates: TemplateItem[] = [
  {
    name: 'Aster Academy',
    theme: 'modern',
    category: 'Modern School',
    desc: 'Confident, energetic, and built to inspire future-ready learners.',
    image: heroImage,
    colors: ['#193b76', '#efb736'],
    tag: 'Most popular',
  },
  {
    name: 'Heritage',
    theme: 'classic',
    category: 'Traditional School',
    desc: 'A timeless academic design that communicates tradition and trust.',
    image:
      'https://images.unsplash.com/photo-1657035008863-eaac81a9b65d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100',
    colors: ['#173d32', '#c6a15b'],
  },
  {
    name: 'Horizon',
    theme: 'international',
    category: 'International School',
    desc: 'A globally minded experience for diverse, ambitious communities.',
    image: campusImage,
    colors: ['#075985', '#f97316'],
    tag: 'Global',
  },
  {
    name: 'Scholar',
    theme: 'college',
    category: 'College',
    desc: 'Editorial structure for programs, research, faculty, and campus life.',
    image:
      'https://images.unsplash.com/photo-1787401963343-d81b68a5a059?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100',
    colors: ['#4c1d95', '#a78bfa'],
  },
  {
    name: 'Momentum',
    theme: 'high-school',
    category: 'High School',
    desc: 'Bold academics, athletics, activities, and student achievement.',
    image:
      'https://images.unsplash.com/photo-1780562451592-ffafe674c4fa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100',
    colors: ['#9f1239', '#fbbf24'],
  },
  {
    name: 'Little Oak',
    theme: 'primary',
    category: 'Primary School',
    desc: 'Warm and playful details designed for younger school communities.',
    image:
      'https://images.unsplash.com/photo-1769209435699-9cc1fd8e7f57?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1100',
    colors: ['#047857', '#fbbf24'],
  },
  {
    name: 'Covenant',
    theme: 'religious',
    category: 'Religious School',
    desc: 'A respectful, values-led design balancing faith and scholarship.',
    image:
      'https://images.unsplash.com/photo-1656772133661-644caa299e8c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=82&w=1100',
    colors: ['#312e81', '#d4af37'],
  },
  {
    name: 'Clarity',
    theme: 'minimal',
    category: 'Minimal Education',
    desc: 'A calm, content-first experience with considered white space.',
    image: interiorImage,
    colors: ['#111827', '#e7e5e4'],
    tag: 'New',
  },
  {
    name: 'Élan',
    theme: 'premium',
    category: 'Premium Education',
    desc: 'An elevated editorial experience for distinguished institutions.',
    image:
      'https://images.unsplash.com/photo-1782080226307-c13e13acf62d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=90&w=1100',
    colors: ['#111827', '#b68b4c'],
    tag: 'Premium',
  },
]
