# Gabriel Adehi — Portfolio

A motion-led personal site with a self-serve CMS. Warm, light, and editable
end-to-end without a redeploy.

**Live:** https://gabriel-two-dun.vercel.app
**Admin:** `/gabriel`

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19.2 — **pinned to `~19.2.x`**, see below |
| Styling | Tailwind CSS v4 (CSS-first, tokens in `src/app/globals.css`) |
| Backend | Supabase — Postgres + Storage + Auth, in a dedicated `gabriel` schema |
| Motion | Lenis (smooth scroll) + GSAP ScrollTrigger (lazy-loaded) + CSS |
| Hosting | Vercel (`fra1`, co-located with the eu-central-1 database) |

### Why React is pinned

`@react-three/fiber@9` declares `react: ">=19 <19.3"`. A caret range would
install 19.3 the day it lands and break every canvas, so React and React DOM are
pinned to `~19.2.8`. Bump only alongside an R3F release that widens the range.

## Commands

```bash
pnpm dev          # dev server (add -p 3111 if 3000 is taken)
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write
```

## Design system

Warm and light, derived from a single accent hue. Borders and washes are that
orange at reduced alpha rather than neutral greys, which is what keeps the page
warm everywhere instead of only where the accent appears.

```
--color-bg              #fff2e0   warm cream ground
--color-ink             #34170a   dark brown text
--color-primary         #b55500   accent — LARGE text, fills, borders only (4.46:1)
--color-primary-strong  #8c3f00   accent TEXT, links, small fills          (6.73:1)
--color-muted    ink @ 72%        body copy                                (6.31:1)
--ease-void      cubic-bezier(0.16, 1, 0.3, 1)
```

**Contrast is load-bearing here.** The reference site this was modelled on uses
its accent at 64% alpha for muted text, which measures **2.49:1** against the
cream — a hard WCAG AA failure. Muted text is therefore the *ink* at alpha, not
the accent, and any solid fill carrying small type uses `primary-strong`. Verify
with the snippet in `docs/` before changing a colour.

Two faces: **Poiret One** (display, single 400 weight — never below ~24px, never
negative tracking) and **Outfit** (everything else, including micro-labels via
wide tracking). Both self-hosted through `next/font/google`; there is no runtime
request to Google.

`/styleguide` renders the whole system on one page. Unlinked and noindex.

## Architecture notes

**Public pages are statically rendered.** They read Supabase through a
*cookie-less* client (`src/lib/supabase/public.ts`). `@supabase/ssr` always
touches `cookies()`, and calling that in a Server Component opts the route out
of static rendering — using it on `/work/[slug]` would silently turn every case
study dynamic and make `generateStaticParams` decorative. Check the `○`/`●`
markers in `next build` output after any data-layer change.

**Markdown is rendered on write, not read.** Projects store `body_md` (editable)
and `body_html` (derived in the Server Action). The public bundle ships no
markdown parser and case-study pages parse nothing at request time.

**RLS is the security boundary**, not the obscure admin URL. Anonymous visitors
can read published rows and insert a contact message; everything else is denied
at both the GRANT and policy layers, so leaking the inbox takes two independent
mistakes.

**Motion is never load-bearing.** Scroll reveals are gated behind a `.js` class
set by an inline script, so a JS failure leaves content visible rather than
permanently transparent. The card stack is `position: sticky` in pure CSS; GSAP
only adds the depth cue on top.

## CMS

Everything on the public site is a row in the `gabriel` schema, edited at
`/gabriel`. Saving calls `updateTag`, so the public site reflects the change on
its next request — **no redeploy**.

Logged out, `/gabriel` renders an anonymous login form: no name, no logo, no
"Admin", and a neutral `<title>`. It is deliberately absent from `robots.txt`,
since a `Disallow: /gabriel` line would publicly advertise the exact path it is
meant to hide.

## Deploy

Env vars are documented in `.env.example`. On Vercel, all `NEXT_PUBLIC_*` values
plus `REVALIDATE_SECRET` are set for production, preview and development.

`SUPABASE_SECRET_KEY` is **not yet set** — the `/cv` route needs it to sign URLs
for the private documents bucket, and returns 404 until it is. Get it from
Supabase → Project Settings → API Keys → secret key.

## History

This repo began as a Figma Make export: a Vite SPA with 48 unused shadcn/ui
files, ~20 dependencies nothing imported, no tsconfig, and entirely fictional
content. All of it was removed. Nothing fabricated was carried forward — where a
real value is unknown the field is empty and the UI hides that block.
