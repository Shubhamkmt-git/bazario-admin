import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import {
  Button,
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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Product Category
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure category title, subtitle, sorting order, status, featured highlight, image, and description.
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

      {/* Clean Unified Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Row 1: Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="CATEGORY TITLE"
            placeholder="e.g. Farm-Fresh Fruits & Vegetables"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            helperText="Primary category name displayed to customers"
            required
          />

          <InputField
            label="SUBTITLE / TAGLINE"
            placeholder="e.g. 100% Direct from local farms with morning freshness check"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            helperText="Secondary subtitle or promotional tagline"
          />
        </div>

        {/* Row 2: Sorting Order, Status & Is Featured Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <InputField
              label="SORTING ORDER"
              type="number"
              min="1"
              step="1"
              value={formData.sortingOrder}
              onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
              placeholder="1"
              helperText="Display sequence (1 = Top)"
              required
            />
          </div>

          <div>
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
            <p className="text-[11px] text-slate-400 mt-1">Catalog visibility state</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              IS FEATURED
            </label>
            <select
              value={formData.isFeatured ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
            >
              <option value="true">Yes (Featured Category)</option>
              <option value="false">No (Standard Category)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Storefront highlight flag</p>
          </div>
        </div>

        {/* Row 3: Category Image / Icon */}
        <div className="space-y-1.5">
          <ImageUploadFrame
            label="CATEGORY IMAGE / ICON"
            aspectRatio="square"
            description="Upload category thumbnail icon or graphic (PNG, JPG, WEBP up to 5MB)"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
        </div>

        {/* Row 4: Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            DESCRIPTION
          </label>
          <textarea
            rows={4}
            placeholder="Enter detailed description of grocery products in this category..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all leading-relaxed"
          />
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
            Publish Category
          </Button>
        </div>
      </form>
    </div>
  )
}
