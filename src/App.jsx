import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSpinner, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import BazarioLogo from './components/BazarioLogo'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const VALID_EMAIL = 'admin@bazario.com'
  const VALID_PASSWORD = 'BazarioStore@2026'

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (email.trim().toLowerCase() === VALID_EMAIL.toLowerCase() && password === VALID_PASSWORD) {
        setLoginSuccess(true)
        setErrorMessage('')
      } else {
        setErrorMessage('Invalid credentials. Please check your email and password.')
      }
    }, 800)
  }

  const handleReset = () => {
    setLoginSuccess(false)
    setEmail('')
    setPassword('')
    setErrorMessage('')
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-roboto overflow-hidden bg-slate-900 select-none">
      {/* Supermarket Fullscreen Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/supermart-bg.jpg')`,
        }}
      />

      {/* Dark Mood Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      {/* Main Content Grid: Left Logo + Right Login Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

        {/* Left Side: Exact Bazario Logo */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
          <div className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px]">
            <BazarioLogo sticker={true} />
          </div>
        </div>

        {/* Right Side: Admin Login Card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[430px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#064C23] tracking-tight leading-tight">
                Admin Login
              </h1>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2.5 animate-shake">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-sm shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {loginSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-[#f0f9f3] text-[#064C23] rounded-full flex items-center justify-center mx-auto text-2xl border border-[#bae2cb]">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <h2 className="text-2xl font-bold text-[#111827]">Welcome back, Admin!</h2>
                <p className="text-sm text-slate-500">Authenticated as {VALID_EMAIL}</p>
                <div className="pt-2">
                  <span className="inline-block text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                    Redirecting to Dashboard...
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                  >
                    EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-2"
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMessage) setErrorMessage('')
                      }}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-12 py-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#4B5563] transition-colors focus:outline-none cursor-pointer"
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
                    className="w-full bg-[#064C23] hover:bg-[#9D3E22] active:bg-[#043b1b] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors duration-150 shadow-md flex items-center justify-center space-x-2 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
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
