import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSpinner, faCircleCheck, faLock } from '@fortawesome/free-solid-svg-icons'
import BazarioLogo from './components/BazarioLogo'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLoginSuccess(true)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-roboto overflow-hidden">
      {/* Supermarket Fullscreen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/supermart-bg.jpg')`,
        }}
      />

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />

      {/* Main Container: Left Logo + Right Login Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Brand Logo */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-center lg:text-left">
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl transition-transform duration-300 hover:scale-[1.02]">
            <BazarioLogo sticker={true} />
          </div>
        </div>

        {/* Right Side: Admin / Store Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-white/20 transition-all duration-300">
            
            {/* Card Title */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Store Login
              </h2>
            </div>

            {loginSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 bg-primary-50 text-primary-900 rounded-full flex items-center justify-center mx-auto text-2xl border border-primary-200">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Login Successful!</h3>
                <p className="text-sm text-slate-500">Redirecting to Bazario Dashboard...</p>
                <button
                  onClick={() => setLoginSuccess(false)}
                  className="mt-4 text-xs font-semibold text-secondary-700 hover:text-secondary-800 underline"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 focus:bg-white transition-all"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-base"
                      />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-900 hover:bg-primary-950 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-primary-900/25 active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
