import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faDownload,
  faCircleCheck,
  faCartShopping,
  faArrowTrendUp,
  faTowerBroadcast
} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../index'

export default function DashboardWelcomeBanner({
  dateFilter = 'today',
  onDateFilterChange,
  onExport,
  totalOrders = '548',
  activeBranches = '4 Outlets'
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#032411] via-[#064C23] to-[#0a5c2d] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#064C23]/80">
      {/* Decorative Glow Elements */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-[#A44F37]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 translate-y-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
        {/* Left Side: Operations Greeting & Operational Status */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-[#A44F37] text-white shadow-xs">
              <FontAwesomeIcon icon={faStore} className="mr-1.5 text-[11px]" />
              Bazario Retail Operations
            </span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-200 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Cloud POS Live Sync Active</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Admin Overview & Live Analytics
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
              Real-time monitoring of supermarket footfall, omni-channel customer trends, order fulfillment velocity, and branch revenue streams.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 text-xs">
              <FontAwesomeIcon icon={faCartShopping} className="text-emerald-300 text-xs" />
              <span className="text-emerald-100/70">Today's Orders:</span>
              <span className="font-extrabold text-white font-mono">{totalOrders}</span>
            </div>
            <div className="bg-black/25 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 text-xs">
              <FontAwesomeIcon icon={faStore} className="text-amber-300 text-xs" />
              <span className="text-emerald-100/70">Store Branches:</span>
              <span className="font-extrabold text-white">{activeBranches}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Prominent Logo Image Box as part of the Panel */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 shrink-0">
          {/* Logo Card Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/40 shadow-2xl flex items-center space-x-4 max-w-sm transition-all hover:bg-white hover:scale-[1.02] duration-200">
            <div className="w-20 sm:w-24 shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-2xs flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Bazario Supermarket"
                className="w-full h-auto object-contain"
                draggable="false"
              />
            </div>
            <div className="min-w-0 pr-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#064C23] text-white">
                  BAZARIO
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  HQ Admin
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                Bill Halka, Dil Halka!
              </p>
              <p className="text-[10px] text-slate-500 flex items-center mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                Delhi-NCR Hypermarket Network
              </p>
            </div>
          </div>

          {/* Date Filter & Export Controls */}
          <div className="flex items-center space-x-2 self-start sm:self-auto lg:self-end">
            <div className="bg-black/35 backdrop-blur-md p-1 rounded-xl flex items-center border border-white/15">
              {['today', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => onDateFilterChange && onDateFilterChange(period)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer ${
                    dateFilter === period
                      ? 'bg-white text-[#064C23] shadow-xs'
                      : 'text-emerald-100/70 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/25"
              icon={<FontAwesomeIcon icon={faDownload} className="text-xs" />}
              onClick={onExport}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
