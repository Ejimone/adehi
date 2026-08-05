import { Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

/**
 * All four faces are self-hosted from our own origin.
 *
 * Clash Display and Satoshi come from Fontshare, which has no npm package, so
 * their .woff2 files are committed under src/fonts and wired up with
 * next/font/local. Instrument Serif and JetBrains Mono are on Google Fonts;
 * next/font/google downloads them at build time and serves them from our
 * origin too, so there is no runtime request to fonts.googleapis.com either.
 *
 * Caveat worth knowing: next/font/google fetches during `next build`. That is
 * fine on Vercel, but would fail in an air-gapped CI.
 */

export const clashDisplay = localFont({
  src: [
    { path: '../fonts/ClashDisplay-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ClashDisplay-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ClashDisplay-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/ClashDisplay-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash',
  display: 'swap',
  // Metric-matched fallback so the swap doesn't reflow the hero.
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const satoshi = localFont({
  src: [
    { path: '../fonts/Satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

/**
 * The second half of the font-transition effect: display headings cross-fade
 * between Clash Display and this, per character, on scroll-in.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

export const fontVariables = [
  clashDisplay.variable,
  satoshi.variable,
  jetbrainsMono.variable,
  instrumentSerif.variable,
].join(' ')
