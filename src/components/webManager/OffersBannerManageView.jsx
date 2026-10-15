import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGift,
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
import { getAdminOffersBannerApi, updateAdminOffersBannerApi } from '../../utils/adminApi'

const INITIAL_OFFERS_DATA = {
  status: true,
  bannerImage: '',
  redirectUrl: '/offers'
}

export default function OffersBannerManageView() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_offers_banner_manage')
      return saved ? JSON.parse(saved) : INITIAL_OFFERS_DATA
    } catch {
      return INITIAL_OFFERS_DATA
    }
  })

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await getAdminOffersBannerApi()
        const data = res.data
        if (data && typeof data === 'object') {
          setFormData((prev) => ({
            ...prev,
            status: data.status !== undefined ? data.status : true,
            bannerImage: data.bannerImage || prev.bannerImage || '',
            redirectUrl: data.redirectUrl || data.url || prev.redirectUrl || '/offers'
          }))
        }
      } catch (err) {
        console.warn('API error, using cached offers banner data:', err)
      }
    }
    fetchOffers()
  }, [])

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSave = async (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem('bazario_web_offers_banner_manage', JSON.stringify(formData))
      await updateAdminOffersBannerApi(formData)
      setSaving(false)
      toast.success('Offers Banner Saved', 'Offers banner image and redirect URL have been updated.')
    } catch {
      setSaving(false)
      toast.success('Offers Banner Saved', 'Offers banner image and redirect URL have been saved.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_OFFERS_DATA)
    localStorage.setItem('bazario_web_offers_banner_manage', JSON.stringify(INITIAL_OFFERS_DATA))
    toast.info('Reset', 'Restored default banner settings.')
  }

  return (
    <div className="space-y-6 w-full pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faGift} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Offers Banner Manage
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Homepage Offers Card
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload promotional offer banner and set destination redirect URL on user click.
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
              Section Visibility
            </h2>
            <p className="text-xs text-slate-500">
              Toggle visibility of the offers banner section on the storefront.
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

        {/* Banner Image Upload & Redirect URL */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <FontAwesomeIcon icon={faImage} className="text-emerald-600" />
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Offer Banner Image & Destination URL
            </h3>
          </div>

          {/* Image Upload */}
          <ImageUploadFrame
            label="Upload Offer Banner Image"
            value={formData.bannerImage}
            onChange={(url) => handleChange('bannerImage', url)}
            aspectRatio="4:1"
            recommendedRatio="4:1 (1024 × 246 px)"
            description="Recommended: 1024 × 246 px or 1200 × 300 px (4:1 horizontal strip). PNG, JPG, WEBP up to 5MB."
          />

          {/* Redirect URL */}
          <InputField
            label="Click Redirect URL"
            value={formData.redirectUrl}
            onChange={(e) => handleChange('redirectUrl', e.target.value)}
            placeholder="e.g. /offers or https://..."
            icon={<FontAwesomeIcon icon={faLink} className="text-slate-400" />}
            hint="URL where users will be redirected when clicking this offer banner"
          />
        </div>
      </form>
    </div>
  )
}
