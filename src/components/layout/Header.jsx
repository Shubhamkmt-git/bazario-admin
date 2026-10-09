import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowRightFromBracket,
  faClock,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons'
import { useIndianTime } from '../../utils/timeUtils'

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
      {/* Left side: Hamburger Toggle / Optional Title */}
      <div className="flex items-center space-x-4">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            title="Toggle Sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        )}

        {title && (
          <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
        )}
      </div>

      {/* Right side: Live Indian Standard Time (IST) Clock & User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {actions}

        {/* Live Indian Standard Time (IST) Clock Widget */}
        <div
          className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs select-none group transition-all hover:bg-slate-100/80"
          title={`Indian Standard Time (IST / Asia/Kolkata): ${dateStr} ${timeStr}`}
        >
          {/* Live pulsing indicator */}
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
          </div>

          {/* Clock Icon & Time */}
          <div className="flex items-center space-x-1.5">
            <FontAwesomeIcon icon={faClock} className="text-[#064C23] text-xs" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight font-mono">
              {timeStr}
            </span>
          </div>

          {/* Timezone Badge & Date (Hidden on very small screens) */}
          <div className="hidden md:flex items-center space-x-1.5 border-l border-slate-200 pl-2">
            <span className="text-[10px] font-bold text-[#064C23] bg-[#064C23]/10 px-1.5 py-0.5 rounded border border-[#064C23]/15">
              {timeZone}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {dateStr}
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 pl-1 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-[#064C23] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user.avatar || 'BA'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-1 focus:outline-none cursor-pointer"
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
