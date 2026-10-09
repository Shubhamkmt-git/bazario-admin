import React from 'react'

export default function ToggleButton({
  checked,
  enabled,
  value,
  onChange,
  label = '',
  description = '',
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'primary', // 'primary' | 'secondary'
  activeColor = '',
  className = '',
}) {
  const isChecked =
    checked !== undefined
      ? Boolean(checked)
      : enabled !== undefined
      ? Boolean(enabled)
      : Boolean(value)

  // Pixel-perfect symmetric sizing with exact 2px padding in all directions
  const sizeStyles = {
    sm: {
      track: 'w-9 h-5', // 36px x 20px
      thumb: 'w-4 h-4',  // 16px x 16px
      offset: 'top-[2px] left-[2px]', // 2px margin
      translate: 'translate-x-4', // 16px translate (36 - 16 - 4 = 16px move -> 2px right padding)
    },
    md: {
      track: 'w-11 h-6', // 44px x 24px
      thumb: 'w-5 h-5',  // 20px x 20px
      offset: 'top-[2px] left-[2px]', // 2px margin
      translate: 'translate-x-5', // 20px translate (44 - 20 - 4 = 20px move -> 2px right padding)
    },
    lg: {
      track: 'w-14 h-7', // 56px x 28px
      thumb: 'w-6 h-6',  // 24px x 24px
      offset: 'top-[2px] left-[2px]', // 2px margin
      translate: 'translate-x-7', // 28px translate (56 - 24 - 4 = 28px move -> 2px right padding)
    },
  }

  const activeBg = activeColor || (color === 'secondary' ? '#A44F37' : '#064C23')
  const currentSize = sizeStyles[size] || sizeStyles.md

  const handleToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && onChange) {
      onChange(!isChecked)
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`inline-flex items-center space-x-3 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064C23]/40 rounded-full transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div
        className={`relative inline-flex items-center shrink-0 ${currentSize.track} rounded-full transition-colors duration-200 ease-in-out`}
        style={{
          backgroundColor: isChecked ? activeBg : '#cbd5e1',
        }}
      >
        <span
          className={`pointer-events-none inline-block ${currentSize.thumb} ${currentSize.offset} rounded-full bg-white shadow-xs ring-0 transition-transform duration-200 ease-in-out absolute ${
            isChecked ? currentSize.translate : 'translate-x-0'
          }`}
        />
      </div>

      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && <span className="text-sm font-semibold text-slate-800">{label}</span>}
          {description && <span className="text-xs text-slate-500">{description}</span>}
        </div>
      )}
    </button>
  )
}
