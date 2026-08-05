import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes so later ones actually win.
 *
 * The old codebase had two competing versions of this: a naive `.join(' ')` in
 * shared.tsx and a real twMerge one in ui/utils.ts. The naive one silently lost
 * conflict resolution — `cn('p-2', 'p-4')` emitted both. This is the only one.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
