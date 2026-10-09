import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTags,
  faPlus,
  faEye,
  faPenToSquare,
  faTrashCan,
  faFloppyDisk,
  faStar,
  faSearch,
  faFilter,
  faCircleCheck,
  faBoxesStacked,
  faShapes
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  ImageUploadFrame,
  AlertModal,
  BackButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_CATEGORIES = [
  {
    id: 1,
    title: 'Farm-Fresh Fruits & Vegetables',
    subtitle: '100% Direct from local farms with morning freshness check',
    sortingOrder: 1,
    status: 'Active',
    isFeatured: true,
    description: 'Crisp green vegetables, root produce, seasonal tropical fruits, and certified organic herbs harvested daily for optimal freshness and nutrition.'
  },
  {
    id: 2,
    title: 'Dairy, Bread & Morning Eggs',
    subtitle: 'Fresh cow milk, artisan breads, paneer, curd & farm eggs',
    sortingOrder: 2,
    status: 'Active',
    isFeatured: true,
    description: 'Pure pasteurized whole milk, fresh butter, cultured probiotic yogurt, cottage cheese (paneer), sourdough loaves, and high-protein farm eggs delivered fresh daily.'
  },
  {
    id: 3,
    title: 'Atta, Rice & Daily Grains',
    subtitle: 'Chakki fresh whole wheat atta, aged basmati rice & pulses',
    sortingOrder: 3,
    status: 'Active',
    isFeatured: true,
    description: 'Premium multigrain and whole wheat flour, unpolished lentils (dals), long-grain royal basmati rice, organic millets, and staple grains for everyday Indian cooking.'
  },
  {
    id: 4,
    title: 'Cooking Oils, Ghee & Spices',
    subtitle: 'Cold-pressed mustard oil, pure desi cow ghee & whole spices',
    sortingOrder: 4,
    status: 'Active',
    isFeatured: false,
    description: 'Kachi ghani mustard oil, extra virgin olive oil, traditional bilona A2 cow ghee, whole aromatic spices, turmeric, and authentic blended masalas.'
  },
  {
    id: 5,
    title: 'Snacks, Munchies & Biscuits',
    subtitle: 'Crispy namkeens, healthy roasted nuts & artisan cookies',
    sortingOrder: 5,
    status: 'Active',
    isFeatured: true,
    description: 'Traditional Indian savory snacks, roasted seeds, dry fruits, digestive biscuits, potato crisps, and gourmet tea-time cookies for the whole family.'
  },
  {
    id: 6,
    title: 'Beverages & Instant Drinks',
    subtitle: 'Fresh fruit juices, single-origin tea, filter coffee & energy sips',
    sortingOrder: 6,
    status: 'Active',
    isFeatured: false,
    description: 'Natural cold-pressed juices, tender coconut water, premium Assam and Darjeeling CTC tea leaves, South Indian filter coffee blend, and sparkling beverages.'
  },
  {
    id: 7,
    title: 'Household & Cleaning Essentials',
    subtitle: 'Surface cleaners, dishwashing bars, laundry detergents & care',
    sortingOrder: 7,
    status: 'Active',
    isFeatured: false,
    description: 'Eco-friendly floor cleaners, fabric conditioners, heavy-duty laundry powders, utensil scrubs, disinfectant sprays, and waste disposal liners.'
  },
  {
    id: 8,
    title: 'Personal Care & Hygiene',
    subtitle: 'Ayurvedic soaps, shampoos, oral care & grooming essentials',
    sortingOrder: 8,
    status: 'Inactive',
    isFeatured: false,
    description: 'Herbal body washes, natural bathing bars, hair oils, therapeutic toothpastes, moisturizers, and personal grooming supplies for daily wellness.'
  }
]

