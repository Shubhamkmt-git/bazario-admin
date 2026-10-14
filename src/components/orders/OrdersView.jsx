import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faMagnifyingGlass,
  faCircleCheck,
  faClock,
  faRotateRight,
  faDownload,
  faReceipt,
  faTruck,
  faTruckFast,
  faBoxesStacked,
  faCircleExclamation,
  faTriangleExclamation,
  faPhone,
  faLocationDot,
  faCheck,
  faStore,
  faBan,
  faEye,
  faUser,
  faFileInvoice
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import Modal from '../ui/Modal'
import AlertModal from '../ui/AlertModal'
import {
  getAdminOrdersApi,
  getStoreOrdersApi,
  updateStoreOrderStatusApi,
  updateAdminOrderStatusApi,
  getStoreRidersApi,
  getStorePackersApi
} from '../../utils/adminApi'

export default function OrdersView({ currentUser }) {
  const toast = useToast()
  const isStoreManager = currentUser?.role === 'Store Manager'

  const [orders, setOrders] = useState([])
  const [riders, setRiders] = useState([])
  const [packers, setPackers] = useState([])
  const [orderFilter, setOrderFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dispatchModal, setDispatchModal] = useState({ isOpen: false, order: null })
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [dispatchNote, setDispatchNote] = useState('')
  const [packModal, setPackModal] = useState({ isOpen: false, order: null })
  const [selectedPackerName, setSelectedPackerName] = useState('')
  const [cancelModal, setCancelModal] = useState({ isOpen: false, order: null, reason: '' })
  const [packedItems, setPackedItems] = useState({}) // { [orderId-itemId]: boolean }

  // 1. Fetch Orders and Riders
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      let ordersList = []
      if (isStoreManager) {
        const res = await getStoreOrdersApi()
        ordersList = res.orders || []
      } else {
        const res = await getAdminOrdersApi()
        ordersList = res.orders || res.data || []
      }

      const formatted = (Array.isArray(ordersList) ? ordersList : []).map((o) => {
        const itemList = Array.isArray(o.items) ? o.items : []
        const itemsText =
          itemList.length > 0
            ? `${itemList.length} items (${itemList
                .map((i) => i.name || i.title)
                .slice(0, 2)
                .join(', ')}${itemList.length > 2 ? '...' : ''})`
            : '0 items'

        const timeText = o.createdAt
          ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Just now'

        let addrStr = 'N/A'
        if (typeof o.deliveryAddress === 'object' && o.deliveryAddress) {
          addrStr = `${o.deliveryAddress.addressLine || ''}, ${o.deliveryAddress.city || ''} ${
            o.deliveryAddress.pincode || ''
          }`
        } else if (typeof o.address === 'object' && o.address) {
          addrStr = `${o.address.addressLine || ''}, ${o.address.city || ''}`
        } else if (typeof o.deliveryAddress === 'string') {
          addrStr = o.deliveryAddress
        }

        const rawStatus = o.orderStatus || o.status || 'Placed'

        return {
          id: o.orderNumber ? `#${o.orderNumber}` : o.id ? `#${o.id}` : `#ORD-${(o._id || '').slice(-4)}`,
          rawId: o.id || o._id,
          orderNumber: o.orderNumber || o.id,
          _id: o._id || o.id,
          customer: o.customerName || o.user?.name || 'Customer',
          email: o.customerEmail || o.user?.email || '',
          phone: o.customerPhone || o.user?.phone || '',
          items: itemsText,
          rawItems: itemList,
          total: `₹${Number(o.totalAmount || o.subtotal || 0).toLocaleString('en-IN')}`,
          rawTotal: Number(o.totalAmount || o.subtotal || 0),
          subtotal: Number(o.subtotal || 0),
          deliveryFee: Number(o.deliveryFee || 0),
          status: rawStatus,
          time: timeText,
          createdAt: o.createdAt,
          payment: o.paymentMethod || 'Cash on Delivery (COD)',
          paymentStatus: o.paymentStatus || 'Pending',
          deliveryAddress: addrStr,
          rawAddress: o.deliveryAddress || o.address || {},
          assignedRider: o.assignedRider || o.deliveryPartner?.name || '',
          deliveryPartnerId: o.deliveryPartnerId || o.deliveryPartner?.id || '',
          assignedPacker:
            o.assignedPacker ||
            (Array.isArray(o.timeline) ? o.timeline : []).find((e) => e.packer)?.packer ||
            ((Array.isArray(o.timeline) ? o.timeline : []).find((e) => e.note && e.note.toLowerCase().includes('packer:'))?.note?.split(/packer:\s*/i)[1]?.trim() || ''),
          timeline: Array.isArray(o.timeline) ? o.timeline : [],
          assignedStore: o.assignedStore?.name || ''
        }
      })

      setOrders(formatted)
    } catch (err) {
      console.warn('Orders fetch error:', err)
      toast.error('Sync Failed', 'Could not refresh orders list.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Delivery Riders for Store Manager
  const fetchRiders = async () => {
    try {
      const res = await getStoreRidersApi()
      if (res && res.riders) {
        setRiders(res.riders)
        if (res.riders.length > 0 && !selectedRiderId) {
          setSelectedRiderId(res.riders[0].id)
        }
      }
    } catch (_) {}
  }

  // Fetch Assigned Store Packers
  const fetchPackers = async () => {
    try {
      const res = await getStorePackersApi()
      if (res && res.packers) {
        setPackers(res.packers)
        if (res.packers.length > 0 && !selectedPackerName) {
          setSelectedPackerName(res.packers[0].name)
        }
      }
    } catch (_) {}
  }

  useEffect(() => {
    fetchOrders()
    fetchRiders()
    fetchPackers()
  }, [])

  // 2. Status Transition Handlers
  const handleTransitionStatus = async (order, targetStatus, riderId = null, note = '') => {
    const orderIdToUpdate = order.rawId || order._id || order.orderNumber
    try {
      if (isStoreManager) {
        await updateStoreOrderStatusApi(orderIdToUpdate, {
          orderStatus: targetStatus,
          deliveryPartnerId: riderId || undefined,
          note: note || `Order updated to ${targetStatus} by Store Manager`
        })
      } else {
        await updateAdminOrderStatusApi(orderIdToUpdate, targetStatus, riderId || '')
      }

      toast.success(
        'Order Updated',
        `Order ${order.id} status is now "${targetStatus}".`
      )

      if (selectedOrder && selectedOrder.rawId === order.rawId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: targetStatus } : null))
      }

      fetchOrders()
    } catch (err) {
      toast.error('Update Failed', err.message || 'Could not update order status.')
    }
  }

  // Open Packer Assignment Modal to assign in-store packer
  const handleOpenPackModal = (order) => {
    setPackModal({ isOpen: true, order })
    if (packers.length > 0) {
      setSelectedPackerName(packers[0].name)
    }
  }

  // Confirm Packing with selected Packer
  const handleConfirmPacking = async () => {
    if (!packModal.order) return
    const packer = packers.find((p) => p.name === selectedPackerName)
    const packerLabel = packer ? packer.name : (selectedPackerName || 'Branch Packer')
    await handleTransitionStatus(
      packModal.order,
      'Packing',
      null,
      `Assigned to packer: ${packerLabel}`
    )
    setPackModal({ isOpen: false, order: null })
  }

  // Open Dispatch Modal to choose rider
  const handleOpenDispatchModal = (order) => {
    setDispatchModal({ isOpen: true, order })
    setDispatchNote('')
    if (riders.length > 0) {
      setSelectedRiderId(riders[0].id)
    }
  }

  // Confirm Dispatch with Rider
  const handleConfirmDispatch = async () => {
    if (!dispatchModal.order) return
    const rider = riders.find((r) => r.id === selectedRiderId)
    await handleTransitionStatus(
      dispatchModal.order,
      'Out for Delivery',
      selectedRiderId,
      dispatchNote || (rider ? `Handed over to delivery rider: ${rider.name} (${rider.vehicleType || 'Bike'})` : 'Dispatched with rider')
    )
    setDispatchModal({ isOpen: false, order: null })
  }

  // Mark Order as Delivered
  const handleMarkDelivered = (order) => {
    handleTransitionStatus(order, 'Delivered', order.deliveryPartnerId, 'Order delivered to customer doorstep and verified.')
  }

  // Confirm Order Cancellation
  const handleConfirmCancel = async () => {
    if (!cancelModal.order) return
    await handleTransitionStatus(
      cancelModal.order,
      'Cancelled',
      null,
      cancelModal.reason || 'Order cancelled by store manager'
    )
    setCancelModal({ isOpen: false, order: null, reason: '' })
  }

  // Toggle item packing verification checkbox
  const toggleItemPacked = (orderId, itemIdx) => {
    const key = `${orderId}-${itemIdx}`
    setPackedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Status Metrics
  const placedCount = orders.filter((o) => o.status === 'Placed').length
  const packingCount = orders.filter((o) => o.status === 'Packing').length
  const outForDeliveryCount = orders.filter((o) => o.status === 'Out for Delivery').length
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderFilter === 'all' ||
      order.status.toLowerCase() === orderFilter.toLowerCase()

    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Placed (New)
          </span>
        )
      case 'Packing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
            <FontAwesomeIcon icon={faBoxesStacked} className="text-[10px]" />
            Packing in Branch
          </span>
        )
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs">
            <FontAwesomeIcon icon={faTruckFast} className="text-[10px]" />
            Out for Delivery
          </span>
        )
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
            Delivered
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <FontAwesomeIcon icon={faBan} className="text-[10px]" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="w-full space-y-6 pb-20 font-roboto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064C23] to-[#0A6831] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0 text-2xl">
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isStoreManager ? 'Orders Queue & Live Dispatch' : 'Store Orders Management'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-[#064C23] border border-emerald-300">
                {isStoreManager ? (currentUser?.store?.name || 'Local Branch') : 'Super Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isStoreManager
                ? 'Manage active order queue, pick items, assign branch delivery riders, and dispatch to customers.'
                : 'Central order telemetry across all supermarket outlets and online delivery channels.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={fetchOrders}
            icon={<FontAwesomeIcon icon={faRotateRight} className={`text-xs ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Sync Live Orders
          </Button>
        </div>
      </div>

      {/* 2. Live Order Pipeline KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Placed / New */}
        <div
          onClick={() => setOrderFilter('placed')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs ${
            orderFilter === 'placed' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">1. Placed (New)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{placedCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Awaiting store confirmation</p>
        </div>

        {/* Packing */}
        <div
          onClick={() => setOrderFilter('packing')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs ${
            orderFilter === 'packing' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">2. In Packing</span>
            <FontAwesomeIcon icon={faBoxesStacked} className="text-purple-500 text-xs" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{packingCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Staff picking items from aisles</p>
        </div>

        {/* Out for Delivery */}
        <div
          onClick={() => setOrderFilter('out for delivery')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs ${
            orderFilter === 'out for delivery' ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">3. Out with Rider</span>
            <FontAwesomeIcon icon={faTruckFast} className="text-cyan-500 text-xs" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{outForDeliveryCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">On road to customer location</p>
        </div>

        {/* Delivered Today */}
        <div
          onClick={() => setOrderFilter('delivered')}
          className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs ${
            orderFilter === 'delivered' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">4. Delivered</span>
            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{deliveredCount}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Successfully fulfilled</p>
        </div>
      </div>

      {/* 3. Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, customer, phone, items..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs self-start md:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'placed', label: 'Placed' },
              { id: 'packing', label: 'Packing' },
              { id: 'out for delivery', label: 'Out for Delivery' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setOrderFilter(st.id)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  orderFilter === st.id
                    ? 'bg-white text-[#064C23] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer & Drop</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Bill & Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Personnel</th>
                <th className="px-6 py-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.rawId || order.orderNumber} className="hover:bg-slate-50/75 transition-colors">
                    {/* Order ID & Time */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="font-extrabold text-[#064C23] hover:underline cursor-pointer block text-sm"
                      >
                        {order.id}
                      </button>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                        {order.time}
                      </span>
                    </td>

                    {/* Customer & Address */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{order.customer}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <FontAwesomeIcon icon={faPhone} className="text-[9px] text-slate-400" />
                        <a href={`tel:${order.phone}`} className="hover:text-[#064C23]">
                          {order.phone || 'No phone'}
                        </a>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1 text-[9px]" />
                        {order.deliveryAddress}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px]">
                      <div className="font-medium truncate">{order.items}</div>
                      <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {order.rawItems.length} products
                      </span>
                    </td>

                    {/* Amount & Payment */}
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900 text-sm">{order.total}</div>
                      <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                        {order.payment}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(order.status)}
                    </td>

                    {/* Assigned Personnel: Packer & Rider */}
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      <div className="space-y-1">
                        {order.assignedPacker ? (
                          <div className="inline-flex items-center gap-1.5 font-bold text-[#064C23] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <FontAwesomeIcon icon={faBoxesStacked} className="text-[#064C23] text-[10px]" />
                            <span>Packer: {order.assignedPacker}</span>
                          </div>
                        ) : order.status === 'Packing' ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            In Packing
                          </div>
                        ) : null}

                        {order.assignedRider ? (
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
                            <FontAwesomeIcon icon={faTruckFast} className="text-cyan-600 text-xs" />
                            <span>Rider: {order.assignedRider}</span>
                          </div>
                        ) : !order.assignedPacker ? (
                          <span className="text-slate-400 text-xs italic">Unassigned</span>
                        ) : null}
                      </div>
                    </td>

                    {/* Dispatch Quick Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      {order.status === 'Placed' && (
                        <button
                          type="button"
                          onClick={() => handleOpenPackModal(order)}
                          className="px-3 py-1.5 bg-[#064C23] hover:bg-[#043618] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <FontAwesomeIcon icon={faBoxesStacked} className="text-[10px]" />
                          <span>Accept & Pack</span>
                        </button>
                      )}

                      {order.status === 'Packing' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDispatchModal(order)}
                          className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <FontAwesomeIcon icon={faTruckFast} className="text-[10px]" />
                          <span>Dispatch Rider</span>
                        </button>
                      )}

                      {order.status === 'Out for Delivery' && (
                        <button
                          type="button"
                          onClick={() => handleMarkDelivered(order)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title="View Full Packing Slip"
                      >
                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                      </button>

                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => setCancelModal({ isOpen: true, order, reason: '' })}
                          className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Cancel Order"
                        >
                          <FontAwesomeIcon icon={faBan} className="text-xs" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3b. IN-STORE PACKER SELECTION MODAL */}
      {packModal.isOpen && packModal.order && (
        <Modal
          isOpen={packModal.isOpen}
          onClose={() => setPackModal({ isOpen: false, order: null })}
          title={`Assign Packer for ${packModal.order.id}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 text-sm">Customer: {packModal.order.customer}</span>
                <span className="font-extrabold text-[#064C23] text-sm">{packModal.order.total}</span>
              </div>
              <p className="text-slate-500">{packModal.order.items}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Select Store Packer / Picker
              </label>

              {packers.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {packers.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPackerName === p.name
                          ? 'border-[#064C23] bg-emerald-50/60 ring-2 ring-[#064C23]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="packerSelect"
                          value={p.name}
                          checked={selectedPackerName === p.name}
                          onChange={() => setSelectedPackerName(p.name)}
                          className="text-[#064C23] focus:ring-[#064C23]"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {p.role || 'Order Packer'} • {p.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.status || 'Active'}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                    No packers registered for this branch. You can type packer name manually:
                  </div>
                  <input
                    type="text"
                    value={selectedPackerName}
                    onChange={(e) => setSelectedPackerName(e.target.value)}
                    placeholder="Enter packer name (e.g. Deepak Rawat)"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPackModal({ isOpen: false, order: null })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmPacking}
                icon={<FontAwesomeIcon icon={faBoxesStacked} className="text-xs" />}
              >
                Assign & Start Packing
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. DISPATCH RIDER SELECTION MODAL */}
      {dispatchModal.isOpen && dispatchModal.order && (
        <Modal
          isOpen={dispatchModal.isOpen}
          onClose={() => setDispatchModal({ isOpen: false, order: null })}
          title={`Dispatch Order ${dispatchModal.order.id}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800 text-sm">Customer: {dispatchModal.order.customer}</span>
                <span className="font-extrabold text-[#064C23] text-sm">{dispatchModal.order.total}</span>
              </div>
              <p className="text-slate-500">{dispatchModal.order.deliveryAddress}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Select Branch Delivery Partner (Rider)
              </label>

              {riders.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {riders.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRiderId === r.id
                          ? 'border-[#064C23] bg-emerald-50/60 ring-2 ring-[#064C23]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="dispatchRider"
                          value={r.id}
                          checked={selectedRiderId === r.id}
                          onChange={() => setSelectedRiderId(r.id)}
                          className="text-[#064C23] focus:ring-[#064C23]"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{r.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {r.vehicleType || 'Bike'} • {r.vehicleNumber || 'No plate'} • {r.phone}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Available
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  No active delivery riders found for this branch. Please add riders in Branch Delivery Fleet.
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Dispatch Note (Optional)
              </label>
              <input
                type="text"
                value={dispatchNote}
                onChange={(e) => setDispatchNote(e.target.value)}
                placeholder="e.g. Call before delivery, handle bakery items carefully"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDispatchModal({ isOpen: false, order: null })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedRiderId}
                onClick={handleConfirmDispatch}
                icon={<FontAwesomeIcon icon={faTruckFast} className="text-xs" />}
              >
                Confirm Dispatch & Handover
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. DETAILED PACKING SLIP & ORDER MODAL */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Checklist & Details: ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Top Status & Store Banner */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">{selectedOrder.id}</span>
                  {renderStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Placed at: {selectedOrder.time} • Payment: {selectedOrder.payment} ({selectedOrder.paymentStatus})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                <span className="text-xl font-black text-[#064C23]">{selectedOrder.total}</span>
              </div>
            </div>

            {/* Customer & Address Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} /> Customer Profile
                </span>
                <p className="font-bold text-slate-900 text-sm">{selectedOrder.customer}</p>
                <p className="text-slate-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faPhone} className="text-[10px] text-slate-400" />
                  <a href={`tel:${selectedOrder.phone}`} className="text-[#064C23] font-semibold hover:underline">
                    {selectedOrder.phone}
                  </a>
                </p>
                <p className="text-slate-400 text-[11px]">{selectedOrder.email || 'No email provided'}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} /> Delivery Drop Point
                </span>
                <p className="font-medium text-slate-800 text-xs leading-relaxed">
                  {selectedOrder.deliveryAddress}
                </p>
                {selectedOrder.assignedPacker && (
                  <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-block mt-1 mr-2">
                    Assigned Packer: {selectedOrder.assignedPacker}
                  </p>
                )}
                {selectedOrder.assignedRider && (
                  <p className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-1 rounded-lg border border-cyan-200 inline-block mt-1">
                    Assigned Rider: {selectedOrder.assignedRider}
                  </p>
                )}
              </div>
            </div>

            {/* Interactive Items Checklist for Picker/Packer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faBoxesStacked} className="text-[#064C23]" />
                  Aisle Picking Checklist ({selectedOrder.rawItems.length} items)
                </span>
                <span className="text-[10px] text-slate-400">Click items to check off while packing</span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.rawItems.map((item, idx) => {
                  const itemKey = `${selectedOrder.rawId}-${idx}`
                  const isChecked = Boolean(packedItems[itemKey])
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleItemPacked(selectedOrder.rawId, idx)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/70 text-emerald-950' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-bold text-xs truncate ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.name || item.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.weight || item.unit || ''} • ₹{item.price} each
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs text-slate-900">Qty: {item.qty || 1}</span>
                        <p className="text-[11px] font-extrabold text-[#064C23]">
                          ₹{(item.price || 0) * (item.qty || 1)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bill Breakup */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">₹{selectedOrder.subtotal || selectedOrder.rawTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee:</span>
                <span className="font-bold text-slate-800">₹{selectedOrder.deliveryFee || 0}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Final Payable:</span>
                <span className="text-[#064C23] text-base">{selectedOrder.total}</span>
              </div>
            </div>

            {/* Timeline Stepper */}
            {selectedOrder.timeline.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Order Audit History:
                </span>
                <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-3">
                  {selectedOrder.timeline.map((t, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-[#064C23]" />
                      <div className="text-xs font-bold text-slate-800">{t.status}</div>
                      <p className="text-[10px] text-slate-400">
                        {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ''} - {t.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Workflow Buttons Inside Modal */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                {selectedOrder.status === 'Placed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleOpenPackModal(selectedOrder)
                      setSelectedOrder(null)
                    }}
                    icon={<FontAwesomeIcon icon={faBoxesStacked} className="text-xs" />}
                  >
                    Assign Packer & Start
                  </Button>
                )}

                {selectedOrder.status === 'Packing' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleOpenDispatchModal(selectedOrder)
                      setSelectedOrder(null)
                    }}
                    icon={<FontAwesomeIcon icon={faTruckFast} className="text-xs" />}
                  >
                    Assign Rider & Dispatch
                  </Button>
                )}

                {selectedOrder.status === 'Out for Delivery' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleMarkDelivered(selectedOrder)
                      setSelectedOrder(null)
                    }}
                    icon={<FontAwesomeIcon icon={faCircleCheck} className="text-xs" />}
                  >
                    Mark as Delivered
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faFileInvoice} className="text-xs" />
                  <span>Print Packing Slip</span>
                </button>
              </div>

              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. CANCEL ORDER MODAL */}
      {cancelModal.isOpen && (
        <AlertModal
          isOpen={cancelModal.isOpen}
          onClose={() => setCancelModal({ isOpen: false, order: null, reason: '' })}
          onConfirm={handleConfirmCancel}
          type="danger"
          title={`Cancel Order ${cancelModal.order?.id}`}
          description={`Are you sure you want to cancel this order? This will notify the customer and halt branch processing.`}
          confirmText="Yes, Cancel Order"
          cancelText="Keep Order"
        />
      )}
    </div>
  )
}
