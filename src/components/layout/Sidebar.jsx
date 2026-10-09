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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Aside: Minimal Smooth Light Brand Gradient */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-[#f2f8f4] via-[#e9f4ed] to-[#dfeee4] text-slate-800 flex flex-col border-r border-[#cee5d7] transition-all duration-300 ease-in-out shrink-0 select-none ${
          isOpen
            ? 'w-72 translate-x-0 shadow-xl lg:shadow-none'
            : '-translate-x-full lg:translate-x-0 lg:w-[80px] shadow-none'
        }`}
      >
        {/* Brand Header: Exactly h-16 to match the Header component perfectly */}
        <div className="h-16 shrink-0 flex items-center border-b border-[#cee5d7] px-4 sm:px-5 transition-all bg-white/50 backdrop-blur-sm">
          {isOpen ? (
            /* Expanded Header: Clean Left-Aligned Brand Logo */
            <div className="flex items-center justify-start w-full py-1">
              <img
                src="/logo.png"
                alt="Bazario Admin"
                className="h-9 sm:h-10 w-auto max-w-[190px] object-contain object-left drop-shadow-xs"
                draggable="false"
              />
            </div>
          ) : (
            /* Collapsed Header: Centered Mini Logo Pill */
            <div className="w-full flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064C23] to-[#0b5d2e] flex items-center justify-center text-white shadow-sm border border-[#064C23]/30 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                onClick={onToggle}
                title="Expand Sidebar"
              >
                <img src="/logo.png" alt="Bazario" className="h-6 w-auto object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto px-3 scrollbar-thin">
          {isOpen && (
            <div className="text-[11px] font-extrabold text-[#064C23]/75 uppercase tracking-wider px-3 mb-2">
              Main Menu
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
                className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer group relative ${
                  isOpen
                    ? 'justify-between px-3.5 py-2.5 text-[15px]'
                    : 'justify-center p-3 text-lg'
                } ${
                  isActive
                    ? 'bg-[#064C23] text-white font-semibold shadow-md shadow-[#064C23]/25 ring-1 ring-[#064C23]'
                    : 'text-[#1c4b31] font-medium hover:text-[#064C23] hover:bg-white/70'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {item.icon && (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isOpen ? 'w-5 h-5 text-base' : 'w-6 h-6 text-lg'
                      } ${
                        isActive
                          ? 'text-white'
                          : 'text-[#2b6d4b] group-hover:text-[#064C23]'
                      }`}
                    />
                  )}
                  {isOpen && <span className="truncate tracking-tight">{item.name}</span>}
                </div>

                {/* Badge */}
                {isOpen && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full transition-colors shrink-0 ml-2 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/25'
                        : 'bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/15'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot */}
                {!isOpen && item.badge && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#A44F37] ring-2 ring-white" />
                )}

                {/* Collapsed Tooltip on Hover */}
                {!isOpen && (
                  <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700/50">
                    {item.name}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Info Footer */}
        <div
          className={`border-t border-[#cee5d7] bg-white/55 backdrop-blur-sm flex items-center transition-all ${
            isOpen ? 'p-3.5 space-x-3' : 'p-3 justify-center'
          }`}
        >
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#064C23] to-[#0f6b36] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 cursor-pointer transition-transform hover:scale-105"
            title={!isOpen ? `${user.name} (${user.email})` : ''}
          >
            {user.avatar || 'BA'}
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
