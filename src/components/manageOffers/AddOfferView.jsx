import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPercent,
  faFloppyDisk,
  faLink,
  faHeading,
  faArrowDown19
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  BackButton,
  InputField,
  ImageUploadFrame
} from '../index'
import { useToast } from '../../context/ToastContext'

export default function AddOfferView({ onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    redirectionUrl: '',
    image: '',
    sortingOrder: 1,
    status: 'Active'
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.title.trim()) {
      errs.title = 'Offer title is required'
    }
    if (!formData.redirectionUrl.trim()) {
      errs.redirectionUrl = 'Redirection URL is required'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Validation Error', 'Please complete all required fields.')
      return
    }

    onSave({
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || 1
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Add New Offer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create a new promotional offer banner with redirection target and priority order.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Offer
          </Button>
        </div>
      </div>

      {/* Clean Unified Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Offer Banner 1.5:1 Frame */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <ImageUploadFrame
              label="BANNER IMAGE (1.5:1)"
              aspectRatio="1.5:1"
              description="Upload promotional offer banner (PNG, JPG, WEBP max 5MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
            <p className="text-[11px] text-slate-400 mt-2 px-1">
              Recommended resolution: <span className="font-semibold text-slate-600">600×400px</span> or any 3:2 (1.5:1) aspect ratio.
            </p>
          </div>

          {/* Right Column (7 cols): Title, Redirection URL, Order & Status */}
          <div className="lg:col-span-7 space-y-5">
            {/* Offer Title */}
            <InputField
              label="OFFER TITLE"
              placeholder="e.g. Flat 50% Off on Fresh Fruits & Vegetables"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              icon={<FontAwesomeIcon icon={faHeading} className="text-xs text-slate-400" />}
              error={errors.title}
              helperText="Headline shown to customers for this offer or campaign"
              required
            />

            {/* Redirection at URL */}
            <InputField
              label="REDIRECTION AT URL"
              placeholder="e.g. /categories/fresh-produce or https://bazario.in/deals"
              value={formData.redirectionUrl}
              onChange={(e) => {
                setFormData({ ...formData, redirectionUrl: e.target.value })
                if (errors.redirectionUrl) setErrors({ ...errors, redirectionUrl: '' })
              }}
              icon={<FontAwesomeIcon icon={faLink} className="text-xs text-[#064C23]" />}
              error={errors.redirectionUrl}
              helperText="Target internal category/product page or external promotional link"
              required
            />

            {/* Row: Sorting Order & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <InputField
                label="SORTING ORDER"
                type="number"
                min="1"
                placeholder="1"
                value={formData.sortingOrder}
                onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                icon={<FontAwesomeIcon icon={faArrowDown19} className="text-xs text-slate-400" />}
                helperText="Lower numbers appear first in the offers list / feed"
                required
              />

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  STATUS <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active offers are immediately published to customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
