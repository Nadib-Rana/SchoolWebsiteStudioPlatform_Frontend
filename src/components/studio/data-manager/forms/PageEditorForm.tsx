'use client'

import { ImageUploadControl } from '@/components/common/ImageUploadControl'

export interface PageFormState {
  title: string
  slug: string
  navLabel: string
  status: string
  metaTitle: string
  metaDescription: string
  featuredImage: string
}

interface PageEditorFormProps {
  page: PageFormState
  setPage: React.Dispatch<React.SetStateAction<PageFormState>>
  onSlugify: (text: string) => string
}

export function PageEditorForm({ page, setPage, onSlugify }: PageEditorFormProps) {
  return (
    <div className="modal-form">
      <label>
        Page title *
        <input
          required
          placeholder="e.g. Student Life"
          value={page.title}
          onChange={(e) =>
            setPage((prev) => ({
              ...prev,
              title: e.target.value,
              slug: prev.slug || onSlugify(e.target.value),
            }))
          }
        />
      </label>
      <div className="form-grid">
        <label>
          Page Slug (URL) *
          <input
            required
            placeholder="student-life"
            value={page.slug}
            onChange={(e) =>
              setPage((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </label>
        <label>
          Navigation Label
          <input
            placeholder="e.g. Student Life"
            value={page.navLabel}
            onChange={(e) =>
              setPage((prev) => ({ ...prev, navLabel: e.target.value }))
            }
          />
        </label>
      </div>
      <div style={{ marginBottom: '14px' }}>
        <ImageUploadControl
          label="Page Featured Banner Image"
          value={page.featuredImage}
          onChange={(url) => setPage((prev) => ({ ...prev, featuredImage: url || '' }))}
          aspectRatio="video"
          pickerTitle="Select Page Featured Banner Image"
          helperText="Banner image displayed at the top of this inner page."
        />
      </div>
      <label>
        Meta Description (SEO)
        <textarea
          rows={2}
          placeholder="Search engine summary for this page"
          value={page.metaDescription}
          onChange={(e) =>
            setPage((prev) => ({ ...prev, metaDescription: e.target.value }))
          }
        />
      </label>
    </div>
  )
}
