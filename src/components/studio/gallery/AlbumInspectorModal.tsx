'use client'

import type { RefObject } from 'react'
import { Icon } from '@/components/common/Icon'
import type { InspectAlbumData } from './gallery.types'

interface AlbumInspectorModalProps {
  album: InspectAlbumData | null
  loading: boolean
  uploading: boolean
  deletingPhotoId: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  onClose: () => void
  onOpenMediaPicker: () => void
  onSetCover: (url: string) => void
  onDeletePhoto: (photoId: string) => void
}

export function AlbumInspectorModal({
  album,
  loading,
  uploading,
  deletingPhotoId,
  fileInputRef,
  onClose,
  onOpenMediaPicker,
  onSetCover,
  onDeletePhoto,
}: AlbumInspectorModalProps) {
  if (!album) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 flex items-center justify-center text-blue-900">
              <Icon name="image" size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {album.title}
              </h2>
              <p className="text-xs text-slate-500">
                {album.photos.length} photos in album · Click any photo to make it cover
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Icon name="plus" size={13} />
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </button>

            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Icon name="image" size={13} />
              Choose from Library
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors ml-2"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body: Photos Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Loading album photos...
            </div>
          ) : album.photos.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Icon name="image" size={28} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No photos in this album yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                Upload images from school sports, academic fairs, ceremonies, or campus activities to display on the public website.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Upload from Computer
                </button>
                <button
                  type="button"
                  onClick={onOpenMediaPicker}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
                >
                  Select from Media Library
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {album.photos.map((photo) => {
                const isCover = album.coverUrl === photo.url
                const isDeleting = deletingPhotoId === photo.id

                return (
                  <div
                    key={photo.id}
                    className={`group relative rounded-xl overflow-hidden border bg-slate-50 flex flex-col transition-all shadow-sm ${
                      isCover
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Album photo'}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />

                      {isCover && (
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <span>★</span> Cover
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => onSetCover(photo.url)}
                            className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-[11px] font-bold shadow-md transition-transform hover:scale-105"
                            title="Set as album cover"
                          >
                            Set Cover
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDeletePhoto(photo.id)}
                          disabled={isDeleting}
                          className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center text-xs shadow-md transition-transform hover:scale-105 disabled:opacity-50"
                          title="Delete photo from album and storage"
                        >
                          <Icon name="close" size={13} />
                        </button>
                      </div>
                    </div>

                    {photo.caption && (
                      <div className="p-2 text-[11px] text-slate-600 font-medium truncate">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {album.photos.length} photo
            {album.photos.length === 1 ? '' : 's'} total
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
