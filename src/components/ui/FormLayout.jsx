import React from 'react'

export function FormSection({
  title,
  subtitle,
  children,
  className = '',
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 ${className}`}>
      {(title || subtitle) && (
        <div className="border-b border-slate-100 pb-4">
          {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function FormRow({ children, cols = 2, className = '' }) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[cols] || gridCols[2]} gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  )
}

export function FormActions({ children, align = 'right', className = '' }) {
  const alignment = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 ${alignment[align] || alignment.right} ${className}`}>
      {children}
    </div>
  )
}

export default function FormLayout({
  title,
  subtitle,
  children,
  onSubmit,
  className = '',
}) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </form>
  )
}
