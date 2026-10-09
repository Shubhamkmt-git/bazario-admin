import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faDesktop, faMobileScreen } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

export default function AddHeroBannerView({ onBack, onSave, bannersCount = 0 }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    webImage: '',
    mobileImage: '',
    sortingOrder: bannersCount + 1,
    status: 'Active'
  })

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please enter a hero banner title.')
      return
    }

    const newBanner = {
      id: Date.now(),
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || bannersCount + 1
    }

    onSave(newBanner)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Hero Banner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure homepage hero banner title, desktop web image (5:1), mobile image (1.5:1), sorting order, and status.
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
            Publish Hero Banner
          </Button>
        </div>
      </div>

      {/* Clean Unified Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Row 1: Title, Sorting Order & Status */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6">
            <InputField
              label="BANNER TITLE"
              placeholder="e.g. Mega Grocery Super Saver - Up to 50% Off"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Internal banner identifier & promotional campaign headline"
              required
            />
          </div>

          <div className="md:col-span-3">
            <InputField
              label="SORTING ORDER"
              type="number"
              min="1"
              step="1"
              value={formData.sortingOrder}
              onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
              placeholder="1"
              helperText="Display sequence (1 = Top Carousel)"
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              STATUS
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Homepage carousel visibility</p>
          </div>
        </div>

        {/* Row 2: Banner Images (Web 5:1 and Mobile 1.5:1) */}
        <div className="pt-4 border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Web Banner (5:1) */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faDesktop} className="text-[#064C23] text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  BANNER IMAGE (WEB) • 5:1 RATIO
                </span>
              </div>
              <ImageUploadFrame
                aspectRatio="5:1"
                description="Upload wide banner for desktop/laptop displays (Recommended 2500x500px, 5:1 ratio, max 5MB)"
                value={formData.webImage}
                onChange={(url) => setFormData({ ...formData, webImage: url })}
              />
            </div>

            {/* Right: Mobile Banner (1.5:1) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faMobileScreen} className="text-[#064C23] text-sm" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  BANNER IMAGE (MOBILE) • 1.5:1 RATIO
                </span>
              </div>
              <ImageUploadFrame
                aspectRatio="1.5:1"
                description="Upload banner for mobile app & mobile web (Recommended 750x500px, 1.5:1 ratio, max 5MB)"
                value={formData.mobileImage}
                onChange={(url) => setFormData({ ...formData, mobileImage: url })}
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Publish Hero Banner
          </Button>
        </div>
      </form>
    </div>
  )
}
