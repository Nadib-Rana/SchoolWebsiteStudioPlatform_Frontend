import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseHomepageSections } from '../src/lib/homepage-sections-parser.ts'

describe('parseHomepageSections', () => {
  it('handles null, undefined, and empty pages gracefully', () => {
    assert.deepEqual(parseHomepageSections(null), {
      sectionStyles: {},
      customSections: [],
    })
    assert.deepEqual(parseHomepageSections({ pages: [] } as never), {
      sectionStyles: {},
      customSections: [],
    })
  })

  it('extracts standard sections and filters blank hero images', () => {
    const parsed = parseHomepageSections({
      pages: [
        {
          id: 'home-1',
          slug: 'home',
          title: 'Home',
          isHome: true,
          sections: [
            {
              id: 'sec-1',
              type: 'hero',
              title: 'Hero',
              settings: { overlay: 'dark' },
              content: {
                heading: 'Welcome to Northfield',
                heroImages: ['https://cdn.test/1.jpg', '  ', 123],
                sliderIntervalSec: '7',
              },
            },
            {
              id: 'sec-custom',
              type: 'advisory_board',
              title: 'Advisory Board',
              settings: { bg: '#f8fafc' },
              content: {
                title: 'Our Advisors',
                items: [{ name: 'Dr. Rahman' }],
              },
            },
          ],
        },
      ],
    } as never)

    assert.equal(parsed.heading, 'Welcome to Northfield')
    assert.deepEqual(parsed.heroImages, ['https://cdn.test/1.jpg'])
    assert.equal(parsed.sliderIntervalSec, 7)
    assert.deepEqual(parsed.sectionStyles['Hero section'], { overlay: 'dark' })
    assert.equal(parsed.customSections.length, 1)
    assert.equal(parsed.customSections[0].title, 'Our Advisors')
  })
})

