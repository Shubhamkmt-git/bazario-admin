import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowRightFromBracket,
  faClock,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons'
import { useIndianTime } from '../../utils/timeUtils'

const formatAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== 'string') return ''
  if (avatar.startsWith('http') || avatar.startsWith('data:image') || avatar.startsWith('blob:')) {
    return avatar
  }
  if (avatar.startsWith('/uploads')) {
    return `http://localhost:5000${avatar}`
  }
  return avatar
}

const isImage = (avatar) => {
  if (!avatar || typeof avatar !== 'string') return false
  return (
    avatar.startsWith('http') ||
    avatar.startsWith('/uploads') ||
    avatar.startsWith('data:image') ||
    avatar.startsWith('blob:') ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(avatar)
  )
}

export default function Header({
  onMenuToggle,
  title = '',
  user = { name: 'Admin User', email: 'admin@bazario.com', avatar: 'BA' },
  onLogout,
  actions = null,
  className = '',
}) {
  const { timeStr, dateStr, timeZone } = useIndianTime()

  return (
    <header className={`sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-all ${className}`}>
      {/* Left side: Hamburger Toggle & Page Title */}
      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="text-slate-600 hover:text-[#064C23] p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
            title="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        )}

        {title && (
          <div className="flex items-center space-x-2.5 min-w-0 border-l border-slate-200 pl-3 sm:pl-4 py-0.5">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
          </div>
        )}
      </div>

      {/* Right side: Live Indian Standard Time (IST) Clock & User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {actions}

        {/* Minimal Clean Live Indian Standard Time (IST) Clock */}
        <div
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs select-none transition-colors hover:bg-slate-100/70"
          title={`Indian Standard Time: ${dateStr} (UTC+5:30)`}
        >
          <FontAwesomeIcon icon={faClock} className="text-[#064C23] text-xs" />
          <span className="font-semibold text-slate-800 font-mono tracking-tight text-xs sm:text-[13px]">
            {timeStr}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-md">
            IST
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-1 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-[#064C23] text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0 border border-slate-200">
            {isImage(user.avatar) ? (
              <img
                src={formatAvatarUrl(user.avatar)}
                alt={user.name || 'Admin'}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <span>
                {user.name
                  ? user.name
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : (user.avatar || 'BA')}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user.name || 'Admin'}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user.email || 'admin@bazario.com'}</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1 focus:outline-none cursor-pointer shrink-0"
              title="Logout"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
