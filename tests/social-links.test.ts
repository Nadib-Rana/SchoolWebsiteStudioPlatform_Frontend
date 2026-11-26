import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeExternalUrl,
  safePublicHref,
  sanitizeSocialLinks,
} from '../src/lib/social-links.ts'

describe('normalizeExternalUrl', () => {
  it('returns undefined for empty or non-string inputs', () => {
    assert.equal(normalizeExternalUrl(undefined), undefined)
    assert.equal(normalizeExternalUrl(null), undefined)
    assert.equal(normalizeExternalUrl('   '), undefined)
  })

  it('rejects dangerous XSS schemes including control-character obfuscated variants', () => {
    assert.equal(normalizeExternalUrl('javascript:alert(1)'), undefined)
    assert.equal(normalizeExternalUrl('  JAVASCRIPT:alert(1)'), undefined)
    assert.equal(normalizeExternalUrl('java\nscript:alert(1)'), undefined)
    assert.equal(normalizeExternalUrl('java\tscript:alert(1)'), undefined)
    assert.equal(normalizeExternalUrl('data:text/html,<script>alert(1)</script>'), undefined)
    assert.equal(normalizeExternalUrl('vbscript:msgbox(1)'), undefined)
    assert.equal(normalizeExternalUrl('file:///etc/passwd'), undefined)
    assert.equal(normalizeExternalUrl('blob:https://evil.test/123'), undefined)
  })

  it('preserves valid http/https URLs and prefixes bare domains with https://', () => {
    assert.equal(
      normalizeExternalUrl('https://erp.northfield.edu/login'),
      'https://erp.northfield.edu/login',
    )
    assert.equal(
      normalizeExternalUrl('http://localhost:4000/portal'),
      'http://localhost:4000/portal',
    )
    assert.equal(
      normalizeExternalUrl('facebook.com/northfield'),
      'https://facebook.com/northfield',
    )
  })
})

describe('safePublicHref', () => {
  it('allows relative app routes but blocks protocol-relative // and javascript:', () => {
    assert.equal(safePublicHref('/notices/sample.pdf'), '/notices/sample.pdf')
    assert.equal(safePublicHref('//evil.com/phish'), 'https://evil.com/phish')
    assert.equal(safePublicHref('javascript:alert(document.cookie)'), undefined)
  })
})

describe('sanitizeSocialLinks', () => {
  it('strips malicious social/ERP URLs while keeping valid links and labels', () => {
    const cleaned = sanitizeSocialLinks({
      erpLoginUrl: 'javascript:alert(1)',
      erpLoginLabel: '  ERP Portal  ',
      facebook: 'facebook.com/myschool',
      youtube: 'data:text/html,xss',
      whatsapp: '+8801700000000',
    })

    assert.equal(cleaned.erpLoginUrl, undefined)
    assert.equal(cleaned.erpLoginLabel, 'ERP Portal')
    assert.equal(cleaned.facebook, 'https://facebook.com/myschool')
    assert.equal(cleaned.youtube, undefined)
    assert.equal(cleaned.whatsapp, '+8801700000000')
  })
})

