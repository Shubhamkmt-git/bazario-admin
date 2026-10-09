import React, { useState } from 'react'
import {
  Header,
  Sidebar,
  Footer,
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  ImageUploadFrame,
  FormLayout,
  FormSection,
  FormRow,
  FormActions,
  Modal,
  AlertModal
} from '../components'
import { useToast } from '../context/ToastContext'
import {
  faChartLine,
  faBoxesStacked,
  faCartShopping,
  faUsers,
  faGear,
  faPlus,
  faArrowTrendUp,
  faArrowTrendDown,
  faClock,
  faCircleCheck,
  faTriangleExclamation,
  faRotateRight,
  faDownload,
  faFilter,
  faMagnifyingGlass,
  faStore,
  faTruck,
  faWallet,
  faBasketShopping,
  faReceipt,
  faTag
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function DashboardPage({ onLogout }) {
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dateFilter, setDateFilter] = useState('today')
  const [orderFilter, setOrderFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fresh Fruits',
    sku: '',
    price: '',
    stock: '',
    image: null,
  })

  // View Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Delete Confirm Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, orderId: null })

  // Sample Orders Data
  const [orders, setOrders] = useState([
    {
      id: '#ORD-9842',
      customer: 'Priya Sharma',
      email: 'priya.s@example.com',
      items: '5 items (Apples, Milk, Bread)',
      total: '$34.80',
      status: 'Completed',
      time: '10 mins ago',
      payment: 'UPI / Online',
    },
    {
      id: '#ORD-9841',
      customer: 'Rahul Verma',
      email: 'rahul.v@techmail.com',
      items: '12 items (Grocery Pack)',
      total: '$118.50',
      status: 'Processing',
      time: '24 mins ago',
      payment: 'Credit Card',
    },
    {
      id: '#ORD-9840',
      customer: 'Ananya Roy',
      email: 'ananya.roy@web.in',
      items: '3 items (Fresh Strawberries x3)',
      total: '$18.00',
      status: 'Pending',
      time: '45 mins ago',
      payment: 'Cash on Delivery',
    },
    {
      id: '#ORD-9839',
      customer: 'Amit Patel',
      email: 'amit.patel@corphub.com',
      items: '8 items (Bakery & Dairy)',
      total: '$52.20',
      status: 'Completed',
      time: '1 hour ago',
      payment: 'UPI / Online',
    },
    {
      id: '#ORD-9838',
      customer: 'Kavita Joshi',
      email: 'kavita.j@mail.com',
      items: '2 items (Olive Oil 1L)',
      total: '$29.90',
      status: 'Completed',
      time: '2 hours ago',
      payment: 'Credit Card',
    },
  ])

  // Navigation Items
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
    { id: 'orders', name: 'Orders', icon: faCartShopping, badge: `${orders.length}` },
    { id: 'products', name: 'Products & Stock', icon: faBoxesStacked, badge: 'Low' },
    { id: 'customers', name: 'Customers', icon: faUsers },
    { id: 'settings', name: 'Settings', icon: faGear },
  ]

  // KPI Metrics
  const stats = [
    {
      title: "Today's Revenue",
      value: '$12,480.50',
      change: '+14.8%',
      isPositive: true,
      icon: faWallet,
      iconBg: 'bg-[#f0f9f3] text-[#064C23] border border-[#bae2cb]',
    },
    {
      title: 'Total Orders',
      value: '482 Orders',
      change: '+8.2%',
      isPositive: true,
      icon: faReceipt,
      iconBg: 'bg-[#fdf6f4] text-[#A44F37] border border-[#f5d5cc]',
    },
    {
      title: 'Active Customers',
      value: '1,240',
      change: '+12.4%',
      isPositive: true,
      icon: faUsers,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      title: 'Low Stock Alert',
      value: '7 Products',
      change: 'Requires Restock',
      isPositive: false,
      icon: faTriangleExclamation,
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
    },
  ]

  // Supermarket Categories
  const categories = [
    { name: 'Fresh Fruits & Veggies', sales: '$4,820', items: '142 Items', progress: '85%', color: 'bg-[#064C23]' },
    { name: 'Dairy & Bakery Goods', sales: '$3,150', items: '98 Items', progress: '65%', color: 'bg-[#A44F37]' },
    { name: 'Packaged Snacks & Drinks', sales: '$2,890', items: '210 Items', progress: '54%', color: 'bg-emerald-600' },
    { name: 'Household & Personal Care', sales: '$1,620', items: '86 Items', progress: '38%', color: 'bg-amber-600' },
  ]

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderFilter === 'all' || order.status.toLowerCase() === orderFilter.toLowerCase()
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Handlers
  const handleCreateProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) {
      toast.error('Validation Error', 'Please fill in product name and price.')
      return
    }

    toast.success('Product Added', `"${newProduct.name}" has been added to Bazario catalog!`)
    setIsAddProductOpen(false)
    setNewProduct({ name: '', category: 'Fresh Fruits', sku: '', price: '', stock: '', image: null })
  }

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    setDeleteModal({ isOpen: false, orderId: null })
    toast.success('Order Deleted', `Order ${orderId} was removed from records.`)
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex font-roboto text-slate-800 antialiased overflow-hidden selection:bg-[#064C23] selection:text-white">
      {/* Reusable Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={{ name: 'Store Admin', email: 'admin@bazario.com', avatar: 'BA' }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Reusable Header (Never Scrolls) */}
        <Header
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          onLogout={onLogout}
          className="shrink-0"
        />

        {/* Scrollable Main Body & Content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#042813] via-[#064C23] to-[#0a5c2d] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#064C23]">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#A44F37]/25 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#A44F37] text-white shadow-xs">
                    <FontAwesomeIcon icon={faStore} className="mr-1 text-[10px]" />
                    Central Superstore #01
                  </span>
                  <span className="text-xs text-emerald-200/80">Live POS Connected</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Bazario Store Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/85">
                  Real-time sales velocity, live supermarket orders, inventory management, and store metrics.
                </p>
              </div>

              {/* Date Filters & Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-black/30 backdrop-blur-md p-1 rounded-xl flex items-center border border-white/15">
                  {['today', 'week', 'month'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => {
                        setDateFilter(period)
                        toast.info('Date Filter', `Showing data for ${period.toUpperCase()}`)
                      }}
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
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  icon={<FontAwesomeIcon icon={faDownload} className="text-xs" />}
                  onClick={() => toast.success('Report Exported', 'Sales summary CSV downloaded.')}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${stat.iconBg}`}>
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-2 flex items-center text-xs font-semibold">
                    <span
                      className={`inline-flex items-center space-x-1 ${
                        stat.isPositive ? 'text-[#064C23]' : 'text-rose-600'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={stat.isPositive ? faArrowTrendUp : faArrowTrendDown}
                        className="mr-1 text-[11px]"
                      />
                      {stat.change}
                    </span>
                    <span className="text-slate-400 ml-2 font-normal">vs previous period</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Section: Supermarket Categories & Store Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Category Performance */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Top Selling Categories</h2>
                  <p className="text-xs text-slate-500">Volume breakdown by supermarket departments</p>
                </div>
                <span className="text-xs font-semibold text-[#064C23] bg-[#f0f9f3] px-2.5 py-1 rounded-lg border border-[#bae2cb]">
                  4 Departments
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <div className="space-x-3 text-right">
                        <span className="text-slate-400">{cat.items}</span>
                        <span className="font-bold text-slate-900">{cat.sales}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                        style={{ width: cat.progress }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Live Actions & Inventory Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Quick Operations</h2>
                <p className="text-xs text-slate-500">Instant management shortcuts</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  className="p-3 bg-slate-50 hover:bg-[#f0f9f3] border border-slate-200 hover:border-[#064C23] rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Add Product</p>
                  <p className="text-[10px] text-slate-400">Inventory intake</p>
                </button>

                <button
                  type="button"
                  onClick={() => toast.info('POS Terminal', 'Opening Billing POS window...')}
                  className="p-3 bg-slate-50 hover:bg-[#fdf6f4] border border-slate-200 hover:border-[#A44F37] rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#A44F37]/10 text-[#A44F37] flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faBasketShopping} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">POS Billing</p>
                  <p className="text-[10px] text-slate-400">Create new sale</p>
                </button>

                <button
                  type="button"
                  onClick={() => toast.warning('Restock Order', 'Restock requisition drafted for 7 items.')}
                  className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faBoxesStacked} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Stock Order</p>
                  <p className="text-[10px] text-slate-400">7 items low</p>
                </button>

                <button
                  type="button"
                  onClick={() => toast.success('Driver Dispatched', 'Delivery driver assigned to pending orders.')}
                  className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faTruck} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Dispatch</p>
                  <p className="text-[10px] text-slate-400">Delivery fleet</p>
                </button>
              </div>

              {/* Status footer banner */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Bazario Sync Live</span>
                </span>
                <button
                  type="button"
                  onClick={() => toast.info('Refreshed', 'Latest transactions loaded.')}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Refresh data"
                >
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Recent Store Orders Table with Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Store Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time transaction log across cashier counters and online orders
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search in table */}
                <div className="relative w-48 sm:w-60">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customer, ID..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
                  />
                </div>

                {/* Status Tabs */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
                  {['all', 'completed', 'processing', 'pending'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                        orderFilter === st
                          ? 'bg-white text-[#064C23] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Items Summary</th>
                    <th className="px-6 py-3.5">Payment</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
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
                          <div className="font-semibold text-slate-800">{order.customer}</div>
                          <div className="text-[11px] text-slate-400">{order.email}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-[220px] truncate">
                          <div>{order.items}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{order.time}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {order.payment}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
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
                            action="edit"
                            onClick={() => toast.info('Edit Order', `Editing ${order.id}...`)}
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
                      <td colSpan="7" className="px-6 py-10 text-center text-slate-400 text-xs">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Reusable Footer */}
        <Footer />
      </div>
    </div>

      {/* MODAL 1: Add New Product Form */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add New Supermarket Product"
        size="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <FormRow cols={2}>
            <InputField
              label="Product Name"
              required
              placeholder="e.g. Fresh Red Apples (1kg)"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <InputField
              label="SKU / Barcode"
              placeholder="e.g. BZ-FRU-091"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
          </FormRow>

          <FormRow cols={2}>
            <InputField
              label="Price ($)"
              type="number"
              required
              placeholder="0.00"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <InputField
              label="Initial Stock Qty"
              type="number"
              placeholder="50"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </FormRow>

          <ImageUploadFrame
            label="Product Image"
            aspectRatio="video"
            value={newProduct.image}
            onChange={(img) => setNewProduct({ ...newProduct, image: img })}
          />

          <FormActions align="right">
            <Button
              type="button"
              variant="cancel"
              onClick={() => setIsAddProductOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Product
            </Button>
          </FormActions>
        </form>
      </Modal>

      {/* MODAL 2: View Order Details */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details - ${selectedOrder.id}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Customer:</span>
                <span>{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Email:</span>
                <span>{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Items:</span>
                <span>{selectedOrder.items}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span>{selectedOrder.payment}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Order Time:</span>
                <span>{selectedOrder.time}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-base text-[#064C23]">
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

      {/* MODAL 3: Delete Confirmation */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, orderId: null })}
        onConfirm={() => handleDeleteOrder(deleteModal.orderId)}
        type="danger"
        title="Delete Order Record"
        description={`Are you sure you want to delete ${deleteModal.orderId}? This cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
