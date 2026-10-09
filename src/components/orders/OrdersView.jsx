import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faMagnifyingGlass,
  faFilter,
  faCircleCheck,
  faClock,
  faRotateRight,
  faDownload,
  faReceipt,
  faTruck,
  faCircleExclamation,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import Modal from '../ui/Modal'
import AlertModal from '../ui/AlertModal'

const INITIAL_ORDERS = [
  {
    id: '#ORD-9842',
    customer: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98234 11223',
    items: '5 items (Apples 1kg, Milk 2L, Brown Bread)',
    total: '$34.80',
    status: 'Completed',
    time: '10 mins ago',
    payment: 'UPI / Online',
    deliveryAddress: 'Flat 402, Green Valley Apts, Sector 14',
  },
  {
    id: '#ORD-9841',
    customer: 'Rahul Verma',
    email: 'rahul.v@techmail.com',
    phone: '+91 97123 44556',
    items: '12 items (Weekly Grocery Essentials Pack)',
    total: '$118.50',
    status: 'Processing',
    time: '24 mins ago',
    payment: 'Credit Card',
    deliveryAddress: 'B-12, Palm Residency, Block C',
  },
  {
    id: '#ORD-9840',
    customer: 'Ananya Roy',
    email: 'ananya.roy@web.in',
    phone: '+91 98450 67890',
    items: '3 items (Fresh Organic Strawberries x3)',
    total: '$18.00',
    status: 'Pending',
    time: '45 mins ago',
    payment: 'Cash on Delivery',
    deliveryAddress: 'Villa 7, Orchid Enclave, Main Road',
  },
  {
    id: '#ORD-9839',
    customer: 'Amit Patel',
    email: 'amit.patel@corphub.com',
    phone: '+91 99012 33445',
    items: '8 items (Bakery, Dairy & Organic Honey)',
    total: '$52.20',
    status: 'Completed',
    time: '1 hour ago',
    payment: 'UPI / Online',
    deliveryAddress: 'Flat 101, Sunshine Towers',
  },
  {
    id: '#ORD-9838',
    customer: 'Kavita Joshi',
    email: 'kavita.j@mail.com',
    phone: '+91 98765 12340',
    items: '2 items (Cold Pressed Olive Oil 1L x2)',
    total: '$29.90',
    status: 'Completed',
    time: '2 hours ago',
    payment: 'Credit Card',
    deliveryAddress: 'House #45, Sector 21',
  },
  {
    id: '#ORD-9837',
    customer: 'Suresh Kumar',
    email: 'suresh.k@enterprise.com',
    phone: '+91 98333 44112',
    items: '15 items (Bulk Grain & Pulse Pack)',
    total: '$145.00',
    status: 'Processing',
    time: '3 hours ago',
    payment: 'Net Banking',
    deliveryAddress: 'Shop 12, Commercial Market Hub',
  },
  {
    id: '#ORD-9836',
    customer: 'Neha Gupta',
    email: 'neha.gupta@fintech.io',
    phone: '+91 97654 32109',
    items: '4 items (Almond Milk, Oats & Berries)',
    total: '$24.50',
    status: 'Completed',
    time: '4 hours ago',
    payment: 'UPI / Online',
    deliveryAddress: 'D-304, Silver Oak Apartments',
  },
]

export default function OrdersView() {
  const toast = useToast()
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [orderFilter, setOrderFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null })

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      orderFilter === 'all' || order.status.toLowerCase() === orderFilter.toLowerCase()
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleDelete = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    setDeleteModal({ isOpen: false, orderId: null })
    toast.success('Order Deleted', `Order ${orderId} was removed from database.`)
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store Orders Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Live transaction records across cashier counters and online delivery orders.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => toast.info('Refreshed', 'Latest order log synced.')}
            icon={<FontAwesomeIcon icon={faRotateRight} className="text-xs" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => toast.success('Export Successful', 'Orders report CSV generated.')}
            icon={<FontAwesomeIcon icon={faDownload} className="text-xs" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, customer name, items..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs self-start md:self-auto overflow-x-auto">
            {['all', 'completed', 'processing', 'pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setOrderFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#064C23]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{order.customer}</div>
                      <div className="text-xs text-slate-400">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-[240px]">
                      <div className="truncate font-medium">{order.items}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{order.time}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {order.payment}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.status === 'Processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.status === 'Completed' && (
                          <FontAwesomeIcon icon={faCircleCheck} className="mr-1 text-[10px]" />
                        )}
                        {order.status === 'Processing' && (
                          <FontAwesomeIcon icon={faClock} className="mr-1 text-[10px]" />
                        )}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => setSelectedOrder(order)}
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => setDeleteModal({ isOpen: true, orderId: order.id })}
                      />
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

      {/* View Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details - ${selectedOrder.id}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Customer:</span>
                <span>{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Phone:</span>
                <span>{selectedOrder.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Email:</span>
                <span>{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Items:</span>
                <span className="font-semibold text-slate-700">{selectedOrder.items}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Address:</span>
                <span className="text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span>{selectedOrder.payment}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base text-[#064C23]">
                <span>Total Amount:</span>
                <span>{selectedOrder.total}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={() => handleDelete(deleteModal.orderId)}
        type="danger"
        title="Delete Order Record"
        description={`Are you sure you want to delete ${deleteModal.orderId}? This action cannot be reversed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
