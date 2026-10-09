import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faArrowTrendUp,
  faCrown,
  faBagShopping,
  faHeart,
  faLocationDot,
  faStar,
  faRepeat,
  faUserPlus,
  faShieldHeart
} from '@fortawesome/free-solid-svg-icons'

const CUSTOMER_GROWTH_DATA = [
  { day: 'Mon', newCust: 32, returningCust: 115, totalActive: 147 },
  { day: 'Tue', newCust: 41, returningCust: 128, totalActive: 169 },
  { day: 'Wed', newCust: 38, returningCust: 142, totalActive: 180 },
  { day: 'Thu', newCust: 49, returningCust: 156, totalActive: 205 },
  { day: 'Fri', newCust: 62, returningCust: 184, totalActive: 246 },
  { day: 'Sat', newCust: 85, returningCust: 230, totalActive: 315 },
  { day: 'Sun', newCust: 98, returningCust: 265, totalActive: 363 }
]

export default function CustomerAnalyticsSection() {
  const [hoveredDay, setHoveredDay] = useState(null)

  const data = CUSTOMER_GROWTH_DATA

  // SVG Chart Setup
  const maxVal = 380
  const chartWidth = 580
  const chartHeight = 220
  const paddingX = 40
  const paddingY = 30

  const getX = (index) =>
    paddingX + (index * (chartWidth - 2 * paddingX)) / (data.length - 1)

  const getY = (val) =>
    chartHeight - paddingY - (val / maxVal) * (chartHeight - 2 * paddingY)

  // Returning path
  const returnPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.returningCust) }))
  const returnPathD = returnPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = returnPoints[i - 1]
    const cx1 = prev.x + (p.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (p.x - prev.x) / 2
    const cy2 = p.y
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`
  }, '')

  // New customers path
  const newPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.newCust) }))
  const newPathD = newPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = newPoints[i - 1]
    const cx1 = prev.x + (p.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (p.x - prev.x) / 2
    const cy2 = p.y
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`
  }, '')

  const returnAreaD = `${returnPathD} L ${
    returnPoints[returnPoints.length - 1].x
  } ${chartHeight - paddingY} L ${returnPoints[0].x} ${chartHeight - paddingY} Z`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column (7 cols): Customer Growth & Retention Chart */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A44F37]/10 text-[#A44F37] flex items-center justify-center text-sm">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Customer Growth & Retention Analysis
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                New shopper acquisitions vs loyal repeat supermarket customers
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-semibold self-start sm:self-auto">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#064C23]" />
                <span className="text-slate-700">Returning (Loyal)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#A44F37]" />
                <span className="text-slate-700">New Registrations</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                RETENTION RATE
              </span>
              <span className="text-lg font-black text-[#064C23] font-mono mt-0.5 block">
                68.4%
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center mt-0.5">
                <FontAwesomeIcon icon={faArrowTrendUp} className="mr-1 text-[9px]" />
                +4.2% monthly
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CUSTOMER LTV
              </span>
              <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">
                ₹18,650
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Avg lifetime spend</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                SATISFACTION
              </span>
              <span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">
                4.8 / 5.0 ★
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">1.2k Store reviews</span>
            </div>
          </div>

          {/* Dual Line SVG Chart */}
          <div className="relative w-full overflow-hidden select-none mt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 sm:h-60 overflow-visible"
            >
              <defs>
                <linearGradient id="returnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#064C23" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#064C23" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yPos =
                  chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY)
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={yPos}
                      x2={chartWidth - paddingX}
                      y2={yPos}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      className="text-[9px] fill-slate-400 font-mono font-semibold"
                    >
                      {Math.round(ratio * maxVal)}
                    </text>
                  </g>
                )
              })}

              {/* Area fill for returning */}
              <path d={returnAreaD} fill="url(#returnGrad)" />

              {/* Returning Shoppers Line */}
              <path
                d={returnPathD}
                fill="none"
                stroke="#064C23"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* New Shoppers Line */}
              <path
                d={newPathD}
                fill="none"
                stroke="#A44F37"
                strokeWidth="3"
                strokeDasharray="6 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {data.map((d, idx) => {
                const rx = getX(idx)
                const ry = getY(d.returningCust)
                const ny = getY(d.newCust)
                const isHovered = hoveredDay?.day === d.day

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredDay(d)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="cursor-pointer"
                  >
                    <circle cx={rx} cy={ry} r="14" fill="transparent" />
                    <circle
                      cx={rx}
                      cy={ry}
                      r={isHovered ? 6 : 4}
                      fill="#064C23"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={rx}
                      cy={ny}
                      r={isHovered ? 6 : 4}
                      fill="#A44F37"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    {/* Day label */}
                    <text
                      x={rx}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className={`text-[10px] font-bold ${
                        isHovered ? 'fill-slate-900 font-black' : 'fill-slate-400'
                      }`}
                    >
                      {d.day}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredDay && (
              <div
                className="absolute pointer-events-none bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full transition-all duration-100 z-20 border border-slate-700 min-w-[140px]"
                style={{
                  left: `${(getX(data.indexOf(hoveredDay)) / chartWidth) * 100}%`,
                  top: `${(getY(hoveredDay.returningCust) / chartHeight) * 100 - 10}%`
                }}
              >
                <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1">
                  {hoveredDay.day} Footfall Traffic
                </div>
                <div className="flex justify-between text-[11px] pt-0.5">
                  <span className="text-emerald-200">Returning:</span>
                  <span className="font-bold font-mono">{hoveredDay.returningCust}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-orange-200">New Shoppers:</span>
                  <span className="font-bold font-mono">{hoveredDay.newCust}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold border-t border-slate-700/80 pt-0.5">
                  <span className="text-slate-300">Total Active:</span>
                  <span className="font-mono text-white">{hoveredDay.totalActive}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (5 cols): Customer Segmentation & Top Outlets */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Customer Segments
              </h2>
              <p className="text-xs text-slate-500">
                Loyalty membership tier & basket behavior
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
              1,240 Total
            </span>
          </div>

          {/* Segment Cards */}
          <div className="mt-4 space-y-3">
            {/* VIP Gold Club */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-2xs shrink-0">
                  <FontAwesomeIcon icon={faCrown} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">VIP Club Gold Shoppers</h4>
                  <p className="text-[11px] text-slate-500">Avg ticket: ₹3,850 • Weekly visits</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-900 font-mono">245</span>
                <span className="text-[10px] text-amber-700 block font-semibold">19.8%</span>
              </div>
            </div>

            {/* Frequent Weekly Shoppers */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#064C23] text-white flex items-center justify-center text-sm shadow-2xs shrink-0">
                  <FontAwesomeIcon icon={faBagShopping} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Frequent Household Shoppers</h4>
                  <p className="text-[11px] text-slate-500">Avg ticket: ₹1,920 • 3x per month</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-900 font-mono">580</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">46.8%</span>
              </div>
            </div>

            {/* Occasional / New */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-sm shrink-0">
                  <FontAwesomeIcon icon={faUserPlus} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">New Registrations & Casual</h4>
                  <p className="text-[11px] text-slate-500">Avg ticket: ₹840 • Promo-driven</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-900 font-mono">415</span>
                <span className="text-[10px] text-slate-500 block font-semibold">33.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Shopper Neighborhoods (Delhi-NCR) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              TOP SHOPPER DENSITY (NCR)
            </span>
            <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block truncate">Noida Sec 18</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">410 Shoppers</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block truncate">DLF Cyber City</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">365 Shoppers</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block truncate">Green Park S. Delhi</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">290 Shoppers</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block truncate">Indirapuram Gzb</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">175 Shoppers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
