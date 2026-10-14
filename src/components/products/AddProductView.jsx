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
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTrashCan,
  faClock,
  faCircleCheck,
  faFileLines
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

const SECTIONS = [
  { id: 1, step: 1, title: '1. Details', subtitle: 'Title & Brand' },
  { id: 2, step: 2, title: '2. Pricing', subtitle: 'Price & Stock' },
  { id: 3, step: 3, title: '3. Media', subtitle: 'Cover & Gallery' },
  { id: 4, step: 4, title: '4. Content', subtitle: 'Overview & Synopsis' },
  { id: 5, step: 5, title: '5. SEO', subtitle: 'Meta & Visibility' },
]

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

const UNIT_OPTIONS = [
  'Units',
  'Grams (g)',
  'Kilograms (kg)',
  'Millilitres (ml)',
  'Litres (L)',
  'Packs',
  'Pieces'
]

export default function AddProductView({ onBack, onSave }) {
  const toast = useToast()

  const [activeSection, setActiveSection] = useState(1)

  const [formData, setFormData] = useState({
    title: '',
    category: 'Fresh Fruits & Vegetables',
    brand: '',
    sku: '',
    weight: '1 unit',
    unit: 'Units',
    price: '',
    sellingPrice: '',
    qty: '100',
    stock: 100,
    time: '10 MINS',
    image: '',
    galleryImages: ['', '', ''],
    synopsis: '',
    description: '',
    highlights: ['100% Fresh & Authentic', 'Hygienically Packed'],
    storageInstructions: 'Store in a cool and dry place away from direct sunlight.',
    searchKeywords: [],
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'Active',
    isFeatured: false
  })

  const [keywordInput, setKeywordInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')

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

  // Add highlight bullet
  const handleAddHighlight = (e) => {
    e?.preventDefault?.()
    const trimmed = highlightInput.trim()
    if (!trimmed) return
    setFormData((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), trimmed]
    }))
    setHighlightInput('')
  }

  const handleRemoveHighlight = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Update specific gallery image slot
  const handleGalleryChange = (index, url) => {
    const updated = [...formData.galleryImages]
    updated[index] = url
    setFormData({
      ...formData,
      galleryImages: updated,
      image: index === 0 ? url : formData.image || url
    })
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

  // Auto-generate slug from title
  const handleGenerateSlug = () => {
    if (!formData.title.trim()) {
      toast.info('Title Required', 'Please enter a product title first.')
      return
    }
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData((prev) => ({ ...prev, slug: generated }))
    toast.success('Slug Generated', `URL slug set to: ${generated}`)
  }

  // Calculate pricing & discount
  const regularPrice = parseFloat(formData.price) || 0
  const sellingPrice = parseFloat(formData.sellingPrice) || 0
  const discountPercent =
    regularPrice > 0 && regularPrice > sellingPrice && sellingPrice > 0
      ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
      : 0
  const savingsAmount = regularPrice > sellingPrice ? regularPrice - sellingPrice : 0

  // Validate current section before moving forward
  const validateSection = (secId) => {
    if (secId === 1) {
      if (!formData.title.trim()) {
        toast.error('Validation Error', 'Please enter a product title before proceeding.')
        return false
      }
    }
    if (secId === 2) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Validation Error', 'Please enter a valid MRP price in ₹.')
        return false
      }
      if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
        toast.error('Validation Error', 'Please enter a valid selling price in ₹.')
        return false
      }
    }
    return true
  }

  const handleNextSection = () => {
    if (!validateSection(activeSection)) return
    if (activeSection < 5) {
      setActiveSection((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevSection = () => {
    if (activeSection > 1) {
      setActiveSection((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title.trim()) {
      setActiveSection(1)
      toast.error('Validation Error', 'Please enter a product title in Section 1.')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setActiveSection(2)
      toast.error('Validation Error', 'Please enter a valid MRP price in Section 2.')
      return
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      setActiveSection(2)
      toast.error('Validation Error', 'Please enter a valid selling price in Section 2.')
      return
    }

    const filteredGallery = formData.galleryImages.filter(Boolean)
    const primaryImg = formData.image || filteredGallery[0] || '/product-placeholder.svg'

    const newProduct = {
      id: Date.now(),
      title: formData.title.trim(),
      name: formData.title.trim(),
      category: formData.category,
      categoryTitle: formData.category,
      categoryId: formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: formData.brand.trim() || 'Bazario Fresh',
      sku: formData.sku.trim() || `BZ-PRD-${String(Date.now()).slice(-6)}`,
      weight: formData.weight.trim() || '1 unit',
      unit: formData.unit || 'Units',
      price: regularPrice,
      mrp: regularPrice,
      sellingPrice: sellingPrice,
      discount: discountPercent > 0 ? `${discountPercent}% OFF` : null,
      qty: formData.qty || '100',
      stock: parseInt(formData.qty, 10) || 100,
      inStock: (parseInt(formData.qty, 10) || 0) > 0,
      time: formData.time || '10 MINS',
      image: primaryImg,
      gallery: filteredGallery.length > 0 ? filteredGallery : [primaryImg],
      galleryImages: filteredGallery.length > 0 ? filteredGallery : [primaryImg],
      synopsis: formData.synopsis.trim(),
      description: formData.description.trim() || formData.synopsis.trim() || formData.title.trim(),
      highlights: formData.highlights,
      tags: formData.searchKeywords,
      searchKeywords: formData.searchKeywords,
      metaTitle: formData.metaTitle.trim() || formData.title.trim(),
      metaDescription: formData.metaDescription.trim() || formData.synopsis.trim(),
      slug:
        formData.slug.trim() ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      status: formData.status,
      isFeatured: formData.isFeatured,
      createdAt: new Date().toISOString()
    }

    onSave(newProduct)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Add New Product
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/20">
                Step {activeSection} of 5
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              5-Section catalog builder: Details, Pricing, Media, Content & SEO settings.
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

      {/* 5 Sections Tab Bar (Matching Reference Design) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                if (activeSection !== sec.id) {
                  setActiveSection(sec.id)
                }
              }}
              className={`group flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                isActive
                  ? 'border-[#064C23] bg-[#064C23]/5 ring-4 ring-[#064C23]/15 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#064C23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {sec.step}
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs sm:text-sm font-bold truncate ${
                    isActive ? 'text-[#064C23]' : 'text-slate-800'
                  }`}
                >
                  {sec.title}
                </div>
                <div className="text-[11px] font-medium text-slate-400 truncate">
                  {sec.subtitle}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">

        {/* ========================================================
            SECTION 1: DETAILS (Title, Brand, Category, SKU, Pack)
        ======================================================== */}
        {activeSection === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">1. Product Details</h2>
              <p className="text-xs text-slate-500">
                Specify essential catalog identity including title, category department, brand, and pack specifications.
              </p>
            </div>

            {/* Product Title */}
            <div>
              <InputField
                label="PRODUCT TITLE"
                placeholder="e.g. Amul Pure Ghee (1 Litre Tin Pack)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                helperText="Official product name displayed on storefront, search, and invoices"
                required
              />
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                <p className="text-[11px] text-slate-400 mt-1">Supermarket grocery category</p>
              </div>

              <div>
                <InputField
                  label="BRAND NAME"
                  placeholder="e.g. Amul / Fortune / Aashirvaad"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  helperText="Manufacturer or brand label"
                />
              </div>
            </div>

            {/* Brand Quick Suggestions */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-2">Quick Popular Brands:</p>
              <div className="flex flex-wrap gap-1.5">
                {BRAND_SUGGESTIONS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, brand: b })}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      formData.brand === b
                        ? 'bg-[#064C23] text-white border-[#064C23] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* SKU, Unit Weight & Measurement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              <div>
                <InputField
                  label="SKU / ITEM CODE"
                  placeholder="e.g. BZ-PRD-1042"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  helperText="Unique SKU identifier code"
                />
              </div>

              <div>
                <InputField
                  label="PACK SIZE / NET WEIGHT"
                  placeholder="e.g. 500g / 1 Litre / Pack of 2"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  helperText="Physical weight or volume"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  UNIT OF MEASURE
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Inventory measurement unit</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 2: PRICING (MRP, Selling Price, Discount, Stock)
        ======================================================== */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">2. Pricing & Inventory</h2>
              <p className="text-xs text-slate-500">
                Configure MRP, selling price with automatic discount calculation, stock quantity, and delivery estimates.
              </p>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <InputField
                  label="REGULAR MRP (₹)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 450.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  helperText="Printed Maximum Retail Price"
                  required
                />
              </div>

              <div>
                <InputField
                  label="SELLING / OFFER PRICE (₹)"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 380.00"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  helperText="Actual discounted customer billing price"
                  required
                />
              </div>
            </div>

            {/* Live Pricing & Discount Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#064C23]/5 to-emerald-50/50 border border-[#064C23]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#064C23]">
                  Live Pricing Calculation
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{sellingPrice > 0 ? sellingPrice.toFixed(2) : '0.00'}
                  </span>
                  {regularPrice > sellingPrice && regularPrice > 0 && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      MRP ₹{regularPrice.toFixed(2)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-[#064C23] text-white shadow-xs">
                      <FontAwesomeIcon icon={faPercent} className="text-[10px] mr-1" />
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-emerald-200/80 sm:pl-6">
                <p className="text-xs font-semibold text-slate-500">Customer Savings:</p>
                <p className="text-lg font-black text-emerald-700">
                  ₹{savingsAmount > 0 ? savingsAmount.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            {/* Stock, Delivery Time & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              <div>
                <InputField
                  label="AVAILABLE STOCK QUANTITY"
                  type="number"
                  placeholder="e.g. 100"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  helperText="Units in supermarket warehouse"
                  required
                />
              </div>

              <div>
                <InputField
                  label="DELIVERY SPEED / TIME"
                  placeholder="e.g. 10 MINS / Express"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  helperText="Promised instant delivery ETA"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  INVENTORY STATUS
                </label>
                <div className="flex items-center space-x-2 h-11">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qty: '50' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      parseInt(formData.qty, 10) > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    In Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qty: '0' })}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      parseInt(formData.qty, 10) === 0
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    Out of Stock
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Quick stock state switch</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 3: MEDIA (Cover Photo & Multi-Image Gallery)
        ======================================================== */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">3. Media & Product Gallery</h2>
              <p className="text-xs text-slate-500">
                Upload primary thumbnail photo and secondary gallery views for storefront cards and modal previews.
              </p>
            </div>

            {/* Primary Cover Image Frame */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                PRIMARY COVER PHOTO <span className="text-rose-500">*</span>
              </label>
              <div className="max-w-md">
                <ImageUploadFrame
                  label="Upload Primary Cover Image"
                  value={formData.galleryImages[0] || formData.image}
                  onChange={(url) => handleGalleryChange(0, url)}
                  helperText="Primary storefront thumbnail. Recommended 800x800px square format."
                />
              </div>
            </div>

            {/* Additional Gallery Photos */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Additional Gallery Photos</h3>
                  <p className="text-xs text-slate-500">
                    Extra angle shots, packaging info, and nutrition labels
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGallerySlot}
                  icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
                >
                  Add Image Slot
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {formData.galleryImages.slice(1).map((imgUrl, idx) => {
                  const actualIndex = idx + 1
                  return (
                    <div key={actualIndex} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Gallery Slot #{actualIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGallerySlot(actualIndex)}
                          className="text-slate-400 hover:text-rose-600 text-xs cursor-pointer p-1"
                          title="Remove Slot"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>

                      <ImageUploadFrame
                        label={`Photo #${actualIndex + 1}`}
                        value={imgUrl}
                        onChange={(url) => handleGalleryChange(actualIndex, url)}
                        helperText="Additional perspective image"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 4: CONTENT (Overview, Description, Highlights)
        ======================================================== */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">4. Content & Specifications</h2>
              <p className="text-xs text-slate-500">
                Write a compelling synopsis, detailed product description, key highlights, and storage guidelines.
              </p>
            </div>

            {/* Short Synopsis / Overview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                SHORT SYNOPSIS / OVERVIEW
              </label>
              <textarea
                rows={2}
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Brief 1-2 sentence overview shown in quick-view popups and search snippets..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Concise elevator pitch for quick customer decision making
              </p>
            </div>

            {/* Full Product Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                DETAILED PRODUCT DESCRIPTION
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed information regarding taste, culinary uses, origin, ingredients, and pack contents..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered on the full product details page
              </p>
            </div>

            {/* Key Highlights Bullet Points */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                KEY FEATURES & HIGHLIGHTS
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddHighlight(e)
                    }
                  }}
                  placeholder="e.g. Rich in Omega-3 / No added preservatives..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddHighlight}
                  icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
                >
                  Add Bullet
                </Button>
              </div>

              <div className="space-y-2">
                {formData.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#064C23]" />
                      {h}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Instructions */}
            <div>
              <InputField
                label="STORAGE & USAGE INSTRUCTIONS"
                placeholder="e.g. Keep refrigerated below 4°C. Consume within 7 days."
                value={formData.storageInstructions}
                onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
                helperText="Guidelines on optimal freshness storage"
              />
            </div>
          </div>
        )}

        {/* ========================================================
            SECTION 5: SEO (Meta Title, Description, Slug, Keywords)
        ======================================================== */}
        {activeSection === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">5. SEO, Search Tags & Visibility</h2>
              <p className="text-xs text-slate-500">
                Enhance organic search rankings, URL permalink slug, search keywords, and store visibility.
              </p>
            </div>

            {/* Slug URL with auto generator */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL SLUG PERMALINK
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-[#064C23]">
                  <span className="px-3 text-xs font-mono text-slate-400 bg-slate-100/80 border-r border-slate-200 py-2.5">
                    /product/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="amul-pure-ghee-1l"
                    className="flex-1 px-3 py-2 text-xs font-mono font-medium text-slate-800 outline-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSlug}
                >
                  Generate from Title
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">SEO canonical web link</p>
            </div>

            {/* Meta Title & Meta Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <InputField
                  label="META TITLE"
                  placeholder="e.g. Buy Amul Pure Ghee Online at Best Price | Bazario"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  helperText="Search engine result page title (< 60 chars)"
                />
              </div>

              <div>
                <InputField
                  label="META DESCRIPTION"
                  placeholder="e.g. Order fresh Amul Pure Ghee 1L online at discounted price with 10-minute delivery."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  helperText="Search snippet summary text"
                />
              </div>
            </div>

            {/* Search Keywords / Tags */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                SEARCH KEYWORDS & TAGS
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddKeyword(e)
                    }
                  }}
                  placeholder="Type search keyword and press Enter..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddKeyword}
                  icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
                >
                  Add Tag
                </Button>
              </div>

              {formData.searchKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.searchKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/20 text-xs font-bold"
                    >
                      <span>#{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(idx)}
                        className="text-[#064C23] hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-semibold text-slate-400">Suggestions:</span>
                {['fresh', 'organic', 'grocery', 'dairy', 'daily-needs', 'bestseller'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddSuggestedKeyword(tag)}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility & Featured Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  STORE STATUS
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Active' })}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'Active'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Active / Live
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'Inactive'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Draft / Hidden
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  HOMEPAGE PROMOTION
                </label>
                <label className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#064C23] rounded focus:ring-[#064C23] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Featured Product</span>
                    <p className="text-[11px] text-slate-400">Show on homepage featured sections</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section Navigation Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {activeSection > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handlePrevSection}
                icon={<FontAwesomeIcon icon={faArrowLeft} className="text-xs mr-1" />}
              >
                Previous: {SECTIONS[activeSection - 2]?.title}
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="md" onClick={onBack}>
                Cancel
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {activeSection < 5 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextSection}
                icon={<FontAwesomeIcon icon={faArrowRight} className="text-xs ml-1" />}
              >
                Next: {SECTIONS[activeSection]?.title}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                icon={<FontAwesomeIcon icon={faCheck} className="text-xs mr-1" />}
              >
                Save & Publish Product
              </Button>
            )}
          </div>
        </div>

      </form>
    </div>
  )
}
