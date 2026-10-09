import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faBoxesStacked,
  faIndianRupeeSign,
  faTag,
  faImages,
  faMagnifyingGlass,
  faPlus,
  faXmark,
  faGlobe,
  faPercent,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

const CATEGORY_OPTIONS = [
  'Fresh Fruits & Vegetables',
  'Dairy, Bread & Eggs',
  'Atta, Rice, Oil & Dals',
  'Snacks & Munchies',
  'Bakery & Biscuits',
  'Beverages & Juices',
  'Instant & Frozen Food',
  'Personal Care & Hygiene',
  'Cleaning & Household',
  'Baby Care & Kids'
]

const BRAND_SUGGESTIONS = [
  'Amul',
  'Aashirvaad',
  'Fortune',
  'Tata Sampann',
  'Britannia',
  'Nestle',
  'Dabur',
  'Mother Dairy',
  'Haldiram',
  'Surf Excel',
  'Bazario Fresh'
]

export default function AddProductView({ onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Fresh Fruits & Vegetables',
    brand: '',
    qty: '100',
    unit: 'Units',
    price: '',
    sellingPrice: '',
    galleryImages: ['', '', ''],
    searchKeywords: [],
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'Active'
  })

  const [keywordInput, setKeywordInput] = useState('')

  // Add keyword chip
  const handleAddKeyword = (e) => {
    e?.preventDefault?.()
    const trimmed = keywordInput.trim().replace(/^#/, '')
    if (!trimmed) return
    if (formData.searchKeywords.includes(trimmed)) {
      toast.warning('Duplicate Tag', `Keyword "${trimmed}" is already added.`)
      setKeywordInput('')
      return
    }
    setFormData((prev) => ({
      ...prev,
      searchKeywords: [...prev.searchKeywords, trimmed]
    }))
    setKeywordInput('')
  }

  // Remove keyword chip
  const handleRemoveKeyword = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      searchKeywords: prev.searchKeywords.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Add suggestion keyword
  const handleAddSuggestedKeyword = (kw) => {
    if (!formData.searchKeywords.includes(kw)) {
      setFormData((prev) => ({
        ...prev,
        searchKeywords: [...prev.searchKeywords, kw]
      }))
    }
  }

  // Update specific gallery image slot
  const handleGalleryChange = (index, url) => {
    const updated = [...formData.galleryImages]
    updated[index] = url
    setFormData({ ...formData, galleryImages: updated })
  }

  // Add new gallery slot
  const handleAddGallerySlot = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, '']
    }))
  }

  // Remove gallery slot
  const handleRemoveGallerySlot = (index) => {
    if (formData.galleryImages.length <= 1) {
      setFormData((prev) => ({ ...prev, galleryImages: [''] }))
      return
    }
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== index)
    }))
  }

  // Calculate discount
  const regularPrice = parseFloat(formData.price) || 0
  const sellingPrice = parseFloat(formData.sellingPrice) || 0
  const discountPercent =
    regularPrice > 0 && regularPrice > sellingPrice && sellingPrice > 0
      ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
      : 0

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please enter a product title.')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Validation Error', 'Please enter a valid MRP price in ₹.')
      return
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      toast.error('Validation Error', 'Please enter a valid selling price in ₹.')
      return
    }
    if (parseFloat(formData.sellingPrice) > parseFloat(formData.price)) {
      toast.warning('Price Check', 'Selling price is higher than MRP. Please verify.')
    }

    const filteredGallery = formData.galleryImages.filter(Boolean)

    const newProduct = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      brand: formData.brand.trim() || 'Bazario',
      qty: formData.qty || '1',
      unit: formData.unit || 'Units',
      price: formData.price,
      sellingPrice: formData.sellingPrice,
      image: filteredGallery[0] || '/supermart-bg.jpg',
      galleryImages: filteredGallery.length > 0 ? filteredGallery : ['/supermart-bg.jpg'],
      searchKeywords: formData.searchKeywords,
      metaTitle: formData.metaTitle.trim() || formData.title,
      metaDescription: formData.metaDescription.trim(),
      slug:
        formData.slug.trim() ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      status: formData.status,
      createdAt: new Date().toISOString()
    }

    onSave(newProduct)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Add New Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create a new catalog item with pricing, brand, stock, multi-image gallery & search SEO tags.
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
            Save Product
          </Button>
        </div>
      </div>

      {/* Main Unified Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faBoxesStacked} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                1. General Information
              </h2>
              <p className="text-xs text-slate-400">
                Primary product title, category classification, brand and catalog visibility.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InputField
              label="PRODUCT TITLE"
              placeholder="e.g. Amul Butter Pasteurized (500g Pack)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Official product name displayed on website and app storefront"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  CATEGORY
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                  required
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Supermarket category department</p>
              </div>

              {/* Brand Input with quick suggestions */}
              <div>
                <InputField
                  label="BRAND NAME"
                  placeholder="e.g. Amul / Fortune / Aashirvaad"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  helperText="Manufacturer or house brand name"
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  <option value="Active">Active (Visible & Purchasable)</option>
                  <option value="Inactive">Inactive (Hidden from Store)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Storefront publication state</p>
              </div>
            </div>

            {/* Quick Brand suggestions pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Popular Brands:</span>
              {BRAND_SUGGESTIONS.slice(0, 6).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setFormData({ ...formData, brand: b })}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-[#064C23]/10 hover:text-[#064C23] text-slate-600 text-[11px] font-semibold transition-colors"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Stock Inventory */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064C23] flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                2. Pricing & Stock Inventory
              </h2>
              <p className="text-xs text-slate-400">
                Configure MRP, discounted selling price, available inventory quantity and unit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* MRP Regular Price */}
            <div>
              <InputField
                label="REGULAR PRICE (MRP in ₹)"
                type="number"
                step="0.01"
                min="0"
                placeholder="275.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                icon={<FontAwesomeIcon icon={faIndianRupeeSign} className="text-xs text-slate-400" />}
                helperText="Maximum Retail Price (Printed on box)"
                required
              />
            </div>

            {/* Selling Price */}
            <div>
              <InputField
                label="SELLING PRICE (Offer in ₹)"
                type="number"
                step="0.01"
                min="0"
                placeholder="245.00"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                icon={<FontAwesomeIcon icon={faIndianRupeeSign} className="text-xs text-[#064C23]" />}
                helperText="Final checkout price after discount"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <InputField
                label="STOCK QUANTITY (QTY)"
                type="number"
                min="0"
                step="1"
                placeholder="150"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                helperText="Current available warehouse inventory"
                required
              />
            </div>

            {/* Unit / Measurement */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                UNIT / PACK SIZE
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
              >
                <option value="Units">Units (Pieces / Packets)</option>
                <option value="1 kg">1 kg Pack</option>
                <option value="500 g">500 g Pack</option>
                <option value="250 g">250 g Pack</option>
                <option value="1 L">1 Litre Bottle/Pouch</option>
                <option value="500 ml">500 ml Bottle</option>
                <option value="5 kg">5 kg Bag</option>
                <option value="10 kg">10 kg Bag</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Package volume or count</p>
            </div>
          </div>

          {/* Pricing Highlight Pill */}
          {regularPrice > 0 && sellingPrice > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black">
                  %
                </span>
                <div>
                  <div className="text-xs font-bold text-emerald-900">
                    Customer Savings:{' '}
                    <span className="text-emerald-700 font-extrabold">
                      ₹{(regularPrice - sellingPrice).toFixed(2)}
                    </span>{' '}
                    ({discountPercent}% OFF)
                  </div>
                  <div className="text-[11px] text-emerald-700/80">
                    MRP: ₹{regularPrice.toFixed(2)} → Selling Price: ₹{sellingPrice.toFixed(2)}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white self-start sm:self-auto">
                {discountPercent > 0 ? `${discountPercent}% DISCOUNT` : 'NO DISCOUNT'}
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Gallery Images */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm font-bold">
                <FontAwesomeIcon icon={faImages} />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  3. Product Gallery Images
                </h2>
                <p className="text-xs text-slate-400">
                  Upload high-res product photos from multiple angles (Primary thumbnail + gallery shots).
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGallerySlot}
              icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
            >
              Add More Photo Slot
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {formData.galleryImages.map((imgUrl, index) => (
              <div
                key={index}
                className="relative bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    {index === 0 ? '★ Primary Cover Image' : `Gallery Image #${index + 1}`}
                  </span>
                  {formData.galleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGallerySlot(index)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove image"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-xs" />
                    </button>
                  )}
                </div>

                <ImageUploadFrame
                  aspectRatio="square"
                  description={
                    index === 0
                      ? 'Upload square main cover photo (1:1 ratio, max 5MB)'
                      : 'Upload alternate view / nutrition info shot (1:1 ratio)'
                  }
                  value={imgUrl}
                  onChange={(url) => handleGalleryChange(index, url)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Search Keywords */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faTag} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                4. Search Keywords & Tags
              </h2>
              <p className="text-xs text-slate-400">
                Keywords help customers discover this item quickly when using the store search bar.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                />
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddKeyword()
                    }
                  }}
                  placeholder="Type a search keyword (e.g. butter, table butter, salted butter) and press Add..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all font-medium"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddKeyword}
                icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
              >
                Add Tag
              </Button>
            </div>

            {/* Keyword Chips List */}
            {formData.searchKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[50px] items-center">
                {formData.searchKeywords.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-[#064C23]/30 text-[#064C23] rounded-xl text-xs font-bold shadow-2xs"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="text-[#064C23]/60 hover:text-rose-600 transition-colors ml-1"
                    >
                      <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No search keywords added yet. Add tags above to improve product search indexing.
              </p>
            )}

            {/* Suggested Tags based on Category */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Add:</span>
              {['fresh', 'organic', 'grocery', 'pure', 'discount', 'premium', 'daily-deal'].map(
                (suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => handleAddSuggestedKeyword(suggested)}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 text-[11px] font-semibold transition-colors"
                  >
                    +{suggested}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Section 5: SEO (Search Engine Optimization) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faGlobe} />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                5. Search Engine Optimization (SEO)
              </h2>
              <p className="text-xs text-slate-400">
                Optimize meta title, description and URL slug for Google search rankings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="META TITLE (SEO)"
                placeholder="e.g. Buy Amul Butter Online at Best Price | Bazario"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                helperText="Optimal length: 50-60 characters for search listings"
              />

              <InputField
                label="URL SLUG / CANONICAL"
                placeholder="e.g. amul-pasteurized-butter-500g"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="SEO-friendly web permalink: /products/your-slug"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                META DESCRIPTION (SEO)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Order fresh Amul Pasteurized Butter 500g online from Bazario Supermarket with quick 30-minute doorstep delivery and verified best price."
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Summary snippet displayed in Google search results (120-160 characters).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save & Publish Product
          </Button>
        </div>
      </form>
    </div>
  )
}
