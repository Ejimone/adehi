import { Outfit, Poiret_One } from 'next/font/google'

/**
 * Two faces, matching the reference's own pairing.
 *
 * Poiret One is doing most of the work: very light, wide, art-deco, with an
 * enormous x-height-to-stroke contrast. It is the single biggest reason the
 * reference reads elegant rather than corporate, and it only holds up at large
 * sizes — never set body copy in it.
 *
 * Outfit carries everything else, including micro-labels (via wide tracking
 * rather than a separate mono face).
 *
 * Both come through next/font/google, which downloads at build time and serves
 * from our own origin — no runtime request to fonts.googleapis.com.
 */

export const poiretOne = Poiret_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-poiret',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const fontVariables = [poiretOne.variable, outfit.variable].join(' ')
