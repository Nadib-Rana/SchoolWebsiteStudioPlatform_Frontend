import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  extractBearerToken,
  resolveBackendApiBase,
  sanitizeRevalidatePaths,
  sanitizeRevalidateSlug,
  verifyBearerTokenWithBackend,
} from '../src/lib/revalidate-auth.ts'

describe('revalidate authentication and tenant validation', () => {
  it('extractBearerToken rejects missing, non-Bearer, and short tokens', () => {
    assert.equal(extractBearerToken(null), null)
    assert.equal(extractBearerToken('Basic abcdefghijklmnop'), null)
    assert.equal(extractBearerToken('Bearer short'), null)
    assert.equal(
      extractBearerToken('Bearer valid-jwt-token-string-12345'),
      'valid-jwt-token-string-12345',
    )
  })

  it('sanitizeRevalidateSlug rejects empty, traversal, and illegal slugs', () => {
    assert.equal(sanitizeRevalidateSlug(null), null)
    assert.equal(sanitizeRevalidateSlug(''), null)
    assert.equal(sanitizeRevalidateSlug('../admin'), null)
    assert.equal(sanitizeRevalidateSlug('school/other'), null)
    assert.equal(sanitizeRevalidateSlug('greenfield-academy'), 'greenfield-academy')
  })

  it('sanitizeRevalidatePaths restricts paths to the authenticated schoolSlug', () => {
    const paths = sanitizeRevalidatePaths(
      [
        '/greenfield/about',
        '/greenfield/notices',
        '/other-school/about',
        '/greenfield/../secret',
        '/greenfield-other/page',
        42,
      ],
      'greenfield',
    )
    assert.deepEqual(paths, ['/greenfield/about', '/greenfield/notices'])
  })

  it('verifyBearerTokenWithBackend checks /auth/me response status', async () => {
    const ok = await verifyBearerTokenWithBackend(
      'valid-token-value-123',
      (async () => ({ ok: true })) as unknown as typeof fetch,
      'https://api.example.com/api/v1',
    )
    assert.equal(ok, true)

    const rejected = await verifyBearerTokenWithBackend(
      'forged-token-value-123',
      (async () => ({ ok: false })) as unknown as typeof fetch,
      'https://api.example.com/api/v1',
    )
    assert.equal(rejected, false)

    const networkErr = await verifyBearerTokenWithBackend(
      'valid-token-value-123',
      (async () => {
        throw new Error('ECONNREFUSED')
      }) as unknown as typeof fetch,
      'https://api.example.com/api/v1',
    )
    assert.equal(networkErr, false)
  })

  it('resolveBackendApiBase prefers INTERNAL_API_URL and strips trailing slashes', () => {
    assert.equal(
      resolveBackendApiBase({
        INTERNAL_API_URL: 'http://backend:4000/api/v1/',
        NEXT_PUBLIC_API_URL: 'https://public.example.com/api/v1',
      }),
      'http://backend:4000/api/v1',
    )
  })
})

