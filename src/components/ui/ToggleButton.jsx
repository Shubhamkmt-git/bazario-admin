import React from 'react'

export default function ToggleButton({
  checked = false,
  onChange,
  label = '',
  description = '',
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'primary', // 'primary' | 'secondary'
  className = '',
}) {
  const sizeStyles = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  }

  const activeColorStyles = {
    primary: 'bg-[#064C23]',
    secondary: 'bg-[#A44F37]',
  }

  const currentSize = sizeStyles[size] || sizeStyles.md

  return (
    <label className={`inline-flex items-center space-x-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${currentSize.track} rounded-full transition-colors duration-200 ease-in-out ${
            checked ? (activeColorStyles[color] || activeColorStyles.primary) : 'bg-slate-300'
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${currentSize.thumb} ${
            checked ? currentSize.translate : 'translate-x-0'
          }`}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-semibold text-slate-800">{label}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
    </label>
  )
}
