import React, { useState, useMemo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faMagnifyingGlass,
  faEye,
  faPenToSquare,
  faTrashCan,
  faBoxesStacked,
  faTag,
  faFilter,
  faRotateRight,
  faImages,
  faIndianRupeeSign
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  Pagination
} from '../index'

// Helper to get initial page & limit from URL hash params or sessionStorage
const getInitialPage = () => {
  try {
    const hashQuery = window.location.hash.includes('?')
      ? window.location.hash.split('?')[1]
      : ''
    const params = new URLSearchParams(hashQuery || window.location.search)
    const pageParam = parseInt(params.get('page'), 10)
    if (pageParam && pageParam > 0) return pageParam

    const saved = parseInt(sessionStorage.getItem('bazario_products_page'), 10)
    if (saved && saved > 0) return saved
  } catch (e) {}
  return 1
}

const getInitialLimit = () => {
  try {
    const hashQuery = window.location.hash.includes('?')
      ? window.location.hash.split('?')[1]
      : ''
    const params = new URLSearchParams(hashQuery || window.location.search)
    const limitParam = parseInt(params.get('limit'), 10)
    if (limitParam && limitParam > 0) return limitParam

    const saved = parseInt(sessionStorage.getItem('bazario_products_limit'), 10)
    if (saved && saved > 0) return saved
  } catch (e) {}
  return 10
}

