import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleExclamation,
  faTriangleExclamation,
  faCircleInfo,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

export default function Toast({
  id,
  type = 'success', // 'success' | 'error' | 'warning' | 'info'
  title,
  message,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const typeConfig = {
    success: {
      icon: faCircleCheck,
      iconColor: 'text-emerald-500',
      bg: 'bg-white border-slate-200/80',
      progress: 'bg-emerald-500',
    },
    error: {
      icon: faCircleExclamation,
      iconColor: 'text-rose-500',
      bg: 'bg-white border-slate-200/80',
      progress: 'bg-rose-500',
    },
    warning: {
      icon: faTriangleExclamation,
      iconColor: 'text-amber-500',
      bg: 'bg-white border-slate-200/80',
      progress: 'bg-amber-500',
    },
    info: {
      icon: faCircleInfo,
      iconColor: 'text-blue-500',
      bg: 'bg-white border-slate-200/80',
      progress: 'bg-blue-500',
    },
  }

  const current = typeConfig[type] || typeConfig.success

  return (
    <div
      className={`relative w-84 sm:w-96 p-4 rounded-2xl shadow-xl border ${current.bg} flex items-start space-x-3.5 animate-slide-up overflow-hidden backdrop-blur-md`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        <FontAwesomeIcon icon={current.icon} className={`text-lg ${current.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-bold text-slate-800 leading-snug">{title}</h4>}
        {message && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{message}</p>}
      </div>

      <button
        onClick={() => onClose(id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faXmark} className="text-xs" />
      </button>

      {/* Auto dismiss countdown line */}
      {duration > 0 && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${current.progress} animate-toast-progress`}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  )
}
