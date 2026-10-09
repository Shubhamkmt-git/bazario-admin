import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWindowMaximize,
  faFloppyDisk,
  faRotateLeft,
  faBullhorn,
  faPhone,
  faClock,
  faPalette,
  faLink,
  faEye
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  FormLayout,
  FormSection,
  FormRow,
  FormActions,
  ToggleButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_TOPBAR_DATA = {
  isEnabled: true,
  announcementText: '⚡ Super Savings: Flat ₹150 OFF on orders above ₹999 • Code: BAZARIO150',
  supportPhone: '+91 1800 200 8899',
  supportEmail: 'support@bazario.com',
  storeTiming: '7:00 AM - 10:30 PM (All 7 Days)',
  linkText: 'Claim Offer',
  linkUrl: '/promotions',
  bgColor: '#064C23',
  textColor: '#ffffff',
  showPhone: true,
  showTiming: true
}

const COLOR_PRESETS = [
  { name: 'Forest Green', bg: '#064C23', text: '#ffffff' },
  { name: 'Warm Terracotta', bg: '#A44F37', text: '#ffffff' },
  { name: 'Midnight Charcoal', bg: '#0f172a', text: '#ffffff' },
  { name: 'Sunset Amber', bg: '#b45309', text: '#ffffff' },
  { name: 'Clean Emerald', bg: '#047857', text: '#ffffff' }
]

export default function TopBarManageView() {
  const toast = useToast()
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('bazario_web_topbar')
    return saved ? JSON.parse(saved) : INITIAL_TOPBAR_DATA
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    setSaving(true)
    localStorage.setItem('bazario_web_topbar', JSON.stringify(formData))
    setTimeout(() => {
      setSaving(false)
      toast.success('Top-Bar Saved', 'Website announcement top-bar has been updated live.')
    }, 400)
  }

  const handleReset = () => {
    setFormData(INITIAL_TOPBAR_DATA)
    localStorage.setItem('bazario_web_topbar', JSON.stringify(INITIAL_TOPBAR_DATA))
    toast.info('Reset Default', 'Top-bar settings restored to default.')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faWindowMaximize} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Top-Bar Manage</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Global Header Ticker
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Control the top notification bar, flash sale ticker, contact hotline, and store hours.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <span>Enable Bar:</span>
            <ToggleButton
              size="sm"
              checked={formData.isEnabled}
              onChange={(val) => {
                handleChange('isEnabled', val)
                toast.info('Top-Bar Status', `Top announcement bar is now ${val ? 'Enabled' : 'Disabled'}`)
              }}
              activeColor="#064C23"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          >
            Save Top-Bar
          </Button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FontAwesomeIcon icon={faEye} className="text-[#064C23]" />
            <span>Live Website Top-Bar Preview</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Exact Public Display</span>
        </div>

        {formData.isEnabled ? (
          <div
            className="rounded-2xl px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-inner transition-all duration-300"
            style={{ backgroundColor: formData.bgColor, color: formData.textColor }}
          >
            {/* Left Contact & Timing */}
            <div className="flex items-center space-x-4 opacity-90">
              {formData.showPhone && (
                <span className="flex items-center space-x-1.5">
                  <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                  <span className="font-semibold">{formData.supportPhone}</span>
                </span>
              )}
              {formData.showTiming && (
                <span className="flex items-center space-x-1.5 hidden sm:inline-flex">
                  <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                  <span>{formData.storeTiming}</span>
                </span>
              )}
            </div>

            {/* Center Announcement */}
            <div className="font-bold text-center truncate max-w-xl">
              {formData.announcementText}
            </div>

            {/* Right Action */}
            <div className="flex items-center space-x-3">
              {formData.linkText && (
                <span className="underline font-bold hover:opacity-80 cursor-pointer">
                  {formData.linkText} →
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-100 rounded-2xl text-center text-xs font-bold text-slate-400 border border-dashed border-slate-300">
            Top Bar is currently disabled and will not appear on the website.
          </div>
        )}
      </div>

      {/* Form Settings */}
      <FormLayout onSubmit={handleSave}>
        {/* Section 1: Content & Ticker Message */}
        <FormSection
          stepNumber="1"
          title="Announcement & Promotional Message"
          description="Main highlighted text and click-through link displayed across every page."
        >
          <FormRow columns={1}>
            <InputField
              label="ANNOUNCEMENT / PROMO MESSAGE"
              value={formData.announcementText}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              placeholder="e.g. ⚡ Mega Grocery Sale: Flat ₹150 OFF on ₹999..."
              helperText="Visible in the center of the top bar"
              required
            />
          </FormRow>

          <FormRow columns={2}>
            <InputField
              label="ACTION LINK LABEL"
              value={formData.linkText}
              onChange={(e) => handleChange('linkText', e.target.value)}
              placeholder="e.g. Shop Now / Claim Offer"
            />
            <InputField
              label="TARGET DESTINATION URL"
              value={formData.linkUrl}
              onChange={(e) => handleChange('linkUrl', e.target.value)}
              placeholder="e.g. /promotions or /categories/organic"
            />
          </FormRow>
        </FormSection>

        {/* Section 2: Contact & Store Timing Badges */}
        <FormSection
          stepNumber="2"
          title="Customer Hotline & Operating Timings"
          description="Direct contact details shown on the left side of the bar."
        >
          <FormRow columns={2}>
            <div className="space-y-2">
              <InputField
                label="SUPPORT HELPLINE NUMBER"
                value={formData.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                placeholder="+91 1800 200 8899"
              />
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">Display Helpline in Bar</span>
                <ToggleButton
                  size="sm"
                  checked={formData.showPhone}
                  onChange={(val) => handleChange('showPhone', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="space-y-2">
              <InputField
                label="STORE OPERATING TIMINGS"
                value={formData.storeTiming}
                onChange={(e) => handleChange('storeTiming', e.target.value)}
                placeholder="7:00 AM - 10:30 PM (All 7 Days)"
              />
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">Display Store Timings in Bar</span>
                <ToggleButton
                  size="sm"
                  checked={formData.showTiming}
                  onChange={(val) => handleChange('showTiming', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>
          </FormRow>
        </FormSection>

        {/* Section 3: Colors & Styling */}
        <FormSection
          stepNumber="3"
          title="Bar Palette & Appearance"
          description="Choose a high-contrast brand color scheme for the top bar."
        >
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              CURATED COLOR PRESETS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    handleChange('bgColor', preset.bg)
                    handleChange('textColor', preset.text)
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.bgColor === preset.bg
                      ? 'border-[#064C23] ring-2 ring-[#064C23]/20 bg-slate-50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-full h-7 rounded-lg mb-2 shadow-2xs"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <p className="text-xs font-bold text-slate-800 truncate">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Actions Footer */}
        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            icon={<FontAwesomeIcon icon={faRotateLeft} />}
          >
            Reset Defaults
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          >
            Save & Publish Top-Bar
          </Button>
        </FormActions>
      </FormLayout>
    </div>
  )
}
