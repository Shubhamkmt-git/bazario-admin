import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

export default function Header({
  onMenuToggle,
  title = '',
  user = { name: 'Admin User', email: 'admin@bazario.com', avatar: 'BA' },
  onLogout,
  actions = null,
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Hamburger Toggle / Optional Title */}
      <div className="flex items-center space-x-4">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>
        )}

        {title && (
          <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
        )}
      </div>

      {/* Right side: Actions & User Profile */}
      <div className="flex items-center space-x-3">
        {actions}

        {/* User Profile */}
        <div className="flex items-center space-x-2.5">
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
