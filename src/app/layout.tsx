import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { fontVariables } from '@/lib/fonts'

import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  // Without metadataBase, every relative OG image URL silently resolves wrong.
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gabriel Adehi',
    template: '%s — Gabriel Adehi',
  },
  description: 'Software engineer. Building at the intersection of systems and craft.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Gabriel Adehi',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
