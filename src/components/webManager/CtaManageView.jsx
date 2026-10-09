import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn,
  faFloppyDisk,
  faRotateLeft,
  faTag,
  faTags,
  faLink,
  faCopy,
  faCheck,
  faEye,
  faArrowRight,
  faTicket
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ToggleButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_CTA_DATA = {
  status: true,
  label: 'LIMITED TIME PROMOTION',
  title: 'Download the Bazario App & Get ₹150 OFF on Your First 3 Orders',
  subtitle: 'Enjoy 20-minute grocery delivery, live order tracking, and exclusive weekly farm produce discounts directly to your doorstep.',
  tags: [
    '⚡ 20-Min Delivery',
    '🥬 100% Farm Fresh',
    '💰 Zero Delivery Fee'
  ],
  code: 'BAZARIO150',
  buttonLabel: 'Download App Now',
  buttonUrl: 'https://bazario.in/download'
}

export default function CtaManageView() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_cta_manage')
      return saved ? JSON.parse(saved) : INITIAL_CTA_DATA
    } catch {
      return INITIAL_CTA_DATA
    }
  })

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleTagChange = (index, val) => {
    const updatedTags = [...formData.tags]
    updatedTags[index] = val
    setFormData((prev) => ({ ...prev, tags: updatedTags }))
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem('bazario_web_cta_manage', JSON.stringify(formData))
      setTimeout(() => {
        setSaving(false)
        toast.success('CTA Saved', 'Website CTA banner settings have been saved successfully.')
      }, 350)
    } catch {
      setSaving(false)
      toast.error('Save Failed', 'Could not save CTA settings.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_CTA_DATA)
    localStorage.setItem('bazario_web_cta_manage', JSON.stringify(INITIAL_CTA_DATA))
    toast.info('CTA Reset', 'Restored default CTA values.')
  }

  const handleCopyCode = (code) => {
    if (!code) return
    navigator.clipboard?.writeText?.(code)
    setCopied(true)
    toast.success('Code Copied', `"${code}" copied to clipboard.`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faBullhorn} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                CTA Manage
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Storefront Lead CTA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure promotional Call-To-Action banner with tags, coupon code, and destination action button.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            icon={<FontAwesomeIcon icon={faRotateLeft} className="text-xs" />}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save CTA
          </Button>
        </div>
      </div>

      {/* Main Manage Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              CTA Banner Content Settings
            </h2>
            <p className="text-xs text-slate-500">
              Manage promotional texts, tags, copyable voucher code, and action link.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <span className="text-slate-700">Banner Status:</span>
            <ToggleButton
              size="sm"
              checked={formData.status}
              onChange={(val) => handleChange('status', val)}
              activeColor="#064C23"
            />
          </div>
        </div>

        {/* 1. LABLE */}
        <div className="space-y-1.5">
          <InputField
            label="LABLE"
            placeholder="e.g. LIMITED TIME PROMOTION"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            helperText="Upper badge or category kicker displayed above the title"
          />
        </div>

        {/* 2. TITLE */}
        <div className="space-y-1.5">
          <InputField
            label="TITLE"
            placeholder="e.g. Download the Bazario App & Get ₹150 OFF on Your First 3 Orders"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            helperText="Primary headline message of the Call-To-Action"
            required
          />
        </div>

        {/* 3. SUBTITLE */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            SUBTITLE
          </label>
          <textarea
            rows={3}
            placeholder="Enter supporting subtitle description..."
            value={formData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* 4. TAAG (3) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            TAAG (3)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InputField
              label="TAG 1"
              placeholder="e.g. ⚡ 20-Min Delivery"
              value={formData.tags[0] || ''}
              onChange={(e) => handleTagChange(0, e.target.value)}
            />
            <InputField
              label="TAG 2"
              placeholder="e.g. 🥬 100% Farm Fresh"
              value={formData.tags[1] || ''}
              onChange={(e) => handleTagChange(1, e.target.value)}
            />
            <InputField
              label="TAG 3"
              placeholder="e.g. 💰 Zero Delivery Fee"
              value={formData.tags[2] || ''}
              onChange={(e) => handleTagChange(2, e.target.value)}
            />
          </div>
        </div>

        {/* 5. CODE */}
        <div className="space-y-1.5">
          <InputField
            label="CODE"
            placeholder="e.g. BAZARIO150"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            helperText="Optional coupon or referral code that users can copy with one click"
          />
        </div>

        {/* 6 & 7. BUTTON LABLE & BUUTTON URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <InputField
            label="BUTTON LAABLE"
            placeholder="e.g. Download App Now"
            value={formData.buttonLabel}
            onChange={(e) => handleChange('buttonLabel', e.target.value)}
            helperText="Text shown on the action button"
            required
          />

          <InputField
            label="BUUTTON URL"
            placeholder="e.g. https://bazario.in/download or /app"
            value={formData.buttonUrl}
            onChange={(e) => handleChange('buttonUrl', e.target.value)}
            helperText="Destination redirect URL or link"
            required
          />
        </div>

        {/* Form Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
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
            type="submit"
            variant="primary"
            size="md"
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save CTA Banner
          </Button>
        </div>
      </form>
    </div>
  )
}
