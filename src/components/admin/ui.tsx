import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export const fieldClass =
  'bg-white border-hairline text-ink text-small w-full rounded-xl border px-4 py-2.5 focus:border-primary/50 focus:outline-none'

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = 'text',
  hint,
  required,
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  placeholder?: string
  type?: string
  hint?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="text-muted text-micro mb-2 block uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className={fieldClass}
      />
      {hint ? <p className="text-muted text-small mt-1.5 opacity-70">{hint}</p> : null}
    </div>
  )
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 5,
  hint,
  mono,
}: {
  label: string
  name: string
  defaultValue?: string | null
  rows?: number
  hint?: string
  mono?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="text-muted text-micro mb-2 block uppercase">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        className={cn(fieldClass, 'resize-y', mono && 'font-mono text-[0.8125rem]')}
      />
      {hint ? <p className="text-muted text-small mt-1.5 opacity-70">{hint}</p> : null}
    </div>
  )
}

export function AdminButton({
  children,
  variant = 'solid',
  ...rest
}: {
  children: ReactNode
  variant?: 'solid' | 'ghost' | 'danger'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    solid: 'bg-primary-strong text-bg hover:opacity-90',
    ghost: 'border-hairline text-ink hover:bg-wash border',
    danger: 'border-hairline text-[#b3261e] hover:bg-wash border',
  }
  return (
    <button
      {...rest}
      className={cn(
        'text-small rounded-full px-5 py-2.5 font-medium transition-colors disabled:opacity-50',
        variants[variant],
      )}
    >
      {children}
    </button>
  )
}

export function PageHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="border-hairline mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
      <h1 className="text-h2 font-display">{title}</h1>
      {action}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="border-hairline text-muted rounded-2xl border border-dashed px-6 py-12 text-center">
      {children}
    </p>
  )
}
