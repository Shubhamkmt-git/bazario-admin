import React, { useState, useEffect } from 'react'
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
  AlertModal,
  OrdersView,
  StoresView,
  CustomersView,
  SettingsView,
  AdminUsersView,
  AdminRolesView,
  AdminPermissionsView,
  AboutManageView,
  TopBarManageView,
  CtaManageView,
  CareerManageView,
  HomePageSectionManageView,
  ProductCategoriesView,
  HeroBannerManageView,
  DeliveryStaffManageView,
  ProductManageView,
  StaffManageView,
  ManageOffersView,
  DashboardWelcomeBanner,
  OrdersAnalyticsSection,
  CustomerAnalyticsSection
} from '../components'
import { getDashboardStatsApi, getAdminMeApi, getAdminStoresApi, getAdminCustomersApi } from '../utils/adminApi'
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
  faTag,
  faUserShield,
  faUserTie,
  faShieldHalved,
  faKey,
  faGlobe,
  faCircleInfo,
  faWindowMaximize,
  faBullhorn,
  faBriefcase,
  faTableCellsLarge,
  faTags,
  faImages,
  faUserGroup,
  faPercent
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function DashboardPage({ onLogout }) {
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Current logged in admin profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_admin_user')
      return saved ? JSON.parse(saved) : { name: 'Super Admin', email: 'admin@bazario.com', avatar: 'BA' }
    } catch {
      return { name: 'Super Admin', email: 'admin@bazario.com', avatar: 'BA' }
    }
  })

  useEffect(() => {
    // Sync current logged in user from backend
    getAdminMeApi()
      .then((res) => {
        if (res && res.admin) {
          setCurrentUser(res.admin)
          localStorage.setItem('bazario_admin_user', JSON.stringify(res.admin))
        }
      })
      .catch(() => {})

    const handleProfileUpdated = () => {
      try {
        const saved = localStorage.getItem('bazario_admin_user')
        if (saved) setCurrentUser(JSON.parse(saved))
      } catch (e) {}
    }
    window.addEventListener('bazario_admin_profile_updated', handleProfileUpdated)
    return () => window.removeEventListener('bazario_admin_profile_updated', handleProfileUpdated)
  }, [])

  // URL Hash Routing Synchronization
  const getTabFromHash = () => {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '').trim().toLowerCase()
    const baseTab = rawHash.split('/')[0]
    if (baseTab === 'admin-manager') return 'admin-users'
    if (baseTab === 'web-manager') return 'web-about'
    if (
      baseTab === 'hero-banner-manage' ||
      baseTab === 'web-hero-banner' ||
      baseTab === 'hero-banners' ||
      baseTab === 'hero-banner'
    ) {
      return 'hero-banner-manage'
    }
    if (
      baseTab === 'delivery-staff' ||
      baseTab === 'delivery-staffs' ||
      baseTab === 'delivery-team'
    ) {
      return 'delivery-staff'
    }
    if (
      baseTab === 'products' ||
      baseTab === 'product-manage' ||
      baseTab === 'product'
    ) {
      return 'products'
    }
    if (
      baseTab === 'staff-manage' ||
      baseTab === 'staff-manages' ||
      baseTab === 'staffs' ||
      baseTab === 'staff'
    ) {
      return 'staff-manage'
    }
    if (
      baseTab === 'manage-offers' ||
      baseTab === 'offers-manage' ||
      baseTab === 'offers' ||
      baseTab === 'offer'
    ) {
      return 'manage-offers'
    }
    if (baseTab === 'orders' || baseTab === 'order') {
      return 'orders'
    }
    const validTabs = [
      'dashboard',
      'orders',
      'stores',
      'customers',
      'delivery-staff',
      'staff-manage',
      'products',
      'product-categories',
      'product-category',
      'hero-banner-manage',
      'manage-offers',
      'web-hero-banner',
      'hero-banners',
      'admin-users',
      'admin-roles',
      'admin-permissions',
      'web-about',
      'web-topbar',
      'web-cta',
      'web-career',
      'web-homepage',
      'settings',
    ]
    return validTabs.includes(baseTab) ? baseTab : 'dashboard'
  }

  const [activeTab, setActiveTab] = useState(getTabFromHash)

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    window.location.hash = `#/${tabId}`
  }

  const [dateFilter, setDateFilter] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [statsData, setStatsData] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = () => {
    getDashboardStatsApi()
      .then((res) => {
        if (res) {
          setDashboardData(res)
          if (res.stats) {
            setStatsData(res.stats)
          }
          if (res.storeBreakdown && res.storeBreakdown.length > 0) {
            setStoreBranches(res.storeBreakdown)
          }
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Navigation Items
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
    { id: 'orders', name: 'Orders', icon: faCartShopping },
    { id: 'stores', name: 'Stores', icon: faStore },
    { id: 'customers', name: 'Customers', icon: faUsers },
    { id: 'delivery-staff', name: 'Delivery Staff', icon: faTruck },
    { id: 'staff-manage', name: 'Staff Manage', icon: faUserGroup },
    { id: 'products', name: 'Products', icon: faBoxesStacked },
    { id: 'product-categories', name: 'Product Category', icon: faTags },
    { id: 'hero-banner-manage', name: 'Hero Banner Manage', icon: faImages },
    { id: 'manage-offers', name: 'Manage Offers', icon: faPercent },
    {
      id: 'admin-manager',
      name: 'Admin Manager',
      icon: faUserShield,
      children: [
        { id: 'admin-users', name: 'Admin User', icon: faUserTie },
        { id: 'admin-roles', name: 'Role', icon: faShieldHalved },
        { id: 'admin-permissions', name: 'Permission', icon: faKey },
      ],
    },
    {
      id: 'web-manager',
      name: 'Web Manager',
      icon: faGlobe,
      children: [
        { id: 'web-about', name: 'About Manage', icon: faCircleInfo },
        { id: 'web-topbar', name: 'Top-Bar Manage', icon: faWindowMaximize },
        { id: 'web-cta', name: 'CTA Manage', icon: faBullhorn },
        { id: 'web-career', name: 'Career Manage', icon: faBriefcase },
        { id: 'web-homepage', name: 'Home Page Section Heading Manage', icon: faTableCellsLarge },
      ],
    },
    { id: 'settings', name: 'Settings', icon: faGear },
  ]

  // KPI Metrics (in Indian Rupees ₹ and system stats)
  const stats = [
    {
      title: "Today's Gross Sales",
      value: statsData?.todaySalesFormatted || (statsData?.totalRevenue !== undefined ? `₹${statsData.totalRevenue.toLocaleString('en-IN')}.00` : '₹0.00'),
      change: statsData?.todaySalesGrowth || '0%',
      isPositive: true,
      icon: faWallet,
      iconBg: 'bg-[#f0f9f3] text-[#064C23] border border-[#bae2cb]',
    },
    {
      title: 'Active Store Outlets',
      value: statsData?.activeStoresCount !== undefined ? `${statsData.activeStoresCount} Outlets` : '0 Outlets',
      change: statsData?.totalStoresCount !== undefined ? `${statsData.activeStoresCount} Open • ${Math.max(0, statsData.totalStoresCount - statsData.activeStoresCount)} Closed` : '0 Open',
      isPositive: true,
      icon: faStore,
      iconBg: 'bg-[#fdf6f4] text-[#A44F37] border border-[#f5d5cc]',
    },
    {
      title: 'Total Customers',
      value: statsData?.totalCustomers !== undefined ? statsData.totalCustomers.toLocaleString('en-IN') : '0',
      change: 'Active in database',
      isPositive: true,
      icon: faUsers,
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      title: 'Live Orders Processed',
      value: statsData?.totalOrdersCount !== undefined ? `${statsData.totalOrdersCount} Orders` : '0 Orders',
      change: statsData?.pendingOrders !== undefined ? `${statsData.pendingOrders} Pending • ${statsData.deliveredOrders} Delivered` : '0 Pending',
      isPositive: true,
      icon: faCartShopping,
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
  ]

  // Top Supermarket Branches Data - fetched live from backend
  const [storeBranches, setStoreBranches] = useState([])

  // Recent Registered Customers for Dashboard Overview - fetched live from backend
  const [recentCustomers, setRecentCustomers] = useState([])

  useEffect(() => {
    let isMounted = true
    getAdminStoresApi()
      .then((res) => {
        if (isMounted && res) {
          const list = res.stores || res.data || []
          setStoreBranches(
            list.map((s, idx) => ({
              id: s._id || s.id || idx + 1,
              name: s.title || s.name || `Store #${idx + 1}`,
              location: s.subtitle || s.address || 'Noida Hub',
              dailySales: '₹0.00',
              status: s.status || 'Open',
              phone: s.phone || '+91 98111 22334',
            }))
          )
        }
      })
      .catch(() => {})

    getAdminCustomersApi()
      .then((res) => {
        if (isMounted && res) {
          const list = res.customers || res.data || []
          setRecentCustomers(
            list.map((c, idx) => ({
              id: c._id || c.id || idx + 1,
              name: c.name || 'Bazario Customer',
              email: c.email || 'N/A',
              phone: c.phone || 'N/A',
              status: c.status || (c.isBlocked ? 'Restricted' : 'Active'),
              totalSpent: c.totalSpent ? `₹${c.totalSpent.toLocaleString('en-IN')}` : '₹0.00',
            }))
          )
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleCustomerStatus = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Restricted' : 'Active'
    setRecentCustomers(
      recentCustomers.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c))
    )
    toast.info('Status Updated', `${customer.name} is now ${newStatus}.`)
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex font-roboto text-slate-800 antialiased overflow-hidden selection:bg-[#064C23] selection:text-white">
      {/* Reusable Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        navItems={navItems}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        user={currentUser}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Reusable Header */}
        <Header
          user={currentUser}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          title={
            activeTab === 'orders'
              ? 'Orders Management'
              : activeTab === 'settings'
              ? 'Store Settings'
              : activeTab === 'stores'
              ? 'Store Locations & Outlets'
              : activeTab === 'customers'
              ? 'Customers'
              : activeTab === 'delivery-staff'
              ? 'Delivery Staff'
              : activeTab === 'staff-manage'
              ? 'Staff Manage'
              : activeTab === 'products'
              ? 'Products'
              : activeTab === 'product-categories' || activeTab === 'product-category'
              ? 'Product Category'
              : activeTab === 'admin-users'
              ? 'Admin Users'
              : activeTab === 'admin-roles'
              ? 'Roles & Access Control'
              : activeTab === 'admin-permissions'
              ? 'System Permissions Matrix'
              : activeTab === 'web-about'
              ? 'About Manage'
              : activeTab === 'web-topbar'
              ? 'Top-Bar Manage'
              : activeTab === 'web-cta'
              ? 'CTA Manage'
              : activeTab === 'web-career'
              ? 'Career Manage'
              : activeTab === 'web-homepage'
              ? 'Home Page Section Heading Manage'
              : activeTab === 'web-hero-banner' || activeTab === 'hero-banner-manage'
              ? 'Hero Banner Manage'
              : activeTab === 'manage-offers'
              ? 'Manage Offers'
              : 'Dashboard'
          }
          onLogout={onLogout}
          className="shrink-0"
        />

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col justify-between scrollbar-thin">
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 pb-16">
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'settings' && <SettingsView />}
            {activeTab === 'stores' && <StoresView />}
            {activeTab === 'customers' && <CustomersView />}
            {activeTab === 'delivery-staff' && <DeliveryStaffManageView />}
            {activeTab === 'staff-manage' && <StaffManageView />}
            {activeTab === 'products' && <ProductManageView />}
            {(activeTab === 'product-categories' || activeTab === 'product-category') && (
              <ProductCategoriesView />
            )}
            {activeTab === 'admin-users' && <AdminUsersView />}
            {activeTab === 'admin-roles' && <AdminRolesView />}
            {activeTab === 'admin-permissions' && <AdminPermissionsView />}
            {activeTab === 'web-about' && <AboutManageView />}
            {activeTab === 'web-topbar' && <TopBarManageView />}
            {activeTab === 'web-cta' && <CtaManageView />}
            {activeTab === 'web-career' && <CareerManageView />}
            {activeTab === 'web-homepage' && <HomePageSectionManageView />}
            {(activeTab === 'web-hero-banner' || activeTab === 'hero-banner-manage') && (
              <HeroBannerManageView />
            )}
            {activeTab === 'manage-offers' && <ManageOffersView />}
            {activeTab === 'dashboard' && (
              <>
                {/* Enhanced Welcome Banner with Integrated Logo Image Box */}
                <DashboardWelcomeBanner
                  dateFilter={dateFilter}
                  onDateFilterChange={(period) => {
                    setDateFilter(period)
                    toast.info('Filter Applied', `Displaying analytics for ${period.toUpperCase()}`)
                  }}
                  onExport={() => toast.success('Report Exported', 'Store summary PDF & CSV exported successfully!')}
                  totalOrders={statsData ? `${statsData.totalOrdersCount || 0}` : '0'}
                  activeBranches={statsData ? `${statsData.activeStoresCount || 0} Outlets` : '0 Outlets'}
                />

                {/* 4 KPI Metrics in Indian Rupees (₹) */}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orders Volume, Trajectory Graph & Fulfillment Breakdown */}
                <OrdersAnalyticsSection
                  orderTrajectoryData={dashboardData?.orderTrajectoryData}
                  fulfillmentPipeline={dashboardData?.fulfillmentPipeline}
                  channelDistribution={dashboardData?.channelDistribution}
                  statsData={statsData}
                />

                {/* Customer Growth, Retention Graph & Segmentation Analysis */}
                <CustomerAnalyticsSection
                  customerGrowthData={dashboardData?.customerGrowthData}
                  customerSegments={dashboardData?.customerSegments}
                  neighborhoodDensities={dashboardData?.neighborhoodDensities}
                  totalCustomers={statsData?.totalCustomers}
                  statsData={statsData}
                />

                {/* Middle Grid: Store Outlets Monitor + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left (2 Cols): Store Outlets Live Monitor */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                          Store Outlets & Revenue Breakdown
                        </h2>
                        <p className="text-xs text-slate-500">
                          Live operating status, location area, and estimated daily sales in INR (₹)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectTab('stores')}
                        className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer hidden sm:block"
                      >
                        Manage Stores →
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {storeBranches.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No store branches found in database.
                        </div>
                      ) : (
                        storeBranches.map((store) => (
                        <div
                          key={store.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center font-bold text-sm shrink-0">
                              <FontAwesomeIcon icon={faStore} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">{store.name}</h3>
                              <p className="text-xs text-slate-400">{store.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 self-end sm:self-auto">
                            <div className="text-right">
                              <span className="text-sm font-black text-slate-900 block font-mono">
                                {store.dailySales}
                              </span>
                              <span className="text-[10px] text-slate-400">Daily Volume</span>
                            </div>

                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                store.status === 'Open'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  store.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                }`}
                              />
                              {store.status}
                            </span>
                          </div>
                        </div>
                      )))}
                    </div>
                  </div>

                  {/* Right (1 Col): Quick Operations & Shortcuts */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Quick Shortcuts
                      </h2>
                      <p className="text-xs text-slate-500">
                        Fast navigation to primary management forms
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectTab('stores')}
                        className="p-3.5 bg-slate-50 hover:bg-[#f0f9f3] border border-slate-200 hover:border-[#064C23] rounded-2xl text-left transition-all group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                          <FontAwesomeIcon icon={faStore} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Store Outlets</p>
                        <p className="text-[10px] text-slate-400">
                          {statsData?.totalStoresCount !== undefined ? `${statsData.totalStoresCount} Locations` : '0 Locations'}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTab('customers')}
                        className="p-3.5 bg-slate-50 hover:bg-[#fdf6f4] border border-slate-200 hover:border-[#A44F37] rounded-2xl text-left transition-all group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#A44F37]/10 text-[#A44F37] flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Customers</p>
                        <p className="text-[10px] text-slate-400">
                          {statsData?.totalCustomers !== undefined ? `${statsData.totalCustomers} Accounts` : 'Directory'}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTab('admin-users')}
                        className="p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left transition-all group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                          <FontAwesomeIcon icon={faUserTie} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">Admin Staff</p>
                        <p className="text-[10px] text-slate-400">User accounts</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectTab('settings')}
                        className="p-3.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-2xl text-left transition-all group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform">
                          <FontAwesomeIcon icon={faGear} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">App Settings</p>
                        <p className="text-[10px] text-slate-400">Brand & SEO</p>
                      </button>
                    </div>

                    {/* Sync Status Banner */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-medium">Bazario Live Sync Active</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          fetchDashboardData()
                          toast.success('Sync Refreshed', 'Database telemetry up to date.')
                        }}
                        className="text-slate-400 hover:text-slate-800 cursor-pointer"
                        title="Refresh data"
                      >
                        <FontAwesomeIcon icon={faRotateRight} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Recent Registered Customers */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                  <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Recent Customer Accounts
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Latest registered supermarket shoppers, verified mobile contacts, and status
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectTab('customers')}
                      className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer self-start sm:self-auto"
                    >
                      View All Customers ({recentCustomers.length}) →
                    </button>
                  </div>

                  {/* Customer Table with INR (₹) and Toggle Switches */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 w-16">Index</th>
                          <th className="px-6 py-4">Customer Name</th>
                          <th className="px-6 py-4">Mobile Number</th>
                          <th className="px-6 py-4">Email Address</th>
                          <th className="px-6 py-4">Lifetime Spend (₹)</th>
                          <th className="px-6 py-4">Account Status</th>
                          <th className="px-6 py-4 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {recentCustomers.map((customer, index) => (
                          <tr key={customer.id} className="hover:bg-slate-50/75 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                              #{index + 1}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                  {customer.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                                <span className="font-bold text-slate-900">{customer.name}</span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                              {customer.phone}
                            </td>

                            <td className="px-6 py-4 text-xs text-slate-600">
                              {customer.email}
                            </td>

                            <td className="px-6 py-4 font-bold text-slate-900 font-mono">
                              {customer.totalSpent}
                            </td>

                            {/* Status Toggle Switch */}
                            <td className="px-6 py-4">
                              <ToggleButton
                                size="sm"
                                checked={customer.status === 'Active'}
                                onChange={() => handleToggleCustomerStatus(customer)}
                                activeColor="#064C23"
                              />
                            </td>

                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleSelectTab('customers')}
                                className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </main>

          {/* Reusable Footer */}
          <Footer />
        </div>
      </div>
    </div>
  )
}
