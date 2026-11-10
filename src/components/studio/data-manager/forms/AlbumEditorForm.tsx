'use client'

import { ImageUploadControl } from '@/components/common/ImageUploadControl'

export interface AlbumFormState {
  title: string
  slug: string
  description: string
  category: string
  coverUrl: string
}

interface AlbumEditorFormProps {
  album: AlbumFormState
  setAlbum: React.Dispatch<React.SetStateAction<AlbumFormState>>
  onSlugify: (text: string) => string
}

export function AlbumEditorForm({ album, setAlbum, onSlugify }: AlbumEditorFormProps) {
  return (
    <div className="modal-form">
      <label>
        Album title *
        <input
          required
          placeholder="e.g. Spring Science Fair 2026"
          value={album.title}
          onChange={(e) =>
            setAlbum((prev) => ({
              ...prev,
              title: e.target.value,
              slug: prev.slug || onSlugify(e.target.value),
            }))
          }
        />
      </label>
      <div className="form-grid">
        <label>
          Album Slug (URL)
          <input
            placeholder="spring-science-fair-2026"
            value={album.slug}
            onChange={(e) =>
              setAlbum((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </label>
        <label>
          Category
          <select
            value={album.category}
            onChange={(e) =>
              setAlbum((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="Activities">Activities</option>
            <option value="Campus Life">Campus Life</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Celebrations">Celebrations</option>
          </select>
        </label>
      </div>
      <label>
        Album description
        <textarea
          rows={3}
          placeholder="Describe the moments captured in this album"
          value={album.description}
          onChange={(e) =>
            setAlbum((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </label>
      <div style={{ marginTop: '12px' }}>
        <ImageUploadControl
          label="Album Cover Photo"
          value={album.coverUrl}
          onChange={(url) => setAlbum((prev) => ({ ...prev, coverUrl: url || '' }))}
          aspectRatio="video"
          pickerTitle="Select Album Cover Photo"
          helperText="Primary photo displayed on the gallery album card."
        />
      </div>
    </div>
  )
}
