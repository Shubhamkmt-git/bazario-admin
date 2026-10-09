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
  faPlus,
  faCartShopping,
  faCircleCheck,
  faClock,
  faTrashCan,
  faPenToSquare,
  faShieldHalved,
  faBars,
  faXmark,
  faTags,
  faArrowRight
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
      color: 'from-primary-800 to-primary-950',
      bgLight: 'bg-primary-50 text-primary-900 border border-primary-200',
      accent: 'border-l-4 border-l-primary-900',
    },
    {
      title: 'Active Orders',
      value: '1,429',
      change: '+8.1%',
      isPositive: true,
      icon: faCartShopping,
      color: 'from-secondary-600 to-secondary-800',
      bgLight: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
      accent: 'border-l-4 border-l-secondary-700',
    },
    {
      title: 'New Customers',
      value: '842',
      change: '-2.4%',
      isPositive: false,
      icon: faUsers,
      color: 'from-slate-700 to-slate-900',
      bgLight: 'bg-slate-100 text-slate-700 border border-slate-200',
      accent: 'border-l-4 border-l-slate-700',
    },
    {
      title: 'Active Promotions',
      value: '28 Deals',
      change: '+12.5%',
      isPositive: true,
      icon: faTags,
      color: 'from-secondary-500 to-secondary-700',
      bgLight: 'bg-secondary-50 text-secondary-600 border border-secondary-200',
      accent: 'border-l-4 border-l-secondary-500',
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
    { name: 'Promotions', icon: faTags },
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
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#042813] text-slate-200 flex flex-col border-r border-[#03200f] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#063a1c]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 via-primary-900 to-secondary-700 flex items-center justify-center text-white shadow-lg shadow-black/20 border border-secondary-500/30">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-base text-secondary-200" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Bazario</span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold bg-secondary-700/30 text-secondary-300 rounded-md border border-secondary-600/40">
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
          <div className="text-[11px] font-semibold text-emerald-300/60 uppercase tracking-wider px-3 mb-2">
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
                    ? 'bg-secondary-700 text-white shadow-lg shadow-secondary-900/40 border border-secondary-500/30'
                    : 'text-emerald-100/80 hover:text-white hover:bg-primary-800/40'
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-4 h-4 ${isActive ? 'text-secondary-100' : 'text-emerald-300/70'}`}
                />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-[#063a1c] bg-[#031d0e]/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center text-white font-bold text-sm shadow-md border border-secondary-400/40">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-emerald-200/60 truncate">admin@bazario.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
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
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-slate-500 hover:text-primary-900 hover:bg-primary-50 rounded-xl transition-all">
              <FontAwesomeIcon icon={faBell} className="text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary-600 rounded-full ring-2 ring-white"></span>
            </button>

            <button className="flex items-center space-x-2 bg-primary-900 hover:bg-primary-950 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-primary-900/25 transition-all">
              <FontAwesomeIcon icon={faPlus} className="text-xs text-secondary-300" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary-950 via-primary-900 to-[#123820] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-primary-800">
            {/* Ambient Secondary Glow */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-secondary-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="px-2.5 py-1 text-xs font-semibold bg-secondary-700 text-white rounded-md shadow-xs">
                  Bazario v2.0
                </span>
                <span className="text-xs text-emerald-200/80">Primary: #064C23 | Secondary: #A44F37</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Welcome to Bazario Admin Dashboard 🚀
              </h1>
              <p className="text-emerald-100/90 mt-1.5 text-sm sm:text-base max-w-2xl">
                Real-time performance metrics and store management with custom brand palette styling, Roboto typography, and FontAwesome icons.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary-300" />
                Live Sync Active
              </button>
              <button className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-secondary-700 hover:bg-secondary-800 text-white shadow-md shadow-secondary-900/30 transition-all">
                <span>View Analytics</span>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 ${stat.accent}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgLight}`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-base" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-2 flex items-center text-xs font-semibold">
                    <span
                      className={`inline-flex items-center space-x-1 ${
                        stat.isPositive ? 'text-primary-800' : 'text-secondary-700'
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest customer transactions and payment states
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">
                  Export CSV
                </button>
                <button className="px-3.5 py-1.5 text-xs font-semibold text-primary-900 hover:text-primary-950 hover:bg-primary-50 rounded-lg transition-all">
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
                      <td className="px-6 py-4 font-semibold text-primary-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{order.customer}</div>
                        <div className="text-xs text-slate-400">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate text-slate-700">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Completed'
                              ? 'bg-primary-50 text-primary-900 border border-primary-200'
                              : order.status === 'Processing'
                              ? 'bg-secondary-50 text-secondary-800 border border-secondary-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {order.status === 'Completed' && (
                            <FontAwesomeIcon icon={faCircleCheck} className="mr-1 text-[11px] text-primary-700" />
                          )}
                          {order.status === 'Processing' && (
                            <FontAwesomeIcon icon={faClock} className="mr-1 text-[11px] text-secondary-700" />
                          )}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button className="text-slate-400 hover:text-primary-900 p-1">
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button className="text-slate-400 hover:text-secondary-700 p-1">
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
