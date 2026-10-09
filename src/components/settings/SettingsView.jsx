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
  faStore,
  faShareNodes,
  faHashtag,
  faCircleCheck
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
  // 1. App Identity & Branding
  appName: 'Bazario',
  appTagline: 'Bill Halka, Dil Halka - Fresh Supermarket & Groceries',
  logoDark: '/logo.png',
  logoLight: '/logo.png',
  favicon: '/logo.png',

  // 2. Contact & Customer Support Info
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

  // 3. Web & App SEO Data
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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load settings', e)
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
        toast.success('Settings Saved', 'All store parameters and SEO configurations have been saved successfully!')
      }, 300)
    } catch (err) {
      setIsSaving(false)
      toast.error('Save Failed', 'Could not save settings.')
    }
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
    toast.info('Settings Reset', 'Restored default application parameters.')
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faSliders} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store & Application Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Complete configuration for app identity, branding logos, contact channels, and SEO metadata in one place.
            </p>
          </div>
        </div>

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
            Save All Settings
          </Button>
        </div>
      </div>

      {/* ONE UNIFIED MASTER SETTINGS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-200/80 overflow-hidden">
        
        {/* ================= SECTION 1: APP IDENTITY & BRANDING ================= */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">App Identity & Brand Logos</h2>
              <p className="text-xs text-slate-500">Configure core app titles and instant preview logo assets.</p>
            </div>
          </div>

          {/* App Name & Slogan Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Application Name"
              required
              placeholder="e.g. Bazario"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              helperText="Displayed across navigation, order emails, invoices, and mobile apps"
            />

            <InputField
              label="App Slogan / Tagline"
              placeholder="e.g. Bill Halka, Dil Halka"
              value={settings.appTagline}
              onChange={(e) => handleChange('appTagline', e.target.value)}
              helperText="Brand tagline displayed on login and marketing headers"
            />
          </div>

          {/* Instant Live Preview Frames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* 1. Logo Dark / Black */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Logo (Dark / Black)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Light Surface
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Used on white headers, invoice PDFs, receipts, and light themes.
                </p>

                {/* Instant Preview Frame */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-center min-h-[110px] shadow-2xs group">
                  <img
                    src={settings.logoDark || '/logo.png'}
                    alt="Logo Dark Preview"
                    className="max-h-10 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              </div>

              <label className="w-full flex items-center justify-center px-4 py-2 bg-white hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-xs" />
                Upload Dark Logo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileUpload('logoDark', e)}
                />
              </label>
            </div>

            {/* 2. Logo Light / White */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Logo (Light / White)
                  </h3>
                  <span className="text-[10px] font-bold text-[#A44F37] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Dark Surface
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Used on dark forest green banners, mobile splash screens, and dark footers.
                </p>

                {/* Instant Dark Preview Frame */}
                <div className="rounded-xl border border-[#064C23] bg-gradient-to-br from-[#042813] to-[#064C23] p-4 flex flex-col items-center justify-center min-h-[110px] shadow-sm group">
                  <img
                    src={settings.logoLight || '/logo.png'}
                    alt="Logo Light Preview"
                    className="max-h-10 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </div>
              </div>

              <label className="w-full flex items-center justify-center px-4 py-2 bg-white hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-xs" />
                Upload Light Logo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileUpload('logoLight', e)}
                />
              </label>
            </div>

            {/* 3. Browser Favicon Tab Simulator */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Browser Favicon
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    Tab Icon
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Displayed on browser tabs, bookmarks, and PWA home shortcuts.
                </p>

                {/* Instant Tab Mockup */}
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 min-h-[110px] flex flex-col justify-center">
                  <div className="bg-white rounded-lg shadow-2xs border border-slate-200 p-2 flex items-center space-x-2">
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
                    <span className="text-[10px] text-slate-400 font-bold px-1 py-0.5 bg-slate-100 rounded">
                      ✕
                    </span>
                  </div>
                </div>
              </div>

              <label className="w-full flex items-center justify-center px-4 py-2 bg-white hover:bg-[#f0f9f3] text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs">
                <FontAwesomeIcon icon={faImage} className="mr-2 text-xs" />
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

        {/* ================= SECTION 2: CONTACT INFO & SUPPORT CHANNELS ================= */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Contact & Customer Support Channels</h2>
              <p className="text-xs text-slate-500">
                Official contact details and hotline numbers published across apps and order receipts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              label="Primary Contact Number"
              required
              icon={<FontAwesomeIcon icon={faPhone} className="text-xs" />}
              placeholder="+91 98765 43210"
              value={settings.contactNumber}
              onChange={(e) => handleChange('contactNumber', e.target.value)}
              helperText="Main store helpline switchboard"
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
              helperText="Direct WhatsApp order inquiry chat"
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
              helperText="Registered business & dispatch warehouse"
            />
          </div>

          {/* Social Profiles Grid */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              Official Social Media Profile Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputField
                label="Instagram"
                icon={<FontAwesomeIcon icon={faInstagram} className="text-pink-600" />}
                placeholder="https://instagram.com/bazariostore"
                value={settings.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
              />

              <InputField
                label="Facebook"
                icon={<FontAwesomeIcon icon={faFacebook} className="text-blue-600" />}
                placeholder="https://facebook.com/bazario.official"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
              />

              <InputField
                label="Twitter / X"
                icon={<FontAwesomeIcon icon={faXTwitter} className="text-slate-900" />}
                placeholder="https://x.com/bazario_india"
                value={settings.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
              />

              <InputField
                label="YouTube"
                icon={<FontAwesomeIcon icon={faYoutube} className="text-rose-600" />}
                placeholder="https://youtube.com/@bazario"
                value={settings.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              />

              <InputField
                label="LinkedIn"
                icon={<FontAwesomeIcon icon={faLinkedin} className="text-sky-700" />}
                placeholder="https://linkedin.com/company/bazario"
                value={settings.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: WEB & APP SEO METADATA ================= */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Web & App SEO Metadata</h2>
              <p className="text-xs text-slate-500">
                Configure global meta titles, keywords, canonical URLs, and indexing parameters.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Meta Title */}
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

            {/* Meta Description */}
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
                placeholder="Write a compelling summary of Bazario grocery store for search results..."
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] font-medium resize-none"
              />
            </div>

            {/* Secondary SEO Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Meta Keywords (Comma separated)"
                icon={<FontAwesomeIcon icon={faHashtag} className="text-xs" />}
                placeholder="online grocery, fresh vegetables, express delivery"
                value={settings.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                helperText="Keywords for indexing catalog products"
              />

              <InputField
                label="Canonical URL"
                icon={<FontAwesomeIcon icon={faGlobe} className="text-xs" />}
                placeholder="https://bazario.com"
                value={settings.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                helperText="Primary domain URL to avoid duplicate content penalties"
              />

              <InputField
                label="Open Graph (OG) Social Title"
                icon={<FontAwesomeIcon icon={faShareNodes} className="text-xs" />}
                placeholder="Bazario - Big Savings on Everyday Groceries"
                value={settings.ogTitle}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                helperText="Title displayed when shared on WhatsApp, Facebook, iMessage"
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
          </div>
        </div>

        {/* ================= CARD FOOTER ACTION BAR ================= */}
        <div className="p-6 bg-slate-50/75 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#064C23]" />
            <span>Ready to apply and sync changes across store applications</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
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
    </div>
  )
}
