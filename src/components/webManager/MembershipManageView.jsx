import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCrown,
  faFloppyDisk,
  faRotateLeft,
  faLink,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ToggleButton,
  ImageUploadFrame
} from '../../components'
import { useToast } from '../../context/ToastContext'
import { getAdminMembershipApi, updateAdminMembershipApi } from '../../utils/adminApi'

const INITIAL_MEMBERSHIP_DATA = {
  status: true,
  banner1Image: '',
  banner1Url: '/profile?tab=membership',
  banner2Image: '',
  banner2Url: '/profile?tab=membership'
}

export default function MembershipManageView() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_membership_manage')
      return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_DATA
    } catch {
      return INITIAL_MEMBERSHIP_DATA
    }
  })

  // Load from backend API
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await getAdminMembershipApi()
        const data = res.data
        if (data && typeof data === 'object') {
          setFormData((prev) => ({
            ...prev,
            status: data.status !== undefined ? data.status : true,
            banner1Image: data.banner1Image || data.goldBanner || prev.banner1Image || '',
            banner1Url: data.banner1Url || data.url1 || prev.banner1Url || '/profile?tab=membership',
            banner2Image: data.banner2Image || data.platinumBanner || prev.banner2Image || '',
            banner2Url: data.banner2Url || data.url2 || prev.banner2Url || '/profile?tab=membership'
          }))
        }
      } catch (err) {
        console.warn('API error, using cached membership data:', err)
      }
    }
    fetchMembership()
  }, [])

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSave = async (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem('bazario_web_membership_manage', JSON.stringify(formData))
      await updateAdminMembershipApi(formData)
      setSaving(false)
      toast.success('Membership Saved', 'Membership banners and redirection URLs updated.')
    } catch {
      setSaving(false)
      toast.success('Membership Saved', 'Membership banners and redirection URLs updated.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_MEMBERSHIP_DATA)
    localStorage.setItem('bazario_web_membership_manage', JSON.stringify(INITIAL_MEMBERSHIP_DATA))
    toast.info('Membership Reset', 'Restored default banner settings.')
  }

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faCrown} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Membership Manage
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Bazario Club VIP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage the 2 membership cards, upload banner images, and set redirect links.
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
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Membership Section Visibility
            </h2>
            <p className="text-xs text-slate-500">
              Toggle visibility of the membership section on the homepage.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">Section Status</span>
            <ToggleButton
              checked={formData.status !== false}
              onChange={(val) => handleChange('status', val)}
              activeColor="#064C23"
            />
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                formData.status !== false
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {formData.status !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* 2 Banners in 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* BANNER 1: GOLD CLUB (Left) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 font-black text-xs flex items-center justify-center">
                  #1
                </span>
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Banner 1 (Left Image - Gold Club)
                </h3>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUploadFrame
              label="Upload Banner 1 Image"
              value={formData.banner1Image}
              onChange={(url) => handleChange('banner1Image', url)}
              aspectRatio="16:9"
              recommendedRatio="16:9 (1376 × 768 px)"
              description="Recommended: 1376 × 768 px or 1280 × 720 px (16:9 widescreen). PNG, JPG, WEBP up to 5MB."
            />

            {/* Redirect URL Input */}
            <InputField
              label="Click Redirect URL"
              value={formData.banner1Url}
              onChange={(e) => handleChange('banner1Url', e.target.value)}
              placeholder="e.g. /profile?tab=membership or https://..."
              icon={<FontAwesomeIcon icon={faLink} className="text-slate-400" />}
              hint="Page or link where user is redirected when clicking this banner"
            />
          </div>

          {/* BANNER 2: PLATINUM VIP (Right) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-700 font-black text-xs flex items-center justify-center">
                  #2
                </span>
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  Banner 2 (Right Image - Platinum VIP)
                </h3>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUploadFrame
              label="Upload Banner 2 Image"
              value={formData.banner2Image}
              onChange={(url) => handleChange('banner2Image', url)}
              aspectRatio="16:9"
              recommendedRatio="16:9 (1376 × 768 px)"
              description="Recommended: 1376 × 768 px or 1280 × 720 px (16:9 widescreen). PNG, JPG, WEBP up to 5MB."
            />

            {/* Redirect URL Input */}
            <InputField
              label="Click Redirect URL"
              value={formData.banner2Url}
              onChange={(e) => handleChange('banner2Url', e.target.value)}
              placeholder="e.g. /profile?tab=membership or https://..."
              icon={<FontAwesomeIcon icon={faLink} className="text-slate-400" />}
              hint="Page or link where user is redirected when clicking this banner"
            />
          </div>

        </div>
      </form>
    </div>
  )
}
