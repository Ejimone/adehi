/**
 * Paper texture.
 *
 * On the previous dark ground this was a light noise in `overlay`. That does
 * not translate: on a warm light ground the same treatment reads as dirt. Here
 * it is a much finer noise in `multiply` at very low opacity, which settles into
 * the cream rather than sitting on top of it — the difference between paper
 * stock and a dusty screen.
 *
 * Pure CSS, server component, no JS.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: NOISE, backgroundSize: '220px' }}
      />
    </div>
  )
}
