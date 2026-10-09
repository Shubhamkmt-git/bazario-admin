import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faBoxesStacked,
  faIndianRupeeSign,
  faTag,
  faImages,
  faGlobe,
  faCircleCheck,
  faTriangleExclamation,
  faLayerGroup,
  faMagnifyingGlass,
  faBarcode,
  faTruck
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  BackButton
} from '../index'

export default function ProductDetailsView({ product, onBack, onEdit }) {
  const gallery = Array.isArray(product?.galleryImages) && product.galleryImages.length > 0
    ? product.galleryImages.filter(Boolean)
    : product?.image
    ? [product.image]
    : ['/supermart-bg.jpg']

  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-2xl text-slate-400">
          <FontAwesomeIcon icon={faBoxesStacked} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The requested product could not be located or may have been removed.
        </p>
        <Button variant="primary" size="md" onClick={onBack}>
          Back to Products List
        </Button>
      </div>
    )
  }

  const regularPrice = parseFloat(product.price) || 0
  const sellingPrice = parseFloat(product.sellingPrice) || regularPrice
  const discountPercent =
    regularPrice > 0 && regularPrice > sellingPrice
      ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
      : 0
  const savings = regularPrice > sellingPrice ? regularPrice - sellingPrice : 0

  const keywords = Array.isArray(product.searchKeywords)
    ? product.searchKeywords
    : typeof product.searchKeywords === 'string' && product.searchKeywords.trim()
    ? product.searchKeywords.split(',').map((k) => k.trim())
    : []

  const qtyNum = parseInt(product.qty, 10) || 0

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                SKU: {product.sku || `BZ-PRD-${String(product.id).slice(-4)}`}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  product.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    product.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {product.status || 'Active'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {product.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Back to List
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onEdit(product.id)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Product
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Gallery + Details, Right Stats & SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Photo Gallery & Core Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Gallery Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <FontAwesomeIcon icon={faImages} className="text-[#064C23] mr-2" />
                Product Photo Gallery ({gallery.length} Images)
              </span>
              <span className="text-xs text-slate-400">
                Viewing Photo {activeImageIndex + 1} of {gallery.length}
              </span>
            </div>

            {/* Main Stage Image */}
            <div className="w-full aspect-video sm:aspect-[16/9] max-h-[420px] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
              <img
                src={gallery[activeImageIndex] || '/supermart-bg.jpg'}
                alt={product.title}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.src = '/supermart-bg.jpg'
                }}
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-[#A44F37] text-white rounded-xl text-xs font-black shadow-md">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            {gallery.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto py-2 scrollbar-thin">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition-all p-1 bg-white ${
                      activeImageIndex === idx
                        ? 'border-[#064C23] ring-4 ring-[#064C23]/10 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img || '/supermart-bg.jpg'}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Specifications Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="text-[#064C23] mr-2" />
              Pricing & Inventory Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  MRP (Regular Price)
                </span>
                <div className="text-xl font-black text-slate-700">
                  ₹{regularPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-slate-400">Printed manufacturer price</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Selling Price (Offer)
                </span>
                <div className="text-2xl font-black text-[#064C23]">
                  ₹{sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Customer saves ₹{savings.toFixed(2)} ({discountPercent}% OFF)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Warehouse Stock
                </span>
                <div className="text-xl font-black text-slate-900">
                  {product.qty || 0} <span className="text-sm font-semibold text-slate-500">{product.unit || 'Units'}</span>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      qtyNum <= 0
                        ? 'bg-rose-100 text-rose-700'
                        : qtyNum <= 10
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {qtyNum <= 0 ? 'Out of Stock' : qtyNum <= 10 ? 'Low Stock Alert' : 'In Stock & Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Search Keywords Section */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <FontAwesomeIcon icon={faTag} className="text-amber-600 mr-2" />
                Indexed Search Keywords & Tags
              </span>
              {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No search keywords assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metadata & SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Brand Metadata */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Classification
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 inline-block bg-[#064C23]/10 text-[#064C23] px-2.5 py-1 rounded-lg">
                  {product.category || 'General'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Brand</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {product.brand || 'Bazario'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Measurement / Pack Size</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {product.unit || '1 Unit'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Internal SKU</span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded mt-0.5 inline-block">
                  {product.sku || `BZ-PRD-${String(product.id).slice(-4)}`}
                </span>
              </div>
            </div>
          </div>

          {/* SEO Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <FontAwesomeIcon icon={faGlobe} className="text-indigo-600 text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                SEO Search Appearance
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Meta Title</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {product.metaTitle || product.title}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Canonical URL Slug</span>
                <p className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded mt-0.5 truncate">
                  /products/{product.slug || 'product-slug'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Meta Description</span>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-3">
                  {product.metaDescription ||
                    `Buy ${product.title} online at best price from Bazario Supermarket with quick delivery.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
