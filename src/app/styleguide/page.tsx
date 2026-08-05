import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Action } from '@/components/ui/action'
import { Container, Measure } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { Surface } from '@/components/ui/surface'

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
}

const SWATCHES = [
  { cls: 'bg-bg', label: 'bg', note: '#fff2e0' },
  { cls: 'bg-white', label: 'white', note: '#fffaf2' },
  { cls: 'bg-ink', label: 'ink', note: '#34170a' },
  { cls: 'bg-primary', label: 'primary', note: '#b55500 — large/fills only' },
  {
    cls: 'bg-primary-strong',
    label: 'primary-strong',
    note: '#8c3f00 — text and small fills',
  },
  { cls: 'bg-muted', label: 'muted', note: 'ink / 72% — 6.31:1' },
  { cls: 'bg-line', label: 'line', note: 'primary / 36%' },
  { cls: 'bg-hairline', label: 'hairline', note: 'primary / 16%' },
  { cls: 'bg-wash', label: 'wash', note: 'primary / 5%' },
  { cls: 'bg-deep', label: 'deep', note: '#34170a — preloader' },
]

/**
 * `face` matters: the size tokens are independent of the faces, so a specimen
 * set in the wrong one would misrepresent how the step looks in use.
 */
const SCALE = [
  {
    cls: 'text-display',
    face: 'font-display',
    name: 'display',
    note: 'clamp(3rem, 11vw, 10rem)',
  },
  {
    cls: 'text-h1',
    face: 'font-display',
    name: 'h1',
    note: 'clamp(2.25rem, 6vw, 4.5rem)',
  },
  {
    cls: 'text-h2',
    face: 'font-display',
    name: 'h2',
    note: 'clamp(1.75rem, 3.6vw, 3rem)',
  },
  {
    cls: 'text-h3',
    face: 'font-display',
    name: 'h3',
    note: 'clamp(1.25rem, 2vw, 1.75rem)',
  },
  {
    cls: 'text-lead',
    face: 'font-sans',
    name: 'lead',
    note: 'clamp(1.06rem, 1.4vw, 1.31rem)',
  },
  { cls: 'text-body', face: 'font-sans', name: 'body', note: '1rem' },
  { cls: 'text-small', face: 'font-sans', name: 'small', note: '0.875rem' },
]

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-hairline border-t py-14">
      <SectionLabel className="mb-10">{title}</SectionLabel>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  return (
    <Container className="py-20">
      <header className="pb-12">
        <p className="text-muted text-micro mb-6 uppercase">
          Internal — not linked, not indexed
        </p>
        <h1 className="text-h1 font-display">Design system</h1>
        <Measure className="text-muted text-lead mt-6">
          The whole system on one page. If something here looks wrong, it is wrong
          everywhere.
        </Measure>
      </header>

      <Row title="Palette">
        <p className="text-muted text-small mb-8 max-w-[58ch]">
          Every muted tone, border and wash is the accent orange at reduced alpha — never
          a neutral grey. That is what makes the page read warm throughout rather than
          only where the accent appears.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SWATCHES.map((s) => (
            <div key={s.label}>
              <div
                className={`border-hairline mb-3 aspect-[4/3] rounded-xl border ${s.cls}`}
              />
              <p className="text-small">{s.label}</p>
              <p className="text-muted text-small opacity-70">{s.note}</p>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Type scale">
        <div className="space-y-8">
          {SCALE.map((s) => (
            <div key={s.cls} className="border-hairline border-b pb-8 last:border-0">
              <div className="text-muted text-micro mb-3 flex flex-wrap gap-4 uppercase">
                <span className="text-ink">{s.name}</span>
                <span className="tracking-normal normal-case">{s.note}</span>
                <span className="tracking-normal normal-case">{s.face}</span>
              </div>
              <p className={`${s.cls} ${s.face}`}>Systems and craft</p>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Faces">
        <div className="space-y-10">
          <div>
            <p className="text-muted text-micro mb-3 uppercase">
              Poiret One — display, 400 only
            </p>
            <p className="font-display text-h2">ABCDEFGHIJKLM 0123456789</p>
            <p className="text-muted text-small mt-3 max-w-[58ch]">
              A single thin weight built for large sizes. Never set it below ~24px and
              never give it negative tracking — both collapse the counters and turn it
              spindly.
            </p>
          </div>
          <div>
            <p className="text-muted text-micro mb-3 uppercase">
              Outfit — body and labels
            </p>
            <p className="text-h3 font-sans">ABCDEFGHIJKLM 0123456789</p>
            <p className="text-muted text-small mt-3 max-w-[58ch]">
              Carries everything else, including micro-labels via wide tracking. There is
              no third face — no mono — deliberately.
            </p>
          </div>
        </div>
      </Row>

      <Row title="Actions">
        <div className="flex flex-wrap items-center gap-4">
          <Action href="/styleguide">Selected work</Action>
          <Action href="/styleguide" variant="ghost">
            About
          </Action>
          <Action href="/styleguide" variant="ghost" arrow={false}>
            No arrow
          </Action>
        </div>
      </Row>

      <Row title="Surfaces and the spine">
        <div className="spine grid gap-x-12 gap-y-6 pb-2 lg:grid-cols-2">
          <Surface className="p-6">
            <p className="text-small">Static</p>
            <p className="text-muted text-small mt-2">No hover treatment.</p>
          </Surface>
          <Surface interactive className="p-6">
            <p className="text-small">Interactive</p>
            <p className="text-muted text-small mt-2">CSS-only hover, no JS.</p>
          </Surface>
        </div>
        <p className="text-muted text-small mt-8 max-w-[58ch]">
          The hairline above runs between the columns — that is the spine, the
          site&rsquo;s one structural motif. It also appears in the preloader mark and as
          the blockquote rule.
        </p>
      </Row>

      <Row title="Motion">
        <dl className="text-small grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-baseline">
          <dt className="text-muted text-micro uppercase">--ease-void</dt>
          <dd>cubic-bezier(0.16, 1, 0.3, 1)</dd>
          <dt className="text-muted text-micro uppercase">--dur-micro</dt>
          <dd>0.4s — hovers, buttons, small state changes</dd>
          <dt className="text-muted text-micro uppercase">--dur-macro</dt>
          <dd>0.8s — section reveals, card entrances</dd>
          <dt className="text-muted text-micro uppercase">--dur-hero</dt>
          <dd>1.2s — hero and page transitions</dd>
          <dt className="text-muted text-micro uppercase">--stagger</dt>
          <dd>0.06s — per-item delay in a sequence</dd>
        </dl>
      </Row>
    </Container>
  )
}
