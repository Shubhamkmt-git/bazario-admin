import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSliders,
  faImage,
  faAddressBook,
  faGlobe,
  faPhone,
  faEnvelope,
  faHeadset,
  faFloppyDisk,
  faRotateLeft,
  faMagnifyingGlass,
  faEye,
  faCheck,
  faArrowUpRightFromSquare,
  faCircleCheck,
  faHashtag,
  faShareNodes,
  faStore
} from '@fortawesome/free-solid-svg-icons'
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
  faXTwitter,
  faYoutube,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import InputField from '../ui/InputField'
import ToggleButton from '../ui/ToggleButton'

const STORAGE_KEY = 'bazario_app_settings'

const DEFAULT_SETTINGS = {
  // Branding
  appName: 'Bazario',
  appTagline: 'Bill Halka, Dil Halka - Fresh Supermarket & Groceries',
  logoDark: '/logo.png',
  logoLight: '/logo.png',
  favicon: '/logo.png',

  // Contact & Support
  contactNumber: '+91 98765 43210',
  supportHelpline: '1800-200-8899',
  whatsappNumber: '+91 98765 43210',
  supportEmail: 'support@bazario.com',
  businessAddress: 'Plot #42, Central Retail Hub, Sector 18, Commercial Zone',
  operatingHours: 'Mon - Sun: 7:00 AM - 11:00 PM',

  // Social Links
  instagramUrl: 'https://instagram.com/bazariostore',
  facebookUrl: 'https://facebook.com/bazario.official',
  twitterUrl: 'https://x.com/bazario_india',
  youtubeUrl: 'https://youtube.com/@bazario_live',
  linkedinUrl: 'https://linkedin.com/company/bazario-retail',

  // Web & App SEO Data
  seoTitle: 'Bazario - Online Supermarket, Fresh Groceries & Daily Essentials',
  seoDescription:
    'Shop farm-fresh vegetables, dairy, bakery, beverages, and household essentials at lowest prices with 15-minute express delivery from Bazario.',
  seoKeywords: 'online grocery, fresh vegetables, supermarket, dairy, express delivery, bazario',
  canonicalUrl: 'https://bazario.com',
  ogTitle: 'Bazario - Big Savings on Everyday Grocery Essentials',
  ogDescription:
    'Order fresh vegetables, fruits, snacks & daily groceries from your neighborhood Bazario superstore.',
  ogImage: '/supermart-bg.jpg',
  robotsIndex: true,
  sitemapUrl: 'https://bazario.com/sitemap.xml',
}

