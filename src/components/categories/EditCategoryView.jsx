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

export default function EditCategoryView({ category, onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: category?.title || '',
    subtitle: category?.subtitle || '',
    sortingOrder: category?.sortingOrder || 1,
    status: category?.status || 'Active',
    isFeatured: Boolean(category?.isFeatured),
    image: category?.image || '',
    description: category?.description || ''
  })

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please specify a category title.')
      return
    }

    const updatedCategory = {
      ...category,
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || category.sortingOrder
    }

    onSave(updatedCategory)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Product Category
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update category title, subtitle, sorting order, status, featured highlight, image, and description.
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
            Save Changes
          </Button>
        </div>
      </div>

      {/* Unified One-Card Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Card Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Category Details & Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Set display sequence, storefront highlight, branding texts, and image.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <span className="text-slate-700">Category Status:</span>
            <ToggleButton
              size="sm"
              checked={formData.status === 'Active'}
              onChange={(val) => setFormData({ ...formData, status: val ? 'Active' : 'Inactive' })}
              activeColor="#064C23"
            />
          </div>
        </div>

        {/* Row 1: Sorting Order, Status & Is Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <InputField
              label="SORTING ORDER"
              type="number"
              min="1"
              step="1"
              value={formData.sortingOrder}
              onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
              placeholder="e.g. 1"
              helperText="Sequence priority in catalog menu"
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

        {/* Row 2: Category Image Upload Frame */}
        <div className="space-y-1.5">
          <ImageUploadFrame
            label="CATEGORY IMAGE / ICON"
            aspectRatio="square"
            description="Upload category thumbnail or icon (PNG, JPG, WEBP up to 5MB)"
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
        </div>

        {/* Row 3: Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="TITLE"
            placeholder="e.g. Farm-Fresh Fruits & Vegetables"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            helperText="Primary category name"
            required
          />

          <InputField
            label="SUBTITLE"
            placeholder="e.g. 100% Direct from local farms with morning freshness check"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            helperText="Short category tagline or sub-header"
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
