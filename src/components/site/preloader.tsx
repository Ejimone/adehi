'use client'

import dynamic from 'next/dynamic'

/**
 * Client-only mount wrapper.
 *
 * The curtain must decide whether to play at all from sessionStorage and
 * prefers-reduced-motion — both browser-only. Deciding that inside an effect
 * means calling setState in an effect body (which React Compiler correctly
 * flags) and renders one frame of curtain before hiding it, so reduced-motion
 * users get exactly the flash they asked to avoid.
 *
 * Loading with ssr:false instead means the component only ever evaluates in the
 * browser, so the decision can live in a useState initializer and be right on
 * the very first render.
 *
 * Safe to skip SSR here specifically because the curtain contains no indexable
 * content — it is pure decoration over an already-complete page.
 */
const Curtain = dynamic(() => import('./preloader-curtain'), { ssr: false })

export function Preloader() {
  return <Curtain />
}