export default function SettingsView() {
  const toast = useToast()
  const [activeSubTab, setActiveSubTab] = useState('branding')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load settings from storage', e)
    }
  }, [])

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (field, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File', 'Please upload a valid image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      handleChange(field, event.target.result)
      toast.success('Image Uploaded', `${field} preview updated instantly.`)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e) => {
    e?.preventDefault()
    setIsSaving(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setTimeout(() => {
        setIsSaving(false)
        toast.success('Settings Saved', 'App branding, contact info, and SEO data updated successfully!')
      }, 300)
    } catch (err) {
      setIsSaving(false)
      toast.error('Save Failed', 'Could not persist settings.')
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
    toast.info('Settings Reset', 'Restored default application parameters.')
  }

  const tabs = [
    { id: 'branding', name: 'App Branding & Logos', icon: faImage },
    { id: 'contact', name: 'Contact & Support Info', icon: faAddressBook },
    { id: 'seo', name: 'Web & App SEO Data', icon: faGlobe },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faSliders} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                System & Store Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your app identity, instant preview logos, customer support contacts, and SEO metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Global Save Actions */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            icon={<FontAwesomeIcon icon={faRotateLeft} className="text-xs" />}
          >
            Reset Defaults
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            loading={isSaving}
            onClick={handleSave}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/80 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#064C23] shadow-sm shadow-slate-300 border border-[#bfe0cd]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                className={isActive ? 'text-[#064C23]' : 'text-slate-400'}
              />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: App Branding & Instant Preview Frames */}
      {activeSubTab === 'branding' && (
        <div className="space-y-6">
          {/* General App Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Application Identity</h2>
              <p className="text-xs text-slate-500">Define the core brand name and slogan displayed across all platforms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Application Name"
                required
                placeholder="e.g. Bazario"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                helperText="App title shown on navbar, emails, invoices, and mobile apps"
              />

              <InputField
                label="App Slogan / Tagline"
                placeholder="e.g. Bill Halka, Dil Halka"
                value={settings.appTagline}
                onChange={(e) => handleChange('appTagline', e.target.value)}
                helperText="Brand tagline displayed on login and marketing headers"
              />
            </div>
          </div>

          {/* Instant Preview Frames Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Logo Black / Dark with Instant Preview Frame */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Logo (Dark / Black)</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Light Surface
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Used on white headers, invoice PDFs, printed receipts, and light themes.
                </p>

                {/* Instant Preview Frame */}
                <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 flex flex-col items-center justify-center min-h-[140px] shadow-2xs group">
                  <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Preview Frame
                  </div>
                  <img
                    src={settings.logoDark || '/logo.png'}
                    alt="Logo Dark Preview"
                    className="max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Upload Action */}
              <div>
                <label className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Upload Dark Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload('logoDark', e)}
                  />
                </label>
              </div>
            </div>

            {/* 2. Logo Light / White with Instant Preview Frame */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Logo (Light / White)</h3>
                  <span className="text-[10px] font-bold text-[#A44F37] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Dark Surface
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Used on dark forest green banners, mobile splash screens, and dark footer sections.
                </p>

                {/* Instant Dark Preview Frame */}
                <div className="relative rounded-2xl border border-[#064C23] bg-gradient-to-br from-[#042813] to-[#064C23] p-4 flex flex-col items-center justify-center min-h-[140px] shadow-md group">
                  <div className="absolute top-2 left-2 text-[10px] font-bold text-emerald-300/60 uppercase tracking-wider">
                    Dark Frame Preview
                  </div>
                  <img
                    src={settings.logoLight || '/logo.png'}
                    alt="Logo Light Preview"
                    className="max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Upload Action */}
              <div>
                <label className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Upload Light Logo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload('logoLight', e)}
                  />
                </label>
              </div>
            </div>

            {/* 3. Favicon with Browser Tab Simulator Instant Frame */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Browser Favicon</h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Tab Icon
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Displayed on browser tabs, bookmarks, and PWA mobile home shortcuts.
                </p>

                {/* Browser Tab Simulator Mockup */}
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 min-h-[140px] flex flex-col justify-center">
                  <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-2 flex items-center space-x-2.5">
                    <img
                      src={settings.favicon || '/logo.png'}
                      alt="Favicon"
                      className="w-4 h-4 rounded-sm object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {settings.appName} | Store Admin
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 bg-slate-100 rounded">
                      ✕
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center mt-2.5">
                    Simulated Browser Chrome Tab
                  </p>
                </div>
              </div>

              {/* Upload Action */}
              <div>
                <label className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-100 hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  Upload Favicon (32x32)
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload('favicon', e)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Contact Info & Support Section */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          {/* Main Support Channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Direct Customer Support Channels</h2>
              <p className="text-xs text-slate-500">
                Contact information published on the user mobile app, website footer, order invoices, and receipts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Primary Contact Number"
                required
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs" />}
                placeholder="+91 98765 43210"
                value={settings.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                helperText="Main store switchboard number"
              />

              <InputField
                label="Toll-Free Support Helpline"
                icon={<FontAwesomeIcon icon={faHeadset} className="text-xs" />}
                placeholder="1800-200-8899"
                value={settings.supportHelpline}
                onChange={(e) => handleChange('supportHelpline', e.target.value)}
                helperText="24x7 customer query resolution line"
              />

              <InputField
                label="WhatsApp Support Number / Chat"
                icon={<FontAwesomeIcon icon={faWhatsapp} className="text-xs text-emerald-600" />}
                placeholder="+91 98765 43210"
                value={settings.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                helperText="Direct WhatsApp order inquiry number"
              />

              <InputField
                label="Official Support Email"
                required
                type="email"
                icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs" />}
                placeholder="support@bazario.com"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                helperText="Receives order escalations and feedback"
              />

              <InputField
                label="Store Operating Hours"
                placeholder="Mon - Sun: 7:00 AM - 11:00 PM"
                value={settings.operatingHours}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                helperText="Displayed during checkout and store info"
              />

              <InputField
                label="Store Physical Address"
                placeholder="Plot #42, Central Retail Hub"
                value={settings.businessAddress}
                onChange={(e) => handleChange('businessAddress', e.target.value)}
                helperText="Registered business & dispatch warehouse location"
              />
            </div>
          </div>

          {/* Social Media Links Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Official Social Media Profiles</h2>
                <p className="text-xs text-slate-500">Link your active marketing and community channels.</p>
              </div>
              <span className="text-xs font-semibold text-[#064C23] bg-[#f0f9f3] px-3 py-1 rounded-xl border border-[#bae2cb]">
                5 Channels
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Instagram Profile"
                icon={<FontAwesomeIcon icon={faInstagram} className="text-pink-600" />}
                placeholder="https://instagram.com/bazariostore"
                value={settings.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
              />

              <InputField
                label="Facebook Page"
                icon={<FontAwesomeIcon icon={faFacebook} className="text-blue-600" />}
                placeholder="https://facebook.com/bazario.official"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
              />

              <InputField
                label="Twitter / X Profile"
                icon={<FontAwesomeIcon icon={faXTwitter} className="text-slate-900" />}
                placeholder="https://x.com/bazario_india"
                value={settings.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
              />

              <InputField
                label="YouTube Channel"
                icon={<FontAwesomeIcon icon={faYoutube} className="text-rose-600" />}
                placeholder="https://youtube.com/@bazario"
                value={settings.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              />

              <InputField
                label="LinkedIn Business Profile"
                icon={<FontAwesomeIcon icon={faLinkedin} className="text-sky-700" />}
                placeholder="https://linkedin.com/company/bazario"
                value={settings.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                className="md:col-span-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Web & App SEO Configuration & Google Preview Frame */}
      {activeSubTab === 'seo' && (
        <div className="space-y-6">
          {/* Live Google Search Result Instant Preview Frame */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Live Instant Google Search Preview
                </h3>
              </div>
              <span className="text-xs text-slate-400">SERP Snippet Simulator</span>
            </div>

            {/* Google Search Card Box */}
            <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-md space-y-1.5 max-w-3xl">
              {/* URL & Breadcrumb */}
              <div className="flex items-center space-x-2 text-xs text-slate-700">
                <img
                  src={settings.favicon || '/logo.png'}
                  alt="Favicon"
                  className="w-4 h-4 rounded-full object-contain bg-slate-100 p-0.5"
                />
                <span className="font-semibold text-slate-800">{settings.appName}</span>
                <span className="text-slate-400">›</span>
                <span className="text-slate-500">{settings.canonicalUrl || 'https://bazario.com'}</span>
              </div>

              {/* Blue Clickable Title */}
              <h4 className="text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                {settings.seoTitle || `${settings.appName} - Online Supermarket & Grocery Store`}
              </h4>

              {/* Snippet Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {settings.seoDescription ||
                  'Shop farm-fresh vegetables, dairy, bakery, beverages, and household essentials at lowest prices with 15-minute express delivery.'}
              </p>
            </div>
          </div>

          {/* SEO Input Form Fields */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Search Engine Optimization (SEO)</h2>
                <p className="text-xs text-slate-500">Configure global metadata for search indexers and social sharing bots.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meta Title (SEO Title Tag) <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-bold ${
                    settings.seoTitle.length > 60 ? 'text-amber-600' : 'text-[#064C23]'
                  }`}>
                    {settings.seoTitle.length} / 60 characters recommended
                  </span>
                </div>
                <input
                  type="text"
                  value={settings.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value)}
                  placeholder="e.g. Bazario - Online Supermarket & Fresh Grocery Store"
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meta Description <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-bold ${
                    settings.seoDescription.length > 160 ? 'text-amber-600' : 'text-[#064C23]'
                  }`}>
                    {settings.seoDescription.length} / 160 characters recommended
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={settings.seoDescription}
                  onChange={(e) => handleChange('seoDescription', e.target.value)}
                  placeholder="Write a compelling summary of Bazario grocery store for Google results..."
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Meta Keywords (Comma separated)"
                  icon={<FontAwesomeIcon icon={faHashtag} className="text-xs" />}
                  placeholder="online grocery, fresh vegetables, express delivery"
                  value={settings.seoKeywords}
                  onChange={(e) => handleChange('seoKeywords', e.target.value)}
                  helperText="Search tags for indexing catalog items"
                />

                <InputField
                  label="Canonical URL"
                  icon={<FontAwesomeIcon icon={faGlobe} className="text-xs" />}
                  placeholder="https://bazario.com"
                  value={settings.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                  helperText="Primary domain URL to prevent duplicate index penalties"
                />

                <InputField
                  label="Open Graph (OG) Social Title"
                  icon={<FontAwesomeIcon icon={faShareNodes} className="text-xs" />}
                  placeholder="Bazario - Big Savings on Everyday Groceries"
                  value={settings.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  helperText="Displayed when link is shared on WhatsApp, Facebook, iMessage"
                />

                <InputField
                  label="XML Sitemap URL"
                  icon={<FontAwesomeIcon icon={faGlobe} className="text-xs" />}
                  placeholder="https://bazario.com/sitemap.xml"
                  value={settings.sitemapUrl}
                  onChange={(e) => handleChange('sitemapUrl', e.target.value)}
                  helperText="Submitted automatically to Google Search Console"
                />
              </div>

              {/* Social Share OG Banner Preview Frame */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Social Media Share Banner (OG Image Preview Frame)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs">
                    <img
                      src={settings.ogImage || '/supermart-bg.jpg'}
                      alt="OG Share Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <p className="text-xs font-bold truncate">{settings.ogTitle || settings.appName}</p>
                      <p className="text-[10px] text-slate-300 truncate">{settings.canonicalUrl}</p>
                    </div>
                  </div>

                  <div>
                    <label className="w-full flex items-center justify-center px-4 py-3 bg-slate-100 hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all">
                      <FontAwesomeIcon icon={faImage} className="mr-2" />
                      Upload Social Banner (1200x630)
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileUpload('ogImage', e)}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Optimal size: 1200x630px. Used by WhatsApp, Twitter cards, and LinkedIn links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Robots Indexing Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Search Engine Indexing</h4>
                  <p className="text-xs text-slate-500">
                    Allow Google, Bing, and search crawlers to index this store application (`robots: index, follow`).
                  </p>
                </div>
                <ToggleButton
                  enabled={settings.robotsIndex}
                  onChange={(val) => handleChange('robotsIndex', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
          Settings ready to publish
        </span>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            loading={isSaving}
            onClick={handleSave}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
