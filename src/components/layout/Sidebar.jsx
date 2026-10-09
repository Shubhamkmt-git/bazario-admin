import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import BazarioLogo from '../BazarioLogo'

export default function Sidebar({
  isOpen = false,
  onClose,
  navItems = [],
  activeTab = '',
  onSelectTab,
  user = { name: 'Admin User', email: 'admin@bazario.com' },
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#042813] text-slate-200 flex flex-col border-r border-[#03200f] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#063a1c]">
          <div className="w-32 py-1">
            <img src="/logo.png" alt="Bazario Admin" className="h-8 object-contain" />
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={faXmark} className="text-base" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-emerald-300/50 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id || activeTab === item.name
            return (
              <button
                key={item.id || item.name}
                type="button"
                onClick={() => {
                  onSelectTab && onSelectTab(item.id || item.name)
                  onClose && onClose()
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#A44F37] text-white shadow-md shadow-black/20 font-semibold'
                    : 'text-emerald-100/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300/70'}`}
                    />
                  )}
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-[#063a1c] bg-[#031d0e]/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#A44F37] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user.avatar || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-emerald-200/60 truncate">{user.email}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
