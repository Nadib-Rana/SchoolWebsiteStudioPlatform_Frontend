const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const MAX_RAW_BYTES = 10 * 1024 * 1024
const MAX_OUTPUT_BYTES = Math.floor(1.5 * 1024 * 1024)
const MAX_DIMENSION = 512

function estimateDataUriBytes(dataUri: string): number {
  const commaIdx = dataUri.indexOf(',')
  if (commaIdx === -1) return dataUri.length
  const base64 = dataUri.slice(commaIdx + 1)
  return Math.ceil((base64.length * 3) / 4)
}

export async function compressStudentPhoto(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image file.')
  }
  if (file.size > MAX_RAW_BYTES) {
    throw new Error('Selected photo is too large (max 10 MB before resize).')
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not read the selected image file.'))
      el.src = objectUrl
    })

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width || 1, img.height || 1))
    const width = Math.max(1, Math.round((img.width || MAX_DIMENSION) * scale))
    const height = Math.max(1, Math.round((img.height || MAX_DIMENSION) * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Browser canvas is unavailable for image processing.')
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    const encode = (quality: number): string => {
      const webp = canvas.toDataURL('image/webp', quality)
      if (webp.startsWith('data:image/webp')) {
        return webp
      }
      return canvas.toDataURL('image/jpeg', quality)
    }

    let dataUri = encode(0.85)
    if (estimateDataUriBytes(dataUri) > MAX_OUTPUT_BYTES) {
      dataUri = encode(0.68)
    }
    if (estimateDataUriBytes(dataUri) > MAX_OUTPUT_BYTES) {
      throw new Error('Compressed photo still exceeds 1.5 MB. Please choose a smaller image.')
    }

    return dataUri
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
