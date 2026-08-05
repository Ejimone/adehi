import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { fontVariables } from '@/lib/fonts'

import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3111'

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
  // Matches --color-bg, so the mobile browser chrome blends into the page.
  themeColor: '#fff2e0',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        {/*
          Marks the document as script-capable before first paint, which is what
          the scroll-reveal CSS keys off. It has to be inline and synchronous:
          setting it from React would run after paint and cause a visible flash
          as everything below the fold jumped to hidden.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
