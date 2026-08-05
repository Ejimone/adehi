import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { getPublishedProject } from '@/lib/queries/projects'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Case study'

/**
 * Satori has three constraints that bite here, all handled below:
 *
 *   1. Flexbox only — no grid — and EVERY element with children needs an
 *      explicit display:flex or it throws.
 *   2. Fonts must be .ttf/.otf/.woff. NOT .woff2, and next/font objects cannot
 *      be used at all. Hence the separate TTF copy of Clash Display.
 *   3. The font lives under public/ and is read with process.cwd(). public/ is
 *      guaranteed to exist in the deployment; src/ is not reliably traced into
 *      the serverless bundle.
 *
 * Naming this file opengraph-image.tsx makes Next inject the og:image meta tag
 * automatically — so generateMetadata must NOT also set openGraph.images, or
 * the page emits duplicates.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublishedProject(slug)
  const font = await readFile(join(process.cwd(), 'public/og/ClashDisplay-600.ttf'))

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: '#0a0a0b',
        color: '#f4f2ed',
        padding: 84,
        fontFamily: 'Clash',
      }}
    >
      <div style={{ display: 'flex', fontSize: 24, opacity: 0.5, letterSpacing: 4 }}>
        {[project?.role, project?.year].filter(Boolean).join(' · ').toUpperCase() ||
          'CASE STUDY'}
      </div>
      <div style={{ display: 'flex', fontSize: 82, lineHeight: 1.05, marginTop: 24 }}>
        {project?.title ?? 'Gabriel Adehi'}
      </div>
      {project?.tagline ? (
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.55, marginTop: 20 }}>
          {project.tagline}
        </div>
      ) : null}
    </div>,
    {
      ...size,
      fonts: [{ name: 'Clash', data: font, style: 'normal', weight: 600 }],
    },
  )
}
