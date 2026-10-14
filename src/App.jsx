import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faSpinner,
  faCircleExclamation,
  faStore,
  faShieldHalved,
  faArrowRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import BazarioLogo from './components/BazarioLogo'
import DashboardPage from './pages/DashboardPage'
import { ToastProvider, useToast } from './context/ToastContext'
import { adminLoginApi, storeManagerLoginApi } from './utils/adminApi'

// ============================================================================
// 1. SUPER ADMIN LOGIN PAGE (Route: #/login or /)
// ============================================================================
function AdminLoginPage({ onLoginSuccess }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please fill in both admin email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await adminLoginApi(email.trim(), password)
      toast.success('Admin Authenticated', `Welcome back, ${res.admin?.name || 'Super Admin'}!`)
      onLoginSuccess('Admin')
    } catch (err) {
      const msg = err.message || 'Invalid admin credentials. Please try again.'
      setErrorMessage(msg)
      toast.error('Admin Login Failed', msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickFill = () => {
    setEmail('admin@bazario.com')
    setPassword('admin123')
    setErrorMessage('')
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-roboto overflow-hidden bg-slate-900 select-none">
      {/* Supermarket Fullscreen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/supermart-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Exact Bazario Logo */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
          <div className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px]">
            <BazarioLogo sticker={true} />
          </div>
        </div>

        {/* Right Side: Super Admin Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300">
            {/* Top Pill Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/20">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[11px]" />
                Super Admin Console
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064C23] tracking-tight leading-tight">
                Admin Login
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Central Multi-Store Supermarket Administration & Governance
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2.5">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                >
                  ADMIN WORK EMAIL
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  placeholder="admin@bazario.com"
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    placeholder="Enter admin password"
                    className="w-full pl-4 pr-12 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#4B5563] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-base" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#064C23] hover:bg-[#9D3E22] active:bg-[#043b1b] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors duration-150 shadow-md flex items-center justify-center space-x-2 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Verifying Admin Credentials...</span>
                    </>
                  ) : (
                    <span>Sign In to Super Admin</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#064C23] transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill Super Admin demo
                </button>
              </div>
            </form>

            {/* Separate Route Navigation to Store Manager Login */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-2.5">
                Branch manager looking to update stock & orders?
              </p>
              <a
                href="#/store-login"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.hash = '#/store-login'
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#064C23] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer shadow-2xs"
              >
                <FontAwesomeIcon icon={faStore} className="text-xs" />
                <span>Go to Store Manager Login</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. STORE MANAGER LOGIN PAGE (Route: #/store-login)
// ============================================================================
function StoreManagerLoginPage({ onLoginSuccess }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please fill in both branch manager email and password.')
      return
    }

    setIsLoading(true)
    try {
      const res = await storeManagerLoginApi(email.trim(), password)
      toast.success(
        'Store Branch Connected',
        `Welcome, ${res.manager?.name || 'Manager'}! Store: ${res.store?.name || 'Branch Hub'}`
      )
      onLoginSuccess('Store Manager')
    } catch (err) {
      const msg = err.message || 'Invalid manager credentials. Please check with Super Admin.'
      setErrorMessage(msg)
      toast.error('Store Manager Login Failed', msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickFill = () => {
    setEmail('manager.noida@bazario.com')
    setPassword('manager123')
    setErrorMessage('')
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-roboto overflow-hidden bg-slate-900 select-none">
      {/* Supermarket Fullscreen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/supermart-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Exact Bazario Logo */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
          <div className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px]">
            <BazarioLogo sticker={true} />
          </div>
        </div>

        {/* Right Side: Store Manager Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px] bg-white rounded-[32px] p-8 sm:p-10 border-2 border-emerald-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300">
            {/* Top Pill Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/20">
                <FontAwesomeIcon icon={faStore} className="text-[11px] text-amber-600" />
                Store Branch Operations
              </span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064C23] tracking-tight leading-tight">
                Store Manager
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Branch Stock & Inventory Control, Live Orders & Local Dispatch
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2.5">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="manager-email"
                  className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                >
                  MANAGER WORK EMAIL
                </label>
                <input
                  id="manager-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  placeholder="manager.noida@bazario.com"
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="manager-password"
                  className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                >
                  BRANCH PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="manager-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    placeholder="Enter your store password"
                    className="w-full pl-4 pr-12 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#4B5563] transition-colors focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-base" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#064C23] hover:bg-[#9D3E22] active:bg-[#043b1b] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors duration-150 shadow-md flex items-center justify-center space-x-2 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                      <span>Authenticating Branch Session...</span>
                    </>
                  ) : (
                    <span>Sign In to Store Portal</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-semibold text-slate-400 hover:text-[#064C23] transition-colors cursor-pointer"
                >
                  ⚡ Auto-fill Noida Store Manager demo
                </button>
              </div>
            </form>

            {/* Separate Route Navigation to Super Admin Login */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center text-center">
              <p className="text-xs text-slate-500 mb-2.5">
                Central headquarters administrator or owner?
              </p>
              <a
                href="#/login"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.hash = '#/login'
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
                <span>Return to Super Admin Portal</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. MAIN APP ROUTER COMPONENT
// ============================================================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bazario_admin_auth') === 'true' && !!localStorage.getItem('bazario_admin_token')
  })

  // Detect route based on hash (#/store-login or #/login) or pathname (/store-login)
  const getInitialRoute = () => {
    const hash = (window.location.hash || '').toLowerCase()
    const path = (window.location.pathname || '').toLowerCase()
    if (
      hash.includes('store-login') ||
      hash.includes('manager-login') ||
      path.includes('store-login') ||
      path.includes('manager-login')
    ) {
      return 'store-login'
    }
    return 'admin-login'
  }

  const [route, setRoute] = useState(getInitialRoute)

  useEffect(() => {
    const checkRoute = () => {
      const hash = (window.location.hash || '').toLowerCase()
      const path = (window.location.pathname || '').toLowerCase()
      if (
        hash.includes('store-login') ||
        hash.includes('manager-login') ||
        path.includes('store-login') ||
        path.includes('manager-login')
      ) {
        setRoute('store-login')
      } else if (
        hash.includes('login') ||
        path.includes('login') ||
        hash === '' ||
        hash === '#/' ||
        hash === '#'
      ) {
        setRoute('admin-login')
      }
    }

    window.addEventListener('hashchange', checkRoute)
    window.addEventListener('popstate', checkRoute)
    return () => {
      window.removeEventListener('hashchange', checkRoute)
      window.removeEventListener('popstate', checkRoute)
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false)
    }
    window.addEventListener('bazario_admin_unauthorized', handleUnauthorized)
    return () => window.removeEventListener('bazario_admin_unauthorized', handleUnauthorized)
  }, [])

  const handleLoginSuccess = (role = 'Admin') => {
    localStorage.setItem('bazario_admin_auth', 'true')
    setIsAuthenticated(true)
    window.location.hash = '#/dashboard'
  }

  const handleLogout = () => {
    const userStr = localStorage.getItem('bazario_admin_user')
    let wasStoreManager = false
    try {
      if (userStr) {
        const u = JSON.parse(userStr)
        if (u.role === 'Store Manager') wasStoreManager = true
      }
    } catch (_) {}

    localStorage.removeItem('bazario_admin_auth')
    localStorage.removeItem('bazario_admin_token')
    localStorage.removeItem('bazario_admin_user')
    setIsAuthenticated(false)

    if (wasStoreManager) {
      window.location.hash = '#/store-login'
      setRoute('store-login')
    } else {
      window.location.hash = '#/login'
      setRoute('admin-login')
    }
  }

  return (
    <ToastProvider>
      {isAuthenticated ? (
        <DashboardPage onLogout={handleLogout} />
      ) : route === 'store-login' ? (
        <StoreManagerLoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </ToastProvider>
  )
}
