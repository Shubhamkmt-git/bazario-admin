import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faArrowTrendUp,
  faArrowTrendDown,
  faClock,
  faTruckFast,
  faCircleCheck,
  faBoxOpen,
  faBan,
  faReceipt,
  faBagShopping,
  faMobileScreenButton,
  faStore
} from '@fortawesome/free-solid-svg-icons'

const getEmptyTrajectory = (timeframe) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()

  if (timeframe === '7d') {
    return Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - idx))
      return {
        label: dayNames[d.getDay()],
        date: `${monthNames[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`,
        orders: 0,
        revenue: 0,
        delivered: 0
      }
    })
  }
  if (timeframe === '30d') {
    return ['W1', 'W2', 'W3', 'W4'].map((w) => ({
      label: w,
      date: 'Weekly',
      orders: 0,
      revenue: 0,
      delivered: 0
    }))
  }
  return Array.from({ length: 6 }, (_, idx) => {
    const m = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1)
    return {
      label: monthNames[m.getMonth()],
      date: `${monthNames[m.getMonth()]} ${m.getFullYear()}`,
      orders: 0,
      revenue: 0,
      delivered: 0
    }
  })
}

export default function OrdersAnalyticsSection({
  orderTrajectoryData = null,
  fulfillmentPipeline = null,
  channelDistribution = null,
  statsData = null
}) {
  const [timeframe, setTimeframe] = useState('7d')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const activeTrajectory = (orderTrajectoryData && orderTrajectoryData[timeframe]) || []
  const data = activeTrajectory.length > 0 ? activeTrajectory : getEmptyTrajectory(timeframe)

  // SVG Chart Calculation
  const maxOrders = Math.max(...data.map((d) => d.orders || 0), 1) * 1.15
  const minOrders = 0
  const chartWidth = 600
  const chartHeight = 220
  const paddingX = 40
  const paddingY = 30

  const getX = (index) => {
    return paddingX + (index * (chartWidth - 2 * paddingX)) / Math.max(1, data.length - 1)
  }

  const getY = (value) => {
    const range = maxOrders - minOrders || 1
    return (
      chartHeight -
      paddingY -
      (((value || 0) - minOrders) / range) * (chartHeight - 2 * paddingY)
    )
  }

  // Generate SVG path for line and area
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.orders || 0), ...d }))
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cx1 = prev.x + (p.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (p.x - prev.x) / 2
    const cy2 = p.y
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${
    points[0].x
  } ${chartHeight - paddingY} Z`

  // Summary statistics
  const totalVolume = data.reduce((sum, d) => sum + (d.orders || 0), 0)
  const totalRev = data.reduce((sum, d) => sum + (d.revenue || 0), 0)
  const avgOrderVal = totalVolume > 0 ? Math.round(totalRev / totalVolume) : 0

  const fulfillment = fulfillmentPipeline || {
    total: statsData?.totalOrdersCount || 0,
    delivered: statsData?.deliveredOrders || 0,
    deliveredPct: 0,
    outForDelivery: 0,
    outForDeliveryPct: 0,
    processing: statsData?.pendingOrders || 0,
    processingPct: 0,
    cancelled: 0,
    cancelledPct: 0,
    successRate: 100
  }

  const channels = channelDistribution || {
    appDelivery: { count: totalVolume, percentage: 50 },
    storePos: { count: 0, percentage: 50 }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column (8 cols): Interactive Orders & Revenue Graph */}
      <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Order Volume & Sales Trajectory
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Daily grocery order dispatch frequency and gross turnover in INR (₹)
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '12m', label: '6 Months' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTimeframe(t.id)
                  setHoveredPoint(null)
                }}
                className={`px-3 py-1 font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-white text-[#064C23] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL ORDERS
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {totalVolume.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
              Live DB Count
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              GROSS SALES (₹)
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {totalRev >= 1000 ? `₹${(totalRev / 1000).toFixed(1)}k` : `₹${totalRev.toLocaleString('en-IN')}`}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
              Period Turnover
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              AVG BASKET (AOV)
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-0.5 block">
              ₹{avgOrderVal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Per customer order</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              DISPATCH RATE
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono mt-0.5 block">
              {fulfillment.successRate}%
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">On-time fulfillment</span>
          </div>
        </div>

        {/* Responsive Interactive SVG Chart */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="orderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#064C23" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
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
                    {Math.round(ratio * maxOrders)}
                  </text>
                </g>
              )
            })}

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#orderGrad)" />

            {/* Smooth Main Curve Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#064C23"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((p, idx) => {
              const isHovered = hoveredPoint?.label === p.label
              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible Hit Target */}
                  <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                  {/* Outer Pulsing Ring when Hovered */}
                  {isHovered && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="10"
                      fill="#064C23"
                      fillOpacity="0.2"
                    />
                  )}

                  {/* Solid Point */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? '#064C23' : '#ffffff'}
                    stroke="#064C23"
                    strokeWidth="3"
                    className="transition-all duration-150"
                  />

                  {/* X Axis Labels */}
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    className={`text-[10px] font-bold ${
                      isHovered ? 'fill-[#064C23]' : 'fill-slate-500'
                    }`}
                  >
                    {p.label}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full transition-all duration-100 z-20 border border-slate-700 min-w-[130px]"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100 - 8}%`
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                <span className="font-bold text-emerald-400">{hoveredPoint.date}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {hoveredPoint.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-slate-300">Orders:</span>
                <span className="font-bold font-mono text-white">
                  {hoveredPoint.orders}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Sales:</span>
                <span className="font-bold font-mono text-emerald-400">
                  ₹{hoveredPoint.revenue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (4 cols): Order Status & Fulfillment Analyses */}
      <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Order Fulfillment
              </h2>
              <p className="text-xs text-slate-500">
                Real-time operational pipeline breakdown
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-[#064C23] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {fulfillment.total} Total
            </span>
          </div>

          {/* Segmented Status Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-[#064C23] h-full transition-all duration-300"
                style={{ width: `${fulfillment.deliveredPct}%` }}
                title={`Delivered: ${fulfillment.deliveredPct}%`}
              />
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${fulfillment.outForDeliveryPct}%` }}
                title={`Out for Delivery: ${fulfillment.outForDeliveryPct}%`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${fulfillment.processingPct}%` }}
                title={`Processing: ${fulfillment.processingPct}%`}
              />
              <div
                className="bg-rose-400 h-full transition-all duration-300"
                style={{ width: `${fulfillment.cancelledPct}%` }}
                title={`Cancelled: ${fulfillment.cancelledPct}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span>Overall Pipeline: {fulfillment.successRate}% Success</span>
              <span>100%</span>
            </div>
          </div>

          {/* Detailed Status Breakdown Rows */}
          <div className="divide-y divide-slate-100 mt-4">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#064C23]" />
                <span className="font-semibold text-slate-700">Delivered & Fulfilled</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 font-mono">{fulfillment.delivered} orders</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({fulfillment.deliveredPct}%)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-700">Out for Delivery</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 font-mono">{fulfillment.outForDelivery} orders</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({fulfillment.outForDeliveryPct}%)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="font-semibold text-slate-700">Packing & Processing</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 font-mono">{fulfillment.processing} orders</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({fulfillment.processingPct}%)</span>
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="font-semibold text-slate-700">Cancelled / Returns</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 font-mono">{fulfillment.cancelled} orders</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({fulfillment.cancelledPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Channel Channels Split */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            ORDER CHANNEL DISTRIBUTION
          </span>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-1">
                <FontAwesomeIcon icon={faMobileScreenButton} className="text-[#064C23]" />
                <span className="font-bold">App Delivery</span>
              </div>
              <span className="text-base font-black text-slate-900 font-mono">{channels.appDelivery.percentage}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{channels.appDelivery.count} orders</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 mb-1">
                <FontAwesomeIcon icon={faStore} className="text-[#A44F37]" />
                <span className="font-bold">Store POS / COD</span>
              </div>
              <span className="text-base font-black text-slate-900 font-mono">{channels.storePos.percentage}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{channels.storePos.count} orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
