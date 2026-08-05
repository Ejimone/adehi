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
  { token: '--color-void', cls: 'bg-void', label: 'void', hex: '#0a0a0b' },
  { token: '--color-paper', cls: 'bg-paper', label: 'paper', hex: '#f4f2ed' },
  { token: '--color-muted', cls: 'bg-muted', label: 'muted', hex: '#8a8a8e' },
  { token: '--color-raised', cls: 'bg-raised', label: 'raised', hex: 'paper / 4%' },
  {
    token: '--color-raised-hi',
    cls: 'bg-raised-hi',
    label: 'raised-hi',
    hex: 'paper / 8%',
  },
  { token: '--color-line', cls: 'bg-line', label: 'line', hex: 'paper / 10%' },
]

/**
 * `face` matters here: the size tokens are independent of the faces, so a
 * specimen rendered in the wrong one would misrepresent how the step actually
 * looks in use. Display steps land on headings (which get font-display from
 * the base layer); the rest is body copy in Satoshi.
 */
const SCALE = [
  {
    cls: 'text-display',
    face: 'font-display',
    name: 'display',
    note: 'clamp(3.25rem, 13vw, 12rem)',
  },
  {
    cls: 'text-h1',
    face: 'font-display',
    name: 'h1',
    note: 'clamp(2.5rem, 6.5vw, 5rem)',
  },
  {
    cls: 'text-h2',
    face: 'font-display',
    name: 'h2',
    note: 'clamp(1.875rem, 4vw, 3.25rem)',
  },
  {
    cls: 'text-h3',
    face: 'font-display',
    name: 'h3',
    note: 'clamp(1.375rem, 2.2vw, 2rem)',
  },
  {
    cls: 'text-lead',
    face: 'font-sans',
    name: 'lead',
    note: 'clamp(1.0625rem, 1.5vw, 1.375rem)',
  },
  { cls: 'text-body', face: 'font-sans', name: 'body', note: '1rem' },
  { cls: 'text-small', face: 'font-sans', name: 'small', note: '0.875rem' },
]

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-line border-t py-16">
      <SectionLabel className="mb-10">{title}</SectionLabel>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  return (
    <Container className="py-24">
      <header className="pb-16">
        <p className="text-muted text-micro mb-6 font-mono uppercase">
          Internal — not linked, not indexed
        </p>
        <h1 className="text-h1">Void</h1>
        <Measure className="text-muted text-lead mt-6">
          The whole design system on one page. If something here looks wrong, it is wrong
          everywhere.
        </Measure>
      </header>

      <Row title="Palette">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.token}>
              <div
                className={`border-line mb-3 aspect-square rounded-xl border ${s.cls}`}
              />
              <p className="text-small">{s.label}</p>
              <p className="text-muted text-micro font-mono tracking-normal normal-case">
                {s.hex}
              </p>
            </div>
          ))}
        </div>
      </Row>

      <Row title="Type scale">
        <div className="space-y-8">
          {SCALE.map((s) => (
            <div key={s.cls} className="border-line border-b pb-8 last:border-0">
              <div className="text-muted text-micro mb-3 flex gap-4 font-mono">
                <span className="text-paper">{s.name}</span>
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
            <p className="text-muted text-micro mb-3 font-mono">
              Clash Display — display
            </p>
            <p className="font-display text-h2">ABCDEFGHIJKLM 0123456789</p>
          </div>
          <div>
            <p className="text-muted text-micro mb-3 font-mono">Satoshi — body</p>
            <p className="text-h3 font-sans">ABCDEFGHIJKLM 0123456789</p>
          </div>
          <div>
            <p className="text-muted text-micro mb-3 font-mono">
              Instrument Serif — the font transition
            </p>
            <p className="text-h2 font-serif italic">ABCDEFGHIJKLM 0123456789</p>
          </div>
          <div>
            <p className="text-muted text-micro mb-3 font-mono">
              JetBrains Mono — labels
            </p>
            <p className="text-h3 font-mono">ABCDEFGHIJKLM 0123456789</p>
          </div>
        </div>
      </Row>

      <Row title="Actions">
        <div className="flex flex-wrap items-center gap-4">
          <Action href="/styleguide">View work</Action>
          <Action href="/styleguide" variant="ghost">
            Get in touch
          </Action>
          <Action href="/styleguide" variant="ghost" arrow={false}>
            No arrow
          </Action>
        </div>
      </Row>

      <Row title="Surfaces">
        <div className="grid gap-4 sm:grid-cols-3">
          <Surface className="p-6">
            <p className="text-small">Static</p>
            <p className="text-muted text-small mt-2">No hover treatment.</p>
          </Surface>
          <Surface interactive className="p-6">
            <p className="text-small">Interactive</p>
            <p className="text-muted text-small mt-2">CSS-only hover. No JS.</p>
          </Surface>
          <Surface interactive className="p-6">
            <p className="text-small">Interactive</p>
            <p className="text-muted text-small mt-2">Lifts 4px on the house curve.</p>
          </Surface>
        </div>
      </Row>

      <Row title="Labels">
        <div className="space-y-6">
          <SectionLabel index="01">Selected work</SectionLabel>
          <SectionLabel index="02">About</SectionLabel>
          <SectionLabel>No index</SectionLabel>
        </div>
      </Row>

      <Row title="Motion">
        <dl className="text-small grid gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-baseline">
          <dt className="text-muted text-micro font-mono">--ease-void</dt>
          <dd className="font-mono">cubic-bezier(0.16, 1, 0.3, 1)</dd>
          <dt className="text-muted text-micro font-mono">--dur-micro</dt>
          <dd className="font-mono">0.4s — hovers, buttons, small state changes</dd>
          <dt className="text-muted text-micro font-mono">--dur-macro</dt>
          <dd className="font-mono">0.8s — section reveals, card entrances</dd>
          <dt className="text-muted text-micro font-mono">--dur-hero</dt>
          <dd className="font-mono">1.2s — hero and page transitions</dd>
          <dt className="text-muted text-micro font-mono">--stagger</dt>
          <dd className="font-mono">0.06s — per-item delay in a sequence</dd>
        </dl>
      </Row>
    </Container>
  )
}
