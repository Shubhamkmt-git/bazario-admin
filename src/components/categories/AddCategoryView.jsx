import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faStar } from '@fortawesome/free-solid-svg-icons'
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

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Section 1: Title, Subtitle & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left (2 cols): Title & Subtitle */}
          <div className="lg:col-span-2 space-y-4">
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

          {/* Right (1 col): Category Image */}
          <div className="lg:col-span-1">
            <ImageUploadFrame
              label="CATEGORY IMAGE / ICON"
              aspectRatio="square"
              description="PNG, JPG, WEBP (Max 5MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
        </div>

        {/* Section 2: Sorting Order, Status & Is Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              IS FEATURED
            </label>
            <div className="flex items-center justify-between h-[42px] px-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faStar} className={formData.isFeatured ? 'text-amber-500' : 'text-slate-400'} />
                <span>{formData.isFeatured ? 'Featured Category' : 'Standard'}</span>
              </span>
              <ToggleButton
                size="sm"
                checked={formData.isFeatured}
                onChange={(val) => setFormData({ ...formData, isFeatured: val })}
                activeColor="#A44F37"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Description */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
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
