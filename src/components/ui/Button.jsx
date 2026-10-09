import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'cancel' | 'danger' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1"

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs space-x-1.5",
    md: "px-4 py-2.5 text-sm space-x-2",
    lg: "px-6 py-3 text-base space-x-2.5",
  }

  const variantStyles = {
    primary: "bg-[#064C23] hover:bg-[#095f2d] text-white shadow-sm hover:shadow-md focus:ring-[#064C23]/30",
    secondary: "bg-[#A44F37] hover:bg-[#8e412c] text-white shadow-sm hover:shadow-md focus:ring-[#A44F37]/30",
    cancel: "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 focus:ring-slate-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md focus:ring-rose-500/30",
    outline: "border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-300",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200",
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
}
