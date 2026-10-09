import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Sidebar({
  isOpen = true,
  onClose,
  onToggle,
  navItems = [],
  activeTab = '',
  onSelectTab,
  user = { name: 'Store Admin', email: 'admin@bazario.com', avatar: 'BA' },
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Aside: Transitions between Expanded (w-64) and Collapsed Icon-Only (w-[72px] on desktop) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#042813] text-slate-200 flex flex-col border-r border-[#03200f] transition-all duration-300 ease-in-out shrink-0 ${
          isOpen
            ? 'w-64 translate-x-0 shadow-2xl lg:shadow-none'
            : '-translate-x-full lg:translate-x-0 lg:w-[72px] shadow-none'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center border-b border-[#063a1c] px-4 transition-all">
          {isOpen ? (
            /* Expanded Header: Clean Large Left-Aligned Logo */
            <div className="flex items-center justify-start w-full py-1">
              <img
                src="/logo.png"
                alt="Bazario Admin"
                className="h-9 sm:h-10 w-auto max-w-[180px] object-contain object-left drop-shadow-sm select-none"
                draggable="false"
              />
            </div>
          ) : (
            /* Collapsed Header: Centered Mini Logo Icon */
            <div className="w-full flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064C23] to-[#A44F37] flex items-center justify-center text-white shadow-md border border-emerald-500/30 cursor-pointer"
                onClick={onToggle}
                title="Expand Sidebar"
              >
                <img src="/logo.png" alt="Bazario" className="h-6 w-auto object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-5 space-y-1.5 overflow-y-auto px-2">
          {isOpen && (
            <div className="text-[11px] font-bold text-emerald-300/50 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id || activeTab === item.name
            return (
              <button
                key={item.id || item.name}
                type="button"
                onClick={() => onSelectTab && onSelectTab(item.id || item.name)}
                title={!isOpen ? item.name : ''}
                className={`w-full flex items-center rounded-xl transition-all duration-150 cursor-pointer select-none group relative ${
                  isOpen
                    ? 'justify-between px-3.5 py-2.5 text-sm font-medium'
                    : 'justify-center p-2.5 text-base'
                } ${
                  isActive
                    ? 'bg-[#A44F37] text-white shadow-md shadow-black/20 font-semibold'
                    : 'text-emerald-100/75 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`shrink-0 ${isOpen ? 'w-4 h-4' : 'w-5 h-5'} ${
                        isActive ? 'text-white' : 'text-emerald-300/70 group-hover:text-white'
                      }`}
                    />
                  )}
                  {isOpen && <span>{item.name}</span>}
                </div>

                {/* Badge */}
                {isOpen && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot */}
                {!isOpen && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A44F37] ring-2 ring-[#042813]" />
                )}

                {/* Collapsed Tooltip on Hover */}
                {!isOpen && (
                  <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-800">
                    {item.name}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Info Footer */}
        <div className={`border-t border-[#063a1c] bg-[#031d0e]/60 flex items-center transition-all ${
          isOpen ? 'p-4 space-x-3' : 'p-3 justify-center'
        }`}>
          <div
            className="w-9 h-9 rounded-full bg-[#A44F37] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 cursor-pointer"
            title={!isOpen ? `${user.name} (${user.email})` : ''}
          >
            {user.avatar || 'BA'}
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-200/60 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