export default function ProductListView({
  products = [],
  totalItems: serverTotalItems,
  currentPage: serverCurrentPage,
  itemsPerPage: serverItemsPerPage,
  onPageChange: serverOnPageChange,
  onLimitChange: serverOnLimitChange,
  searchQuery: serverSearchQuery,
  onSearchChange: serverOnSearchChange,
  selectedCategory: serverSelectedCategory,
  onCategoryChange: serverOnCategoryChange,
  selectedBrand: serverSelectedBrand,
  onBrandChange: serverOnBrandChange,
  selectedStatus: serverSelectedStatus,
  onStatusChange: serverOnStatusChange,
  categoriesList: serverCategoriesList,
  loading = false,
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const isServerDriven = serverTotalItems !== undefined

  // Local state fallbacks if not server-driven
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [localSelectedCategory, setLocalSelectedCategory] = useState('all')
  const [localSelectedBrand, setLocalSelectedBrand] = useState('all')
  const [localSelectedStatus, setLocalSelectedStatus] = useState('all')
  const [localCurrentPage, setLocalCurrentPage] = useState(getInitialPage)
  const [localItemsPerPage, setLocalItemsPerPage] = useState(getInitialLimit)

  const searchQuery = isServerDriven ? (serverSearchQuery ?? '') : localSearchQuery
  const selectedCategory = isServerDriven ? (serverSelectedCategory ?? 'all') : localSelectedCategory
  const selectedBrand = isServerDriven ? (serverSelectedBrand ?? 'all') : localSelectedBrand
  const selectedStatus = isServerDriven ? (serverSelectedStatus ?? 'all') : localSelectedStatus
  const currentPage = isServerDriven ? (serverCurrentPage ?? 1) : localCurrentPage
  const itemsPerPage = isServerDriven ? (serverItemsPerPage ?? 10) : localItemsPerPage

  // Extract unique categories & brands for filter dropdowns
  const categoriesList = useMemo(() => {
    if (serverCategoriesList && Array.isArray(serverCategoriesList) && serverCategoriesList.length > 0) {
      return serverCategoriesList
    }
    const set = new Set()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [products, serverCategoriesList])

  const brandsList = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      if (p.brand) set.add(p.brand)
    })
    return Array.from(set)
  }, [products])

  // Filtered Products (if client-side) or pass-through (if server-side)
  const filteredProducts = useMemo(() => {
    if (isServerDriven) return products
    return products.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        (Array.isArray(item.searchKeywords) &&
          item.searchKeywords.some((k) => k.toLowerCase().includes(q))) ||
        (typeof item.searchKeywords === 'string' &&
          item.searchKeywords.toLowerCase().includes(q))

      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory
      const matchesBrand =
        selectedBrand === 'all' || item.brand === selectedBrand
      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus

      return matchesSearch && matchesCat && matchesBrand && matchesStatus
    })
  }, [isServerDriven, products, searchQuery, selectedCategory, selectedBrand, selectedStatus])

  const totalCount = isServerDriven ? serverTotalItems : filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedProducts = useMemo(() => {
    if (isServerDriven) return products
    const startIndex = (safeCurrentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [isServerDriven, products, filteredProducts, safeCurrentPage, itemsPerPage])

  // Handlers
  const handlePageChange = (newPage) => {
    if (isServerDriven && serverOnPageChange) {
      serverOnPageChange(newPage)
    } else {
      setLocalCurrentPage(newPage)
    }
  }

  const handleLimitChange = (newLimit) => {
    if (isServerDriven && serverOnLimitChange) {
      serverOnLimitChange(newLimit)
    } else {
      setLocalItemsPerPage(newLimit)
      setLocalCurrentPage(1)
    }
  }

  const handleSearchChange = (val) => {
    if (isServerDriven && serverOnSearchChange) {
      serverOnSearchChange(val)
    } else {
      setLocalSearchQuery(val)
      setLocalCurrentPage(1)
    }
  }

  const handleCategoryChange = (val) => {
    if (isServerDriven && serverOnCategoryChange) {
      serverOnCategoryChange(val)
    } else {
      setLocalSelectedCategory(val)
      setLocalCurrentPage(1)
    }
  }

  const handleBrandChange = (val) => {
    if (isServerDriven && serverOnBrandChange) {
      serverOnBrandChange(val)
    } else {
      setLocalSelectedBrand(val)
      setLocalCurrentPage(1)
    }
  }

  const handleStatusChange = (val) => {
    if (isServerDriven && serverOnStatusChange) {
      serverOnStatusChange(val)
    } else {
      setLocalSelectedStatus(val)
      setLocalCurrentPage(1)
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    if (isServerDriven) {
      if (serverOnSearchChange) serverOnSearchChange('')
      if (serverOnCategoryChange) serverOnCategoryChange('all')
      if (serverOnBrandChange) serverOnBrandChange('all')
      if (serverOnStatusChange) serverOnStatusChange('all')
      if (serverOnPageChange) serverOnPageChange(1)
    } else {
      setLocalSearchQuery('')
      setLocalSelectedCategory('all')
      setLocalSelectedBrand('all')
      setLocalSelectedStatus('all')
      setLocalCurrentPage(1)
    }
    try {
      sessionStorage.setItem('bazario_products_page', '1')
      const baseHash = window.location.hash.split('?')[0] || '#/products'
      window.history.replaceState(null, '', `${baseHash}?page=1&limit=${itemsPerPage}`)
    } catch (e) {}
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#064C23]/10 border border-[#064C23]/20 flex items-center justify-center text-[#064C23]">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Products Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage supermarket catalog inventory, pricing, gallery images, SEO metadata & search tags.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <Button
            variant="primary"
            size="md"
            onClick={onAddNew}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* Search Bar */}
          <div className="lg:col-span-4 relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title, brand, SKU or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brandsList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-1 flex items-center justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="w-full h-[42px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs font-bold cursor-pointer"
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-1.5 text-xs" />
              Reset
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing Page <span className="font-bold text-slate-900">{safeCurrentPage}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages}</span> ({totalCount.toLocaleString('en-IN')} matching products)
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              Active:{' '}
              <strong className="ml-1 text-slate-800">
                {products.filter((p) => p.status === 'Active').length}
              </strong>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-300 mr-1.5"></span>
              Inactive:{' '}
              <strong className="ml-1 text-slate-800">
                {products.filter((p) => p.status === 'Inactive').length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl">
              <FontAwesomeIcon icon={faBoxesStacked} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedStatus !== 'all'
                ? 'No catalog items match your current filter criteria. Try resetting or adjusting the filters.'
                : 'No products have been added yet. Click "Add Product" to create your first catalog item.'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedStatus !== 'all') ? (
              <Button size="sm" variant="outline" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button size="sm" variant="primary" onClick={onAddNew}>
                <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                Add Product
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Product Details</th>
                  <th className="py-3.5 px-4">Category & Brand</th>
                  <th className="py-3.5 px-4">Pricing (MRP / Selling)</th>
                  <th className="py-3.5 px-4">Stock Qty</th>
                  <th className="py-3.5 px-4">Gallery</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {paginatedProducts.map((prod) => {
                  const primaryImg =
                    prod.galleryImages?.[0] || prod.image || '/product-placeholder.svg'
                  const galleryCount = Array.isArray(prod.galleryImages)
                    ? prod.galleryImages.filter(Boolean).length
                    : (prod.image ? 1 : 0)

                  const regularPrice = parseFloat(prod.price) || 0
                  const sellPrice = parseFloat(prod.sellingPrice) || regularPrice
                  const discountPercent =
                    regularPrice > 0 && regularPrice > sellPrice
                      ? Math.round(((regularPrice - sellPrice) / regularPrice) * 100)
                      : 0

                  const keywords = Array.isArray(prod.searchKeywords)
                    ? prod.searchKeywords
                    : typeof prod.searchKeywords === 'string' && prod.searchKeywords.trim()
                    ? prod.searchKeywords.split(',').map((k) => k.trim())
                    : []

                  const qtyNum = parseInt(prod.qty, 10) || 0

                  return (
                    <tr
                      key={prod.id || prod._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Product Image & Title */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {primaryImg ? (
                              <img
                                src={primaryImg}
                                alt={prod.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/product-placeholder.svg'
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faBoxesStacked}
                                className="text-slate-400 text-lg"
                              />
                            )}
                            {discountPercent > 0 && (
                              <span className="absolute bottom-0 right-0 bg-[#A44F37] text-white text-[9px] font-black px-1 rounded-tl">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-[220px]">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {prod.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {prod.sku || `BZ-PRD-${String(prod.id || prod._id).slice(-4)}`}
                            </p>
                            {keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {keywords.slice(0, 2).map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                                  >
                                    #{kw}
                                  </span>
                                ))}
                                {keywords.length > 2 && (
                                  <span className="text-[10px] text-slate-400">
                                    +{keywords.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#064C23]/10 text-[#064C23] font-bold text-[11px]">
                            {prod.category || 'General'}
                          </span>
                          <div className="text-[11px] font-semibold text-slate-500">
                            Brand: <span className="text-slate-800">{prod.brand || 'Bazario'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Pricing: MRP & Selling */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-black text-slate-900">
                              ₹{sellPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            {discountPercent > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          {regularPrice > sellPrice && (
                            <div className="text-[11px] text-slate-400 line-through">
                              MRP: ₹{regularPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-4 px-4">
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {prod.qty || '0'} {prod.unit || 'Units'}
                          </div>
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-black uppercase mt-0.5 ${
                              qtyNum <= 0
                                ? 'bg-rose-100 text-rose-700'
                                : qtyNum <= 10
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {qtyNum <= 0 ? 'Out of Stock' : qtyNum <= 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                      </td>

                      {/* Gallery Images Count */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-600">
                          <FontAwesomeIcon icon={faImages} className="text-[#064C23] text-xs" />
                          <span className="font-bold text-xs">{galleryCount}</span>
                          <span className="text-[10px] text-slate-400">
                            {galleryCount === 1 ? 'photo' : 'photos'}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <ToggleButton
                            checked={prod.status === 'Active'}
                            onChange={() => onToggleStatus(prod.id || prod._id)}
                            size="sm"
                          />
                          <span
                            className={`text-[10px] font-bold mt-1 ${
                              prod.status === 'Active'
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {prod.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <ActionButton
                            action="view"
                            tooltip="View Details"
                            onClick={() => onView(prod._id || prod.id)}
                          />
                          <ActionButton
                            action="edit"
                            tooltip="Edit Product"
                            onClick={() => onEdit(prod._id || prod.id)}
                          />
                          <ActionButton
                            action="delete"
                            tooltip="Delete Product"
                            onClick={() => onDelete(prod._id || prod.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Centralized Pagination Bar */}
        {totalCount > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40">
            <Pagination
              currentPage={safeCurrentPage}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleLimitChange}
              itemsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>
    </div>
  )
}
