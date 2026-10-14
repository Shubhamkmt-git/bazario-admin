import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faBoxesStacked,
  faCartShopping,
  faTruck,
  faBoxOpen,
  faRotateRight,
  faTriangleExclamation,
  faCircleCheck,
  faClock,
  faArrowRight,
  faPlus,
  faPhone,
  faLocationDot,
  faMoneyBillWave,
  faCircleExclamation,
  faCheckDouble,
  faSpinner,
  faUserTie,
  faMotorcycle,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import {
  getStoreManagerDashboardStatsApi,
  updateStoreStatusApi,
  updateStoreOrderStatusApi,
  adjustStoreStockApi
} from '../../utils/adminApi'

export default function StoreManagerDashboardView({ currentUser, onNavigate }) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [restockLoadingId, setRestockLoadingId] = useState(null)
  const [orderFilter, setOrderFilter] = useState('all')

  const fetchDashboardStats = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const res = await getStoreManagerDashboardStatsApi()
      if (res && res.success) {
        setData(res)
      }
    } catch (err) {
      console.error('Failed to load store manager stats:', err)
      toast.error('Sync Error', 'Could not fetch live branch metrics.')
    } finally {
      setLoading(false)
      if (isManual) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
    // Poll live orders every 30 seconds for dark store dispatch operations
    const interval = setInterval(() => {
      fetchDashboardStats(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateStoreStatus = async (newStatus) => {
    if (statusUpdating) return
    setStatusUpdating(true)
    try {
      const res = await updateStoreStatusApi(newStatus)
      if (res && res.success) {
        toast.success('Store Status Updated', `Supermarket status changed to "${newStatus}"`)
        setData((prev) => (prev ? { ...prev, store: { ...prev.store, status: newStatus } } : prev))
      }
    } catch (err) {
      toast.error('Update Failed', err.message || 'Could not change branch status')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleAdvanceOrderStatus = async (orderId, nextStatus) => {
    setActionLoadingId(orderId)
    try {
      const res = await updateStoreOrderStatusApi(orderId, {
        orderStatus: nextStatus,
        status: nextStatus,
        note: `Status updated to ${nextStatus} by Store Manager`
      })
      if (res && res.success) {
        toast.success('Order Advanced', `Order #${res.order?.orderNumber || orderId} marked as "${nextStatus}"`)
        fetchDashboardStats(false)
      }
    } catch (err) {
      toast.error('Order Update Failed', err.message || 'Failed to update order status')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleQuickRestock = async (productId, currentStock) => {
    setRestockLoadingId(productId)
    try {
      const storeId = data?.store?.id
      const res = await adjustStoreStockApi(productId, 15, 'Manager One-Click Restock (+15)', storeId)
      if (res && res.success) {
        toast.success('Stock Added', `Added +15 units to branch inventory!`)
        fetchDashboardStats(false)
      }
    } catch (err) {
      toast.error('Restock Failed', err.message || 'Could not adjust stock')
    } finally {
      setRestockLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#064C23]" />
        <p className="text-sm font-semibold text-slate-500">Connecting to Branch Dark Store Operations...</p>
      </div>
    )
  }

  const store = data?.store || {
    name: currentUser?.storeName || 'Local Branch Hub',
    code: 'BRANCH-01',
    address: 'Noida Sector 62',
    city: 'Noida',
    pincode: '201301',
    status: 'Open',
    operatingHours: '6:00 AM - 11:00 PM'
  }

  const stats = data?.stats || {
    todaySalesFormatted: '₹0.00',
    totalOrdersCount: 0,
    activeOrdersCount: 0,
    placedCount: 0,
    confirmedCount: 0,
    packingCount: 0,
    outForDeliveryCount: 0,
    deliveredCount: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    ridersCount: 0,
    packersCount: 0,
    totalTeamCount: 0
  }

  const recentOrders = data?.recentOrders || []
  const filteredOrders = recentOrders.filter((order) => {
    if (orderFilter === 'all') return true
    return (order.orderStatus || '').toLowerCase() === orderFilter.toLowerCase()
  })

  const lowStockAlerts = data?.lowStockAlerts || []
  const riders = data?.riders || []
  const packers = data?.packers || []

  return (
    <div className="w-full space-y-6 pb-20">
      {/* 1. Branch Header & Operational Status Banner */}
      <div className="bg-gradient-to-r from-white via-emerald-50/20 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064C23] to-[#043b1b] text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {store.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {store.code}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f0f9f3] text-[#064C23] border border-[#bae2cb]">
                <span className="w-2 h-2 rounded-full bg-[#064C23] animate-pulse" />
                Store Manager Console
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1.5 flex-wrap gap-y-1">
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#064C23]" />
                {store.address}, {store.city} {store.pincode && `(${store.pincode})`}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="text-slate-400" />
                Hours: {store.operatingHours}
              </span>
            </div>
          </div>
        </div>

        {/* Store Live Operating Status Toggle & Refresh */}
        <div className="flex items-center space-x-3 self-end lg:self-center">
          <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 hidden sm:inline">
              Store Status:
            </span>
            {[
              { label: 'Open', color: 'bg-emerald-600 text-white' },
              { label: 'Rush Hours', color: 'bg-amber-500 text-white' },
              { label: 'Closed', color: 'bg-rose-600 text-white' }
            ].map(({ label, color }) => (
              <button
                key={label}
                type="button"
                disabled={statusUpdating}
                onClick={() => handleUpdateStoreStatus(label)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  store.status === label
                    ? `${color} shadow-xs scale-102`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchDashboardStats(true)}
            disabled={refreshing}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Refresh Live Operations"
          >
            <FontAwesomeIcon icon={faRotateRight} className={`text-sm ${refreshing ? 'animate-spin text-[#064C23]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Four Branch Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Orders Queue */}
        <div
          onClick={() => onNavigate && onNavigate('orders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#064C23]/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Orders In Queue
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base bg-blue-50 text-blue-700 border border-blue-200 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.activeOrdersCount} <span className="text-sm font-bold text-slate-400">Orders</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-blue-700 flex items-center space-x-1">
              <span>{stats.placedCount} Placed • {stats.packingCount} Packing</span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Branch Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Branch Sales
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base bg-[#f0f9f3] text-[#064C23] border border-[#bae2cb]">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#064C23] tracking-tight">
              {stats.todaySalesFormatted}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center space-x-1">
              <FontAwesomeIcon icon={faCheckDouble} className="text-[#064C23]" />
              <span>{stats.deliveredCount} Fulfilled & Delivered</span>
            </div>
          </div>
        </div>

        {/* Card 3: Stock Alert Warnings */}
        <div
          onClick={() => onNavigate && onNavigate('store-inventory')}
          className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group ${
            stats.lowStockCount > 0 ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Restock Needed
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base bg-amber-50 text-amber-800 border border-amber-200 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-900 tracking-tight">
              {stats.lowStockCount} <span className="text-sm font-bold text-slate-400">Products</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-rose-600 flex items-center space-x-1">
              <span>{stats.outOfStockCount} Out of Stock • {stats.lowStockCount - stats.outOfStockCount} Low Stock</span>
            </div>
          </div>
        </div>

        {/* Card 4: Floor & Dispatch Team */}
        <div
          onClick={() => onNavigate && onNavigate('delivery-staff')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#064C23]/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Floor Team
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base bg-emerald-50 text-emerald-800 border border-emerald-200 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faTruck} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalTeamCount} <span className="text-sm font-bold text-slate-400">Staff</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <span>{stats.packersCount} In-Store Packers • {stats.ridersCount} Delivery Riders</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Fulfillment Pipeline Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Live Order Fulfillment Pipeline
          </span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('orders')}
            className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
          >
            Open Orders Console →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'New Placed', count: stats.placedCount, bg: 'bg-amber-50 text-amber-900 border-amber-200' },
            { label: 'Confirmed', count: stats.confirmedCount, bg: 'bg-blue-50 text-blue-900 border-blue-200' },
            { label: 'Packing Now', count: stats.packingCount, bg: 'bg-purple-50 text-purple-900 border-purple-200' },
            { label: 'Out for Delivery', count: stats.outForDeliveryCount, bg: 'bg-orange-50 text-orange-900 border-orange-200' },
            { label: 'Delivered', count: stats.deliveredCount, bg: 'bg-emerald-50 text-emerald-900 border-emerald-200' }
          ].map((stage, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${stage.bg}`}
            >
              <span className="text-xl sm:text-2xl font-black font-mono">{stage.count}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Dark Store Operations Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Branch Order Dispatch Queue */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Live Branch Dispatch Queue
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#064C23]/10 text-[#064C23]">
                  {filteredOrders.length} Orders
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Incoming orders assigned to this store branch. Pack and handover to riders instantly.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs self-start sm:self-auto">
              {['all', 'placed', 'packing', 'out for delivery'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    orderFilter === st
                      ? 'bg-white text-[#064C23] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FontAwesomeIcon icon={faCheckDouble} className="text-3xl text-emerald-400" />
                <p className="text-xs font-semibold text-slate-600">All caught up! No pending orders in this filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = (order.orderStatus || 'Placed').toLowerCase()
                const isActionLoading = actionLoadingId === order.id

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'placed'
                                ? 'bg-amber-100 text-amber-900'
                                : status === 'packing'
                                ? 'bg-purple-100 text-purple-900'
                                : status === 'out for delivery'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          Customer: <span className="font-bold text-slate-800">{order.customerName}</span>
                          {order.phone && <span className="text-slate-400 ml-1.5 font-mono">({order.phone})</span>}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
                          <span>{order.itemsCount} Items</span>
                          <span>•</span>
                          <span className="font-black text-slate-900 font-mono">
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Dispatch Action Button */}
                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      {status === 'placed' && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleAdvanceOrderStatus(order.id, 'Packing')}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                        >
                          {isActionLoading ? (
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faBoxOpen} className="text-xs" />
                              <span>Start Packing</span>
                            </>
                          )}
                        </button>
                      )}

                      {status === 'packing' && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleAdvanceOrderStatus(order.id, 'Out for Delivery')}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#064C23] hover:bg-[#043b1b] text-white transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                        >
                          {isActionLoading ? (
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faTruck} className="text-xs" />
                              <span>Dispatch to Rider</span>
                            </>
                          )}
                        </button>
                      )}

                      {status === 'out for delivery' && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleAdvanceOrderStatus(order.id, 'Delivered')}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                        >
                          {isActionLoading ? (
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
                              <span>Confirm Delivered</span>
                            </>
                          )}
                        </button>
                      )}

                      {status === 'delivered' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Fulfilled
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('orders')}
              className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer inline-flex items-center space-x-1.5"
            >
              <span>View All Branch Orders & Timeline</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Right Column (1 Col): Critical Stock Alerts & Branch Floor Staff */}
        <div className="space-y-6">
          {/* Card A: Low Stock & Restock Alert */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-sm" />
                <h3 className="text-sm font-bold text-slate-900">Branch Stock Alerts</h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                {lowStockAlerts.length} Critical
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {lowStockAlerts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Branch stock levels are optimal. No restock needed!
                </div>
              ) : (
                lowStockAlerts.map((item) => {
                  const isRestocking = restockLoadingId === item.productId
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0"
                          onError={(e) => {
                            e.target.src = '/default-product.png'
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                item.isOutOfStock
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.isOutOfStock ? '0 in stock' : `${item.stock} left`}
                            </span>
                            <span className="text-[10px] text-slate-400">Min: {item.threshold}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isRestocking}
                        onClick={() => handleQuickRestock(item.productId, item.stock)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-[#064C23] hover:text-white text-slate-700 transition-all shrink-0 cursor-pointer shadow-2xs"
                        title="Add +15 units to branch inventory"
                      >
                        {isRestocking ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                        ) : (
                          <span>+15 Stock</span>
                        )}
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('store-inventory')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[#064C23] bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer text-center block"
            >
              Open Branch Stock Control →
            </button>
          </div>

          {/* Card B: Store Floor Staff (Packers & Riders) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faTruck} className="text-[#064C23] text-sm" />
                <h3 className="text-sm font-bold text-slate-900">Branch Operations Team</h3>
              </div>
              <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-2.5 py-0.5 rounded-lg border border-[#bae2cb]">
                {stats.totalTeamCount} on shift
              </span>
            </div>

            {/* Packers list */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                In-Store Order Packers ({packers.length})
              </span>
              {packers.length === 0 ? (
                <p className="text-xs text-slate-400">No active packers assigned.</p>
              ) : (
                <div className="space-y-1.5">
                  {packers.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-2 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-purple-600 text-xs" />
                        <span className="font-bold text-slate-800">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{p.phone || 'Available'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Riders list */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivery Riders ({riders.length})
              </span>
              {riders.length === 0 ? (
                <p className="text-xs text-slate-400">No active riders assigned.</p>
              ) : (
                <div className="space-y-1.5">
                  {riders.slice(0, 3).map((r) => (
                    <div key={r.id} className="p-2 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faMotorcycle} className="text-blue-600 text-xs" />
                        <span className="font-bold text-slate-800">{r.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{r.phone || 'Ready'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
