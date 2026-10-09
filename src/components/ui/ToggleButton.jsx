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

  const sizeStyles = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-3.5 h-3.5',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
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

  const handleToggle = (e) => {
    e.stopPropagation()
    if (!disabled && onChange) {
      onChange(!isChecked)
    }
  }

  return (
    <label
      onClick={handleToggle}
      className={`inline-flex items-center space-x-3 cursor-pointer select-none group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative inline-block">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`${currentSize.track} rounded-full transition-colors duration-200 ease-in-out ${
            isChecked
              ? activeColor
                ? ''
                : activeColorStyles[color] || activeColorStyles.primary
              : 'bg-slate-300 group-hover:bg-slate-350'
          }`}
          style={isChecked && activeColor ? { backgroundColor: activeColor } : {}}
        />
        <div
          className={`absolute left-0.5 top-0.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            currentSize.thumb
          } ${isChecked ? currentSize.translate : 'translate-x-0'}`}
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
