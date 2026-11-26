import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  escapeHtml,
  renderLogoBox,
  resolveAbsoluteUrl,
} from '../src/components/public-site/admission/admission-receipt-print.ts'

describe('admission-receipt-print security helpers', () => {
  it('escapes HTML special characters and handles empty values', () => {
    assert.equal(escapeHtml(null), '—')
    assert.equal(escapeHtml(''), '—')
    assert.equal(
      escapeHtml('<script>alert("xss")</script>'),
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    )
    assert.equal(escapeHtml("O'Reilly"), 'O&#39;Reilly')
  })

  it('rejects javascript:, vbscript:, file:, and non-image data: URLs', () => {
    assert.equal(resolveAbsoluteUrl('javascript:alert(1)'), undefined)
    assert.equal(resolveAbsoluteUrl('vbscript:msgbox(1)'), undefined)
    assert.equal(resolveAbsoluteUrl('file:///etc/passwd'), undefined)
    assert.equal(resolveAbsoluteUrl('data:text/html,<script>1</script>'), undefined)
    assert.equal(
      resolveAbsoluteUrl('data:image/png;base64,iVBORw0KGgo='),
      'data:image/png;base64,iVBORw0KGgo=',
    )
    assert.equal(
      resolveAbsoluteUrl('https://cdn.school.edu/logo.png'),
      'https://cdn.school.edu/logo.png',
    )
  })

  it('prevents inline JS breakout in renderLogoBox when initial contains quotes', () => {
    const html = renderLogoBox(
      'https://cdn.school.edu/logo.png',
      "St. Xavier's Academy",
      "';alert(1);//",
    )

    assert.ok(html.includes('data-initial="&#39;;alert(1);//"'))
    assert.ok(!html.includes("textContent='&#39;;alert(1);//'"))
    assert.ok(html.includes("this.getAttribute('data-initial')||'S'"))
  })
})

