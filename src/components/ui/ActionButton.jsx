import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faPenToSquare,
  faTrashCan,
  faCopy,
  faEllipsisVertical,
  faCheck,
  faDownload
} from '@fortawesome/free-solid-svg-icons'

export default function ActionButton({
  action = 'view', // 'view' | 'edit' | 'delete' | 'copy' | 'download' | 'more'
  icon = null,
  onClick,
  tooltip = '',
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  ...props
}) {
  const configs = {
    view: {
      icon: faEye,
      defaultTooltip: 'View Details',
      style: 'text-slate-500 hover:text-[#064C23] hover:bg-[#064C23]/10 focus:ring-[#064C23]/30',
    },
    edit: {
      icon: faPenToSquare,
      defaultTooltip: 'Edit Item',
      style: 'text-slate-500 hover:text-amber-600 hover:bg-amber-50 focus:ring-amber-500/30',
    },
    delete: {
      icon: faTrashCan,
      defaultTooltip: 'Delete Item',
      style: 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 focus:ring-rose-500/30',
    },
    copy: {
      icon: faCopy,
      defaultTooltip: 'Copy to Clipboard',
      style: 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500/30',
    },
    download: {
      icon: faDownload,
      defaultTooltip: 'Download File',
      style: 'text-slate-500 hover:text-[#064C23] hover:bg-[#064C23]/10 focus:ring-[#064C23]/30',
    },
    more: {
      icon: faEllipsisVertical,
      defaultTooltip: 'More Actions',
      style: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-300',
    },
  }

  const currentConfig = configs[action] || configs[props.variant] || configs.view
  const displayIcon = icon || currentConfig.icon
  const displayTooltip = tooltip || currentConfig.defaultTooltip

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={displayTooltip}
      aria-label={displayTooltip}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${currentConfig.style} ${className}`}
      {...props}
    >
      <FontAwesomeIcon icon={displayIcon} />
    </button>
  )
}
