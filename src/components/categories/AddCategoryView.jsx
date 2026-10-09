import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faStar,
  faTags,
  faSliders,
  faImage,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ToggleButton,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

export default function AddCategoryView({ onBack, onSave, categoriesCount = 0 }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortingOrder: categoriesCount + 1,
    status: 'Active',
    isFeatured: false,
    image: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please specify a category title.')
      return
    }

    const newCategory = {
      id: Date.now(),
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || categoriesCount + 1
    }

    onSave(newCategory)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#064C23]">
                Catalog Setup
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Product Category
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure category branding, hierarchy order, storefront featured badge, and description.
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
            Publish Category
          </Button>
        </div>
      </div>

      {/* Main 2-Column Responsive Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Core Category Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faTags} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Category Identity & Information
                </h2>
                <p className="text-xs text-slate-500">
                  Customer-facing naming, tagline, and comprehensive catalogue summary.
                </p>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-4">
              <InputField
                label="CATEGORY TITLE"
                placeholder="e.g. Farm-Fresh Fruits & Vegetables"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                helperText="Primary name displayed in navigation bars and category menus"
                required
              />

              <InputField
                label="SUBTITLE / TAGLINE"
                placeholder="e.g. 100% Direct from local farms with morning freshness check"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                helperText="Secondary tagline or promotional sub-header text"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                DESCRIPTION
              </label>
              <textarea
                rows={5}
                placeholder="Describe the types of grocery products, brands, or specialties contained in this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                Detailed description used for category header banners and catalog SEO.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Image Upload & Publishing Parameters */}
        <div className="space-y-6">
          {/* Card 1: Category Media */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faImage} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Category Icon & Graphic
                </h3>
                <p className="text-[11px] text-slate-500">
                  Square visual for menus & grid
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <ImageUploadFrame
                label=""
                aspectRatio="square"
                description="Upload square icon (PNG, JPG, WEBP up to 5MB)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>
          </div>

          {/* Card 2: Status & Display Parameters */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                <FontAwesomeIcon icon={faSliders} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Display Settings
                </h3>
                <p className="text-[11px] text-slate-500">
                  Order sequence & storefront visibility
                </p>
              </div>
            </div>

            {/* Sorting Order */}
            <div>
              <InputField
                label="SORTING ORDER"
                type="number"
                min="1"
                step="1"
                value={formData.sortingOrder}
                onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                placeholder="1"
                helperText="Sequence priority on website menu (1 = First)"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                CATEGORY STATUS
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
              >
                <option value="Active">Active (Visible to Shoppers)</option>
                <option value="Inactive">Inactive (Hidden)</option>
              </select>
            </div>

            {/* Is Featured Toggle Tile */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <span className="text-xs font-black text-amber-950 uppercase">
                    Featured Highlight
                  </span>
                </div>
                <ToggleButton
                  size="sm"
                  checked={formData.isFeatured}
                  onChange={(val) => setFormData({ ...formData, isFeatured: val })}
                  activeColor="#A44F37"
                />
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Featured categories are highlighted on the homepage category carousel and top navigation bar.
              </p>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" size="md" onClick={onBack}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
            >
              Publish Category
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
