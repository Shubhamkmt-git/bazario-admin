import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxesStacked,
  faTriangleExclamation,
  faMagnifyingGlass,
  faFilter,
  faRotateRight,
  faPlus,
  faMinus,
  faCircleCheck,
  faBan,
  faWrench,
  faStore,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import {
  getStoreInventoryApi,
  updateStoreProductStockApi,
  adjustStoreStockApi,
  getStoreDetailsApi,
  updateStoreStatusApi,
  getAdminStoresApi
} from '../../utils/adminApi'
import Pagination from '../ui/Pagination'

export default function StoreInventoryView({ currentUser }) {
  const toast = useToast()
  const isSuperAdmin = currentUser?.role !== 'Store Manager'
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [storesList, setStoresList] = useState([])
  const [activeStoreId, setActiveStoreId] = useState(currentUser?.store?.id || currentUser?.storeId || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, lowStockOnly, activeStoreId])

  // Quick adjust modal state
  const [adjustModal, setAdjustModal] = useState({
    isOpen: false,
    item: null,
    adjustment: 0,
    reason: 'Stock Received'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch store inventory
  const fetchInventory = async (overrideStoreId) => {
    const storeIdToFetch = overrideStoreId || activeStoreId || undefined
    try {
      setLoading(true)
      const [invRes, storeRes] = await Promise.all([
        getStoreInventoryApi(storeIdToFetch ? { storeId: storeIdToFetch } : {}),
        getStoreDetailsApi(storeIdToFetch).catch(() => null)
      ])

      if (invRes && invRes.inventory) {
        setInventory(invRes.inventory)
        // Extract distinct categories
        const cats = Array.from(new Set(invRes.inventory.map(i => i.categoryName).filter(Boolean)))
        setCategories(cats)
      }

      if (storeRes && storeRes.store) {
        setStoreInfo(storeRes.store)
        if (!activeStoreId && storeRes.store.id) {
          setActiveStoreId(storeRes.store.id)
        }
      } else if (currentUser?.store) {
        setStoreInfo(currentUser.store)
      }
    } catch (err) {
      toast.error('Failed to Load Stock', err.message || 'Could not fetch store inventory.')
    } finally {
      setLoading(false)
    }
  }

  // Load stores list for Super Admin dropdown
  useEffect(() => {
    if (isSuperAdmin) {
      getAdminStoresApi()
        .then((res) => {
          const list = res.stores || res.data || []
          setStoresList(list)
          if (list.length > 0 && !activeStoreId) {
            setActiveStoreId(list[0].id)
          }
        })
        .catch(() => {})
    }
  }, [isSuperAdmin])

  useEffect(() => {
    fetchInventory(activeStoreId)
  }, [activeStoreId])

  // Quick Inline Stock Update
  const handleInlineStockChange = async (productId, newStock) => {
    if (newStock < 0) return
    try {
      // Optimistic update
      setInventory(prev => prev.map(item => {
        if (item.productId === productId) {
          return {
            ...item,
            stock: newStock,
            availableStock: Math.max(0, newStock - item.reservedStock),
            isLowStock: newStock <= item.lowStockThreshold
          }
        }
        return item
      }))

      await updateStoreProductStockApi(productId, { stock: newStock }, activeStoreId)
      toast.success('Stock Updated', `Product stock set to ${newStock} units.`)
    } catch (err) {
      toast.error('Update Failed', err.message || 'Could not update stock.')
      fetchInventory(activeStoreId)
    }
  }

  // Toggle In-Stock / Out-of-Stock for this Branch
  const handleToggleAvailability = async (productId, currentAvailability) => {
    const nextAvailability = !currentAvailability
    try {
      setInventory(prev => prev.map(item => {
        if (item.productId === productId) {
          return { ...item, isAvailable: nextAvailability }
        }
        return item
      }))

      await updateStoreProductStockApi(productId, { isAvailable: nextAvailability }, activeStoreId)
      toast.success(
        nextAvailability ? 'Product Enabled' : 'Marked Out of Stock',
        `Availability changed for your supermarket branch.`
      )
    } catch (err) {
      toast.error('Toggle Failed', err.message)
      fetchInventory(activeStoreId)
    }
  }

  // Submit stock adjustment
  const handleAdjustmentSubmit = async (e) => {
    e.preventDefault()
    if (!adjustModal.item || !adjustModal.adjustment) {
      toast.error('Invalid Adjustment', 'Please specify a non-zero adjustment amount.')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await adjustStoreStockApi(
        adjustModal.item.productId,
        parseInt(adjustModal.adjustment),
        adjustModal.reason,
        activeStoreId
      )
      toast.success('Adjustment Applied', res.message || 'Stock adjusted successfully.')
      setAdjustModal({ isOpen: false, item: null, adjustment: 0, reason: 'Stock Received' })
      fetchInventory(activeStoreId)
    } catch (err) {
      toast.error('Adjustment Failed', err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle Branch Status (Open / Closed)
  const handleToggleStoreStatus = async () => {
    if (!storeInfo) return
    const nextStatus = storeInfo.status === 'Open' ? 'Closed' : 'Open'
    try {
      await updateStoreStatusApi(nextStatus, activeStoreId)
      setStoreInfo(prev => ({ ...prev, status: nextStatus }))
      toast.success('Branch Status Changed', `Supermarket branch is now ${nextStatus}.`)
    } catch (err) {
      toast.error('Status Change Failed', err.message)
    }
  }

  // Filter products
  const filteredItems = inventory.filter(item => {
    const matchesSearch = !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || item.categoryName === selectedCategory
    const matchesLowStock = !lowStockOnly || item.isLowStock

    return matchesSearch && matchesCategory && matchesLowStock
  })

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const paginatedItems = filteredItems.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  )

  const lowStockCount = inventory.filter(i => i.isLowStock).length

  return (
    <div className="space-y-6 pb-20 font-roboto">
      {/* 1. Branch Header & Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064C23] to-[#0A6831] text-white flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0">
            <FontAwesomeIcon icon={faStore} className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {storeInfo?.name || currentUser?.store?.name || 'Assigned Supermarket'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-[#064C23] border border-emerald-300">
                {storeInfo?.code || currentUser?.store?.code || 'BRANCH'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              📍 {storeInfo?.address || 'Branch Dark Store'}, {storeInfo?.city || 'Noida'} | Hours: {storeInfo?.operatingHours || '7 AM - 11 PM'}
            </p>
          </div>
        </div>

        {/* Quick Branch Operational Controls & Switcher */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Branch Selector for Super Admin */}
          {isSuperAdmin && storesList.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Store:</span>
              <select
                value={activeStoreId}
                onChange={(e) => setActiveStoreId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {storesList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.title || st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-600 mr-2.5 uppercase tracking-wider">Branch Status:</span>
            <button
              type="button"
              onClick={handleToggleStoreStatus}
              className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                storeInfo?.status === 'Open'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {storeInfo?.status || 'Open'} ⚡
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchInventory(activeStoreId)}
            disabled={loading}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faRotateRight} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh Stock</span>
          </button>
        </div>
      </div>

      {/* 2. Low Stock Alert Banner (if any) */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-base" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-900">
                Low Stock Warning: {lowStockCount} Products Below Threshold (&lt; 10 units)
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Adjust stock count or notify Super Admin warehouse to restock this branch.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              lowStockOnly
                ? 'bg-amber-600 text-white'
                : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            {lowStockOnly ? 'Show All Products' : 'Filter Low Stock Only'}
          </button>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or brand..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:bg-white text-slate-800"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 cursor-pointer"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
            {filteredItems.length} Products
          </span>
        </div>
      </div>

      {/* 4. Branch Stock Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price / MRP</th>
                <th className="py-4 px-4 text-center">Current Branch Stock</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Store Availability</th>
                <th className="py-4 px-6 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    <FontAwesomeIcon icon={faRotateRight} className="animate-spin mr-2" />
                    Loading branch stock inventory...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    No products matching your search or filters in this store.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-slate-50/70 transition-colors">
                    {/* Product Info */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0"
                          onError={(e) => { e.target.src = '/default-product.png' }}
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 line-clamp-1">{item.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.brand && <span className="font-semibold text-slate-600">{item.brand} • </span>}
                            <span>{item.weight || '1 pc'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {item.categoryName}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">₹{item.price}</div>
                      <div className="text-[11px] text-slate-400 line-through">₹{item.mrp}</div>
                    </td>

                    {/* Stock Control Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleInlineStockChange(item.productId, item.stock - 1)}
                          disabled={item.stock <= 0}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer shadow-xs"
                          title="Decrease 1 unit"
                        >
                          <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0
                            handleInlineStockChange(item.productId, val)
                          }}
                          className="w-14 text-center font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => handleInlineStockChange(item.productId, item.stock + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#064C23] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Increase 1 unit"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                        </button>
                      </div>
                    </td>

                    {/* Stock Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      {item.stock === 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      ) : item.isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                          Low: {item.stock} Left
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-[#064C23] border border-emerald-200">
                          In Stock ({item.stock})
                        </span>
                      )}
                    </td>

                    {/* Store Availability Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(item.productId, item.isAvailable)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          item.isAvailable
                            ? 'bg-emerald-50 text-[#064C23] border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {item.isAvailable ? 'Available 🟢' : 'Disabled 🔴'}
                      </button>
                    </td>

                    {/* Stock Action / Audit Button */}
                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setAdjustModal({
                          isOpen: true,
                          item,
                          adjustment: 0,
                          reason: 'Stock Received'
                        })}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#064C23] hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5 shadow-xs"
                      >
                        <FontAwesomeIcon icon={faWrench} className="text-[10px]" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Centralized Pagination Bar */}
        {filteredItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40">
            <Pagination
              currentPage={safeCurrentPage}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(limit) => {
                setItemsPerPage(limit)
                setCurrentPage(1)
              }}
              itemsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* 5. Stock Adjustment Modal */}
      {adjustModal.isOpen && adjustModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#064C23] text-white flex items-center justify-center">
                  <FontAwesomeIcon icon={faBoxesStacked} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Branch Stock Adjustment</h3>
                  <p className="text-xs text-slate-500">{adjustModal.item.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdjustModal({ isOpen: false, item: null, adjustment: 0, reason: 'Stock Received' })}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Branch Stock: <span className="text-[#064C23] text-sm font-black">{adjustModal.item.stock} Units</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adjustment Units (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  required
                  value={adjustModal.adjustment}
                  onChange={(e) => setAdjustModal(prev => ({ ...prev, adjustment: e.target.value }))}
                  placeholder="e.g. +10 or -3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#064C23]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Adjustment
                </label>
                <select
                  value={adjustModal.reason}
                  onChange={(e) => setAdjustModal(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 cursor-pointer"
                >
                  <option value="Stock Received">📦 Stock Received from Supplier/Dark Store</option>
                  <option value="Damaged in store">💥 Damaged / Broken in Store</option>
                  <option value="Expired Product">⏳ Expired Product Discarded</option>
                  <option value="Physical Audit Correction">🔍 Physical Stock Count Audit Correction</option>
                  <option value="Customer Return">🔄 Customer Return Received</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAdjustModal({ isOpen: false, item: null, adjustment: 0, reason: 'Stock Received' })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !adjustModal.adjustment}
                  className="px-5 py-2.5 rounded-xl bg-[#064C23] hover:bg-[#0A6831] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Applying...' : 'Apply Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
