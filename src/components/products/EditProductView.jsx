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
  faPercent
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

export default function EditProductView({ product, onBack, onSave }) {
  const toast = useToast()

  // Initialize gallery images array
  const initialGallery = Array.isArray(product?.galleryImages) && product.galleryImages.length > 0
    ? [...product.galleryImages]
    : product?.image
    ? [product.image]
    : ['', '', '']

  // Initialize keywords
  const initialKeywords = Array.isArray(product?.searchKeywords)
    ? [...product.searchKeywords]
    : typeof product?.searchKeywords === 'string' && product.searchKeywords.trim()
    ? product.searchKeywords.split(',').map((s) => s.trim())
    : []

  const [formData, setFormData] = useState({
    title: product?.title || '',
    category: product?.category || 'Fresh Fruits & Vegetables',
    brand: product?.brand || '',
    qty: product?.qty || '100',
    unit: product?.unit || 'Units',
    price: product?.price || '',
    sellingPrice: product?.sellingPrice || '',
    galleryImages: initialGallery.length < 3 ? [...initialGallery, ...Array(3 - initialGallery.length).fill('')] : initialGallery,
    searchKeywords: initialKeywords,
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    slug: product?.slug || '',
    status: product?.status || 'Active'
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

  // Discount calculation
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

    const filteredGallery = formData.galleryImages.filter(Boolean)

    const updatedProduct = {
      ...product,
      title: formData.title.trim(),
      category: formData.category,
      brand: formData.brand.trim() || 'Bazario',
      qty: formData.qty || '1',
      unit: formData.unit || 'Units',
      price: formData.price,
      sellingPrice: formData.sellingPrice,
      image: filteredGallery[0] || product?.image || '/supermart-bg.jpg',
      galleryImages: filteredGallery.length > 0 ? filteredGallery : [product?.image || '/supermart-bg.jpg'],
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
      updatedAt: new Date().toISOString()
    }

    onSave(updatedProduct)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Product
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update catalog details, gallery photos, stock quantities, SEO tags & pricing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Single Unified Page Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Main Product Data */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Title */}
            <div>
              <InputField
                label="PRODUCT TITLE"
                placeholder="e.g. Amul Butter Pasteurized (500g Pack)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                helperText="Official product name displayed on website and app storefront"
                required
              />
            </div>

            {/* 2. Category & Brand in 2-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  CATEGORY <span className="text-rose-500">*</span>
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

              <div>
                <InputField
                  label="BRAND NAME"
                  placeholder="e.g. Amul / Fortune / Aashirvaad"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  helperText="Manufacturer or house brand name"
                />
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {BRAND_SUGGESTIONS.slice(0, 4).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, brand: b })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#064C23]/10 hover:text-[#064C23] text-slate-600 text-[10px] font-semibold transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Pricing & Stock Inventory Row */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <FontAwesomeIcon icon={faIndianRupeeSign} className="text-[#064C23] mr-1.5" />
                  Pricing & Stock Inventory
                </span>
                {discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {discountPercent}% OFF (Saves ₹{(regularPrice - sellingPrice).toFixed(2)})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField
                  label="MRP (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="275.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  icon={<FontAwesomeIcon icon={faIndianRupeeSign} className="text-xs text-slate-400" />}
                  required
                />

                <InputField
                  label="SELLING (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="245.00"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  icon={<FontAwesomeIcon icon={faIndianRupeeSign} className="text-xs text-[#064C23]" />}
                  required
                />

                <InputField
                  label="STOCK QTY"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="150"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    UNIT / PACK
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 cursor-pointer"
                  >
                    <option value="Units">Units (Pcs)</option>
                    <option value="1 kg">1 kg Pack</option>
                    <option value="500 g">500 g Pack</option>
                    <option value="250 g">250 g Pack</option>
                    <option value="1 L">1 Litre</option>
                    <option value="500 ml">500 ml</option>
                    <option value="5 kg">5 kg Bag</option>
                    <option value="10 kg">10 kg Bag</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Search Keywords */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                SEARCH KEYWORDS & TAGS
              </label>

              <div className="flex gap-2">
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
                    placeholder="Type keyword and press Add (e.g. butter, table butter)..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddKeyword}
                  icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
                >
                  Add
                </Button>
              </div>

              {formData.searchKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 min-h-[42px] items-center">
                  {formData.searchKeywords.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-white border border-[#064C23]/30 text-[#064C23] rounded-lg text-xs font-bold"
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
              )}

              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Add:</span>
                {['fresh', 'organic', 'grocery', 'pure', 'discount', 'daily-deal'].map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => handleAddSuggestedKeyword(suggested)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 text-[10px] font-semibold transition-colors"
                  >
                    +{suggested}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. SEO & Meta Tags */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <FontAwesomeIcon icon={faGlobe} className="text-[#064C23] mr-1.5" />
                SEO Search Optimization
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="META TITLE"
                  placeholder="e.g. Buy Amul Butter Online | Bazario"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  helperText="Search engine result title"
                />

                <InputField
                  label="URL SLUG"
                  placeholder="e.g. amul-pasteurized-butter-500g"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  helperText="Web permalink: /products/slug"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  META DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Order fresh Amul Pasteurized Butter 500g online from Bazario Supermarket with express delivery."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Gallery Images & Publishing Status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Select Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PRODUCT STATUS
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    formData.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {formData.status}
                </span>
              </div>

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 cursor-pointer"
              >
                <option value="Active">Active (Visible & Purchasable)</option>
                <option value="Inactive">Inactive (Hidden from Store)</option>
              </select>
              <p className="text-[11px] text-slate-400">Controls visibility on customer storefront</p>
            </div>

            {/* Product Gallery Images */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faImages} className="text-[#064C23] text-sm" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    GALLERY IMAGES
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGallerySlot}
                  icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
                >
                  Add Slot
                </Button>
              </div>

              {/* Primary Cover Image */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  ★ Primary Cover Photo (1:1)
                </span>
                <ImageUploadFrame
                  aspectRatio="square"
                  description="Upload main product square photo (PNG, JPG, max 5MB)"
                  value={formData.galleryImages[0] || ''}
                  onChange={(url) => handleGalleryChange(0, url)}
                />
              </div>

              {/* Additional Gallery Slots */}
              {formData.galleryImages.length > 1 && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase block">
                    Additional Gallery Angles ({formData.galleryImages.length - 1})
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {formData.galleryImages.slice(1).map((imgUrl, i) => {
                      const actualIdx = i + 1
                      return (
                        <div key={actualIdx} className="relative bg-white p-2.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">
                              Angle #{actualIdx}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGallerySlot(actualIdx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                              title="Remove slot"
                            >
                              <FontAwesomeIcon icon={faXmark} className="text-xs" />
                            </button>
                          </div>
                          <ImageUploadFrame
                            aspectRatio="square"
                            description=""
                            value={imgUrl}
                            onChange={(url) => handleGalleryChange(actualIdx, url)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
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
