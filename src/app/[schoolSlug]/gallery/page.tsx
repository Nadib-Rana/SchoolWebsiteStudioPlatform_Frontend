import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublicSiteData } from '@/lib/public-site'
import { Icon } from '@/components/common/Icon'
import { GalleryViewer } from '@/components/public-site/GalleryViewer'

interface PageProps {
  params: Promise<{ schoolSlug: string }>
}

export default async function GalleryPage({ params }: PageProps) {
  const { schoolSlug } = await params
  const siteData = await getPublicSiteData(schoolSlug)

  if (!siteData) {
    notFound()
  }

  const albums = siteData.albums || []

  return (
    <main className="inner-page">
      <section className="inner-hero">
        <span>CAMPUS LIFE IN PICTURES</span>
        <h1>School Moments & Gallery</h1>
        <p>
          A vibrant glimpse into classrooms, creative arts, athletic competitions, community service, and everyday student life.
        </p>
        <div className="breadcrumb">
          <Link href={`/${schoolSlug}`} className="hover:underline">
            Home
          </Link>{' '}
          <Icon name="chevron" size={11} /> Photo Gallery
        </div>
      </section>

      <GalleryViewer
        albums={albums}
        schoolSlug={schoolSlug}
        schoolName={siteData.school.name}
      />
    </main>
  )
}
