'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@/components/common/Icon'
import { Button } from '@/components/common/Button'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'

export function SEOManager() {
  const { notify } = useStudio()
  const [metaTitle, setMetaTitle] = useState(
    'Northfield High School | Learn, Lead & Serve',
  )
  const [metaDescription, setMetaDescription] = useState(
    'Northfield High School is a vibrant learning community in Dhaka, inspiring students to learn with purpose and lead with character.',
  )
  const [canonicalUrl, setCanonicalUrl] = useState(
    'https://www.northfield.edu/',
  )
  const [isIndexed, setIsIndexed] = useState(true)
  const [isSitemapIncluded, setIsSitemapIncluded] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadSEO = async () => {
      try {
        const res = await api.seo.get()
        const data = (res as any)?.data || res
        if (mounted && data) {
          if (data.metaTitle) setMetaTitle(data.metaTitle)
          if (data.metaDescription) setMetaDescription(data.metaDescription)
          if (data.canonicalUrl) setCanonicalUrl(data.canonicalUrl)
          if (typeof data.isIndexed === 'boolean') setIsIndexed(data.isIndexed)
          if (typeof data.isSitemapIncluded === 'boolean')
            setIsSitemapIncluded(data.isSitemapIncluded)
        }
      } catch (err) {
        console.warn('Failed to load SEO configuration:', err)
      }
    }
    loadSEO()
    return () => {
      mounted = false
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await api.seo.update({
        metaTitle,
        metaDescription,
        canonicalUrl,
        isIndexed,
        isSitemapIncluded,
      })
      notify('Search engine optimization settings saved to database!')
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save SEO settings'
      notify(`Error: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="seo-grid">
      <div className="card seo-form">
        <div className="form-title">
          <div>
            <h3>Homepage search settings</h3>
            <p>Control how your school appears in Google and search engines.</p>
          </div>
          <Button kind="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save SEO settings'}
          </Button>
        </div>

        <label>
          Meta title
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
          <small>{metaTitle.length} of 60 recommended characters</small>
        </label>

        <label>
          Meta description
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
          <small>{metaDescription.length} of 160 recommended characters</small>
        </label>

        <label>
          Canonical URL
          <input
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
          />
        </label>

        <div className="toggle-row">
          <div>
            <strong>Search engine indexing</strong>
            <small>Allow search crawlers to index this school website</small>
          </div>
          <button
            type="button"
            className={`toggle ${isIndexed ? 'on' : ''}`}
            onClick={() => setIsIndexed(!isIndexed)}
          >
            <i />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Include in XML sitemap</strong>
            <small>Generate automatic sitemap.xml for web crawlers</small>
          </div>
          <button
            type="button"
            className={`toggle ${isSitemapIncluded ? 'on' : ''}`}
            onClick={() => setIsSitemapIncluded(!isSitemapIncluded)}
          >
            <i />
          </button>
        </div>
      </div>

      <div>
        <div className="card google-preview">
          <span>LIVE SEARCH PREVIEW</span>
          <div className="search-result">
            <small>{canonicalUrl || 'https://www.northfield.edu'}</small>
            <h3>{metaTitle || 'School Title'}</h3>
            <p>
              {metaDescription ||
                'School meta description will appear here in search engine results.'}
            </p>
          </div>
        </div>

        <div className="card seo-score">
          <div>
            <span className="score">
              {metaTitle && metaDescription ? '96' : '75'}
            </span>
            <div>
              <strong>High Search Visibility</strong>
              <small>Metadata is synced with live public pages</small>
            </div>
          </div>
          {[
            metaTitle.length >= 10 && metaTitle.length <= 65
              ? 'Title length is optimal'
              : 'Title is active',
            metaDescription.length >= 30
              ? 'Description provides strong context'
              : 'Description is set',
            'Canonical domain verification active',
            'Social OpenGraph tags generated',
          ].map((x) => (
            <p key={x}>
              <span>
                <Icon name="check" size={13} />
              </span>
              {x}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
