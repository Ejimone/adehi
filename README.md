# Gabriel Adehi — Portfolio

A motion-led personal site with a self-serve CMS. Monochrome, WebGL-heavy, and
entirely editable without a redeploy.

## Stack

|           |                                                                |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                             |
| Runtime   | React 19.2 — **pinned to `~19.2.x`**, see below                |
| Styling   | Tailwind CSS v4 (CSS-first, tokens in `src/app/globals.css`)   |
| Backend   | Supabase — Postgres + Storage + Auth, all reached from the app |
| Hosting   | Vercel                                                         |

### Why React is pinned

`@react-three/fiber@9` declares `react: ">=19 <19.3"`. A caret range would
happily install 19.3 the day it lands and break every canvas on the site, so
React and React DOM are pinned to `~19.2.8`. Bump them only alongside an R3F
release that widens the range.

## Commands

```bash
pnpm dev          # dev server (add -p 3111 if 3000 is taken)
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write
```

## Layout

```
src/
├── app/
│   ├── globals.css     design tokens — palette, easing, font stacks
│   ├── layout.tsx      root layout, metadata
│   └── page.tsx
└── lib/
    └── cn.ts           the one class-merging helper
```

## Design system

Monochrome by intent. There is no accent hue — contrast comes from type scale
and grain. `--color-accent` is aliased to `--color-paper`, so introducing a
colour later is a one-line change in `globals.css` and nothing else.

```
--color-void    #0a0a0b   background
--color-paper   #f4f2ed   foreground
--color-muted   #8a8a8e   secondary text
--color-line    paper @ 10%
--ease-void     cubic-bezier(0.16, 1, 0.3, 1)
```

One easing curve. Three durations (`--dur-micro` / `--dur-macro` / `--dur-hero`).
Anything reaching for a fourth is probably wrong.

## History

This repo began as a Figma Make export — a Vite SPA carrying 48 unused
shadcn/ui files, ~20 dependencies nothing imported, no tsconfig, and entirely
fictional content. Phase 0 of the reboot removed all of it. The original is
preserved on the `main` branch.
