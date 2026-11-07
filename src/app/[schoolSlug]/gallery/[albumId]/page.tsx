import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData, getPublicAlbum } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { AlbumPhotoGrid } from '@/components/public-site/AlbumPhotoGrid'

interface PageProps {
  params: Promise<{ schoolSlug: string; albumId: string }>
}

export default async function AlbumDetailPage({ params }: PageProps) {
  const { schoolSlug, albumId } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  // Preloaded or single fetch
  let album = siteData.albums?.find(
    (a) => a.id === albumId || a.slug === albumId,
  )
  if (!album) {
    album = (await getPublicAlbum(schoolSlug, albumId)) || undefined
  }

  if (!album) {
    notFound()
  }

  const photos = album.photos || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>
          {album.category?.toUpperCase() || 'PHOTO ALBUM'} · {photos.length}{' '}
          {photos.length === 1 ? 'PHOTO' : 'PHOTOS'}
        </span>
        <h1>{album.title}</h1>
        {album.description && <p>{album.description}</p>}
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} />{' '}
          <Link href={`/${schoolSlug}/gallery`} className="hover:underline">
            Photo Gallery
          </Link>{' '}
          <Icon name="chevron" size={11} /> {album.title}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${schoolSlug}/gallery`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors"
          >
            <Icon name="arrow" size={14} className="rotate-180" /> Back to all albums
          </Link>
        </div>

        <AlbumPhotoGrid photos={photos} albumTitle={album.title} />
      </section>
    </main>
  )
}
