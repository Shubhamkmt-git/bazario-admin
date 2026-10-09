import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

export default function Footer({
  version = 'v2.4.0',
  company = 'Bazario Admin Portal',
  systemStatus = 'All systems operational',
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-700">{company}</span>
        <span>&copy; {currentYear}</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-400">{version}</span>
      </div>

      <div className="flex items-center space-x-4">
        {systemStatus && (
          <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-medium">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
            <span>{systemStatus}</span>
          </div>
        )}
      </div>
    </footer>
  )
}
