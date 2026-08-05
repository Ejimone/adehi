/**
 * Fixed film-grain overlay.
 *
 * Pure CSS and a server component — no JS, no canvas. Phase 4 replaces this
 * with a shader that also carries a slow displacement and a cursor-tracked
 * light sweep, but this stays as the fallback for reduced-motion, mobile, and
 * any device that fails the WebGL capability check, so it has to look right on
 * its own rather than as a degraded placeholder.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: '180px' }}
      />
      {/* A single soft pool of light off the top. Gives the void depth so it
          reads as space rather than as a flat black fill. */}
      <div className="absolute -top-1/4 left-1/2 h-[42rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(244_242_237/0.05),transparent)]" />
    </div>
  )
}