export default function ProductCategoriesView() {
  const toast = useToast()

  // State: Categories List
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('bazario_product_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })

  // Subpage Navigation: 'index' | 'add' | 'edit' | 'view'
  const [pageMode, setPageMode] = useState('index')
  const [activeCategory, setActiveCategory] = useState(null)

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Active' | 'Inactive'
  const [featuredFilter, setFeaturedFilter] = useState('all') // 'all' | 'featured' | 'standard'

  // Delete Alert Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortingOrder: 1,
    status: 'Active',
    isFeatured: false,
    image: '',
    description: ''
  })

  // Save to LocalStorage
  const saveToStorage = (updated) => {
    setCategories(updated)
    localStorage.setItem('bazario_product_categories', JSON.stringify(updated))
  }

  // Quick Toggle Status in List
  const handleToggleStatus = (category) => {
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active'
    const updated = categories.map((c) =>
      c.id === category.id ? { ...c, status: newStatus } : c
    )
    saveToStorage(updated)
    if (activeCategory?.id === category.id) {
      setActiveCategory({ ...activeCategory, status: newStatus })
    }
    toast.info('Category Status', `"${category.title}" is now ${newStatus}.`)
  }

  // Quick Toggle Is Featured in List
  const handleToggleFeatured = (category) => {
    const updated = categories.map((c) =>
      c.id === category.id ? { ...c, isFeatured: !c.isFeatured } : c
    )
    saveToStorage(updated)
    if (activeCategory?.id === category.id) {
      setActiveCategory({ ...activeCategory, isFeatured: !activeCategory.isFeatured })
    }
    toast.success('Featured Status', `"${category.title}" ${!category.isFeatured ? 'marked as Featured' : 'removed from Featured'}.`)
  }

  // Open Add Page
  const handleOpenAdd = () => {
    setActiveCategory(null)
    setFormData({
      title: '',
      subtitle: '',
      sortingOrder: categories.length + 1,
      status: 'Active',
      isFeatured: false,
      image: '',
      description: ''
    })
    setPageMode('add')
  }

  // Open Edit Page
  const handleOpenEdit = (category) => {
    setActiveCategory(category)
    setFormData({
      title: category.title || '',
      subtitle: category.subtitle || '',
      sortingOrder: category.sortingOrder || 1,
      status: category.status || 'Active',
      isFeatured: Boolean(category.isFeatured),
      image: category.image || '',
      description: category.description || ''
    })
    setPageMode('edit')
  }

  // Open View Page
  const handleOpenView = (category) => {
    setActiveCategory(category)
    setPageMode('view')
  }

  // Handle Form Submit (Add / Edit)
  const handleSubmit = (e) => {
    e?.preventDefault?.()

    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please specify a category title.')
      return
    }

    if (pageMode === 'add') {
      const newCategory = {
        id: Date.now(),
        ...formData,
        sortingOrder: Number(formData.sortingOrder) || categories.length + 1
      }
      const updated = [...categories, newCategory]
      saveToStorage(updated)
      toast.success('Category Created', `"${formData.title}" has been published to catalog.`)
    } else if (pageMode === 'edit' && activeCategory) {
      const updated = categories.map((c) =>
        c.id === activeCategory.id
          ? {
              ...c,
              ...formData,
              sortingOrder: Number(formData.sortingOrder) || c.sortingOrder
            }
          : c
      )
      saveToStorage(updated)
      setActiveCategory({
        ...activeCategory,
        ...formData,
        sortingOrder: Number(formData.sortingOrder) || activeCategory.sortingOrder
      })
      toast.success('Category Updated', `"${formData.title}" updated successfully.`)
    }

    setPageMode('index')
  }

  // Handle Delete Confirmation
  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return
    const updated = categories.filter((c) => c.id !== categoryToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setCategoryToDelete(null)
    if (activeCategory?.id === categoryToDelete.id) {
      setActiveCategory(null)
      setPageMode('index')
    }
    toast.success('Category Deleted', 'The category has been removed from catalog.')
  }

  // Filtered Categories
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter

    const matchesFeatured =
      featuredFilter === 'all'
        ? true
        : featuredFilter === 'featured'
        ? Boolean(c.isFeatured)
        : !c.isFeatured

    return matchesSearch && matchesStatus && matchesFeatured
  })

  // Sort by sortingOrder
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => (Number(a.sortingOrder) || 0) - (Number(b.sortingOrder) || 0)
  )

  return (
    <div className="space-y-6">
      {/* ==========================================================
          PAGE 1: INDEX LIST PAGE
          ========================================================== */}
      {pageMode === 'index' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faTags} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Product Category
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {categories.filter((c) => c.status === 'Active').length} Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                    {categories.filter((c) => c.isFeatured).length} Featured
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Organize, sort, and manage grocery catalog categories and featured storefront highlights.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenAdd}
              icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
            >
              Add Category
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
              />
              <input
                type="text"
                placeholder="Search categories by title, subtitle, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="px-2 font-bold text-slate-400 uppercase text-[10px]">Status:</span>
                {['all', 'Active', 'Inactive'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-white text-[#064C23] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>

              {/* Featured Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="px-2 font-bold text-slate-400 uppercase text-[10px]">Type:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'featured', label: '★ Featured' },
                  { id: 'standard', label: 'Standard' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeaturedFilter(item.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      featuredFilter === item.id
                        ? 'bg-white text-[#064C23] shadow-xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-20 text-center">Order</th>
                    <th className="px-6 py-4">Category Title & Subtitle</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Featured</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedCategories.length > 0 ? (
                    sortedCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-slate-50/75 transition-colors">
                        {/* Order */}
                        <td className="px-6 py-4 text-center">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-200">
                            #{category.sortingOrder || 1}
                          </span>
                        </td>

                        {/* Title, Thumbnail & Subtitle */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3.5 max-w-md">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.title}
                                className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#064C23] border border-slate-200 flex items-center justify-center text-base shrink-0">
                                <FontAwesomeIcon icon={faTags} />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {category.title}
                                </span>
                                {category.isFeatured && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <FontAwesomeIcon icon={faStar} className="text-[8px]" />
                                    <span>Featured</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 block line-clamp-1 mt-0.5">
                                {category.subtitle || 'No subtitle provided'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">
                            {category.description || '—'}
                          </p>
                        </td>

                        {/* Featured Toggle Switch */}
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(category)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              category.isFeatured
                                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                            title="Toggle featured status"
                          >
                            <FontAwesomeIcon icon={faStar} className="mr-1 text-[10px]" />
                            {category.isFeatured ? 'Yes' : 'No'}
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td className="px-6 py-4">
                          <ToggleButton
                            size="sm"
                            checked={category.status === 'Active'}
                            onChange={() => handleToggleStatus(category)}
                            activeColor="#064C23"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <ActionButton
                              action="view"
                              tooltip="View Category Details"
                              onClick={() => handleOpenView(category)}
                            />
                            <ActionButton
                              action="edit"
                              tooltip="Edit Category"
                              onClick={() => handleOpenEdit(category)}
                            />
                            <ActionButton
                              action="delete"
                              tooltip="Delete Category"
                              onClick={() => {
                                setCategoryToDelete(category)
                                setDeleteModalOpen(true)
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg">
                            <FontAwesomeIcon icon={faTags} />
                          </div>
                          <p className="text-sm font-bold text-slate-700">No Categories Found</p>
                          <p className="text-xs text-slate-400">
                            {searchQuery
                              ? `No product categories matching "${searchQuery}".`
                              : 'Create your first product category to organize your catalog.'}
                          </p>
                          <Button size="sm" variant="primary" onClick={handleOpenAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
                            Add Category
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          PAGE 2 & 3: ADD / EDIT PRODUCT CATEGORY SUBPAGE
          ========================================================== */}
      {(pageMode === 'add' || pageMode === 'edit') && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {pageMode === 'add' ? 'Create Product Category' : 'Edit Product Category'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Configure category title, subtitle, sorting order, status, featured highlight, and description.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
              >
                {pageMode === 'add' ? 'Publish Category' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Category Details & Parameters
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catalog Taxonomy
              </span>
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
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
              <ImageUploadFrame
                label="CATEGORY IMAGE / ICON"
                aspectRatio="square"
                description="Upload square category icon or thumbnail graphic (PNG, JPG, WEBP up to 5MB)"
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
                required
              />

              <InputField
                label="SUBTITLE"
                placeholder="e.g. 100% Direct from local farms with morning freshness check"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
              >
                {pageMode === 'add' ? 'Publish Category' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================
          PAGE 4: VIEW CATEGORY DETAILS SUBPAGE
          ========================================================== */}
      {pageMode === 'view' && activeCategory && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {activeCategory.title}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeCategory.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {activeCategory.status}
                  </span>
                  {activeCategory.isFeatured && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                      <span>Featured Highlight</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  {activeCategory.subtitle || 'Catalog Category Overview'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => handleOpenEdit(activeCategory)}
                icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
              >
                Edit Category
              </Button>
            </div>
          </div>

          {/* Details Overview Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Sorting Order</span>
                <p className="text-lg font-black font-mono text-[#064C23]">#{activeCategory.sortingOrder || 1}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Status</span>
                <p className="text-sm font-bold text-slate-900">{activeCategory.status}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Featured Highlight</span>
                <p className="text-sm font-bold text-slate-900">
                  {activeCategory.isFeatured ? '★ Yes, Featured' : 'No, Standard'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Category ID</span>
                <p className="text-sm font-mono font-bold text-slate-700">CAT-{activeCategory.id}</p>
              </div>
            </div>

            {/* Title, Image Preview & Subtitle Card */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start gap-5">
              {activeCategory.image ? (
                <img
                  src={activeCategory.image}
                  alt={activeCategory.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 text-[#064C23] flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                  <FontAwesomeIcon icon={faTags} />
                </div>
              )}

              <div className="space-y-3 flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Category Title
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    {activeCategory.title}
                  </p>
                </div>

                {activeCategory.subtitle && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                      Subtitle / Tagline
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      {activeCategory.subtitle}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            {activeCategory.description && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Description
                </span>
                <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                  {activeCategory.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product Category?"
        message={`Are you sure you want to delete "${categoryToDelete?.title}"? This category will be removed from catalog management.`}
        confirmText="Delete Category"
        type="danger"
      />
    </div>
  )
}
