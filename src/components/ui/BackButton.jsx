import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function BackButton({
  label = 'Back',
  onClick,
  className = '',
  variant = 'simple', // 'simple' | 'pill' | 'bordered'
}) {
  const variants = {
    simple: "text-slate-600 hover:text-[#064C23] px-2 py-1.5",
    pill: "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#064C23] px-3.5 py-1.5 rounded-full shadow-xs",
    bordered: "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#064C23] px-3 py-2 rounded-xl shadow-xs",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none ${variants[variant] || variants.simple} ${className}`}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-xs transition-transform group-hover:-translate-x-0.5" />
      {label && <span>{label}</span>}
    </button>
  )
}
