import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faShoppingBag,
  faUsers,
  faBoxesStacked,
  faGear,
  faBell,
  faMagnifyingGlass,
  faArrowTrendUp,
  faArrowTrendDown,
  faEllipsisVertical,
  faPlus,
  faCartShopping,
  faCircleCheck,
  faClock,
  faTrashCan,
  faPenToSquare,
  faShieldHalved,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import {
  faCreditCard
} from '@fortawesome/free-regular-svg-icons'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')

  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,592.00',
      change: '+14.2%',
      isPositive: true,
      icon: faShoppingBag,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Active Orders',
      value: '1,429',
      change: '+8.1%',
      isPositive: true,
      icon: faCartShopping,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'New Customers',
      value: '842',
      change: '-2.4%',
      isPositive: false,
      icon: faUsers,
      color: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Inventory Items',
      value: '6,230',
      change: '+4.5%',
      isPositive: true,
      icon: faBoxesStacked,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600',
    },
  ]

  const recentOrders = [
    {
      id: '#ORD-8821',
      customer: 'Alex Johnson',
      email: 'alex.j@example.com',
      product: 'Wireless Noise-Canceling Headphones',
      date: 'Oct 9, 2026',
      amount: '$299.00',
      status: 'Completed',
    },
    {
      id: '#ORD-8820',
      customer: 'Sarah Connor',
      email: 's.connor@cyber.org',
      product: 'Ultra Gaming Monitor 4K 144Hz',
      date: 'Oct 9, 2026',
      amount: '$649.99',
      status: 'Processing',
    },
    {
      id: '#ORD-8819',
      customer: 'Michael Scott',
      email: 'm.scott@dunder.com',
      product: 'Ergonomic Office Chair Pro',
      date: 'Oct 8, 2026',
      amount: '$349.50',
      status: 'Completed',
    },
    {
      id: '#ORD-8818',
      customer: 'Emma Watson',
      email: 'emma.w@cinema.co.uk',
      product: 'Mechanical Keyboard RGB',
      date: 'Oct 8, 2026',
      amount: '$149.00',
      status: 'Pending',
    },
    {
      id: '#ORD-8817',
      customer: 'David Miller',
      email: 'david.m@techhub.io',
      product: 'Smart Fitness Tracker v3',
      date: 'Oct 7, 2026',
      amount: '$89.99',
      status: 'Completed',
    },
  ]

  const navItems = [
    { name: 'Dashboard', icon: faChartLine },
    { name: 'Orders', icon: faCartShopping },
    { name: 'Products', icon: faBoxesStacked },
    { name: 'Customers', icon: faUsers },
    { name: 'Payments', icon: faCreditCard },
    { name: 'Security', icon: faShieldHalved },
    { name: 'Settings', icon: faGear },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex font-roboto text-slate-800 antialiased">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-base" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Bazario</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30">
                ADMIN
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.name
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@bazario.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </button>

            {/* Search Bar */}
            <div className="relative w-64 md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                type="text"
                placeholder="Search orders, products, users..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <FontAwesomeIcon icon={faBell} className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-indigo-500/20 transition-all">
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome to Bazario Admin Dashboard 🚀
              </h1>
              <p className="text-indigo-200 mt-1.5 text-sm sm:text-base">
                Here is your store summary for today. Everything is configured with React, Tailwind CSS, FontAwesome, and Roboto font.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <FontAwesomeIcon icon={faClock} className="mr-1.5 text-indigo-300" />
                Live Sync Active
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgLight}`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-base" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-800 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-2 flex items-center text-xs font-semibold">
                    <span
                      className={`inline-flex items-center space-x-1 ${
                        stat.isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={stat.isPositive ? faArrowTrendUp : faArrowTrendDown}
                        className="mr-1"
                      />
                      {stat.change}
                    </span>
                    <span className="text-slate-400 ml-2 font-normal">vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest transactions made across your store
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                  Export CSV
                </button>
                <button className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all">
                  View All Orders
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-indigo-600">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{order.customer}</div>
                        <div className="text-xs text-slate-400">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate text-slate-700">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Processing'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.status === 'Completed' && (
                            <FontAwesomeIcon icon={faCircleCheck} className="mr-1 text-[11px]" />
                          )}
                          {order.status === 'Processing' && (
                            <FontAwesomeIcon icon={faClock} className="mr-1 text-[11px]" />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button className="text-slate-400 hover:text-indigo-600 p-1">
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button className="text-slate-400 hover:text-rose-600 p-1">
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
