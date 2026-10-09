import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faMagnifyingGlass,
  faBell,
  faArrowRightFromBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons'

export default function Header({
  onMenuToggle,
  title = '',
  user = { name: 'Admin User', email: 'admin@bazario.com', avatar: 'AD' },
  onLogout,
  actions = null,
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Hamburger & Title or Search */}
      <div className="flex items-center space-x-4">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        )}

        {title ? (
          <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
        ) : (
          <div className="relative w-48 sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-8 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        )}
      </div>

      {/* Right side: Actions, Notifications, User */}
      <div className="flex items-center space-x-3">
        {actions}

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-[#064C23] hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A44F37] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Pill / Profile */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#064C23] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user.avatar || 'AD'}
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
