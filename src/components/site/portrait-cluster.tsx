import Image from 'next/image'

import { cn } from '@/lib/cn'

/**
 * Overlapping circular portraits, echoing the reference's hero.
 *
 * Renders nothing at all when there are no images — an empty ring placeholder
 * would read as a broken avatar, and the hero composes fine without it.
 */
export function PortraitCluster({
  portraits,
  name,
  className,
}: {
  portraits: string[]
  name: string
  className?: string
}) {
  const shown = portraits.filter(Boolean).slice(0, 3)
  if (shown.length === 0) return null

  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((src, i) => (
        <div
          key={src}
          className={cn(
            'border-bg relative size-14 shrink-0 overflow-hidden rounded-full border-2 sm:size-16',
            i > 0 && '-ml-5',
          )}
          style={{ zIndex: shown.length - i }}
        >
          <Image
            src={src}
            alt={i === 0 ? name : ''}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
