'use client'

import { Icon } from '@/components/common/Icon'

interface MediaUploadFormProps {
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
}

export function MediaUploadForm({ selectedFile, setSelectedFile }: MediaUploadFormProps) {
  return (
    <div className="upload-drop p-8 text-center flex flex-col items-center">
      <Icon name="image" size={36} className="text-slate-400 mb-2" />
      <strong>Select image or document</strong>
      <span className="text-xs text-slate-500 mb-4">
        Files are securely stored in Object Storage and registered in PostgreSQL.
      </span>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) setSelectedFile(e.target.files[0])
        }}
        className="text-xs"
      />
      {selectedFile && (
        <p className="mt-2 text-xs font-bold text-blue-900">
          Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
        </p>
      )}
    </div>
  )
}
