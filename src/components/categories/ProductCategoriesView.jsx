import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import CategoryListView from './CategoryListView'
import AddCategoryView from './AddCategoryView'
import EditCategoryView from './EditCategoryView'
import CategoryDetailsView from './CategoryDetailsView'

const CATEGORIES_STORAGE_KEY = 'bazario_product_categories'

const INITIAL_CATEGORIES = [
  {
    id: 1,
    title: 'Farm-Fresh Fruits & Vegetables',
    subtitle: '100% Direct from local farms with morning freshness check',
    sortingOrder: 1,
    status: 'Active',
    isFeatured: true,
    image: '',
    description: 'Crisp green vegetables, root produce, seasonal tropical fruits, and certified organic herbs harvested daily for optimal freshness and nutrition.'
  },
  {
    id: 2,
    title: 'Dairy, Bread & Morning Eggs',
    subtitle: 'Fresh cow milk, artisan breads, paneer, curd & farm eggs',
    sortingOrder: 2,
    status: 'Active',
    isFeatured: true,
    image: '',
    description: 'Pure pasteurized whole milk, fresh butter, cultured probiotic yogurt, cottage cheese (paneer), sourdough loaves, and high-protein farm eggs delivered fresh daily.'
  },
  {
    id: 3,
    title: 'Atta, Rice & Daily Grains',
    subtitle: 'Chakki fresh whole wheat atta, aged basmati rice & pulses',
    sortingOrder: 3,
    status: 'Active',
    isFeatured: true,
    image: '',
    description: 'Premium multigrain and whole wheat flour, unpolished lentils (dals), long-grain royal basmati rice, organic millets, and staple grains for everyday Indian cooking.'
  },
  {
    id: 4,
    title: 'Cooking Oils, Ghee & Spices',
    subtitle: 'Cold-pressed mustard oil, pure desi cow ghee & whole spices',
    sortingOrder: 4,
    status: 'Active',
    isFeatured: false,
    image: '',
    description: 'Kachi ghani mustard oil, extra virgin olive oil, traditional bilona A2 cow ghee, whole aromatic spices, turmeric, and authentic blended masalas.'
  },
  {
    id: 5,
    title: 'Snacks, Munchies & Biscuits',
    subtitle: 'Crispy namkeens, healthy roasted nuts & artisan cookies',
    sortingOrder: 5,
    status: 'Active',
    isFeatured: true,
    image: '',
    description: 'Traditional Indian savory snacks, roasted seeds, dry fruits, digestive biscuits, potato crisps, and gourmet tea-time cookies for the whole family.'
  },
  {
    id: 6,
    title: 'Beverages & Instant Drinks',
    subtitle: 'Fresh fruit juices, single-origin tea, filter coffee & energy sips',
    sortingOrder: 6,
    status: 'Active',
    isFeatured: false,
    image: '',
    description: 'Natural cold-pressed juices, tender coconut water, premium Assam and Darjeeling CTC tea leaves, South Indian filter coffee blend, and sparkling beverages.'
  },
  {
    id: 7,
    title: 'Household & Cleaning Essentials',
    subtitle: 'Surface cleaners, dishwashing bars, laundry detergents & care',
    sortingOrder: 7,
    status: 'Active',
    isFeatured: false,
    image: '',
    description: 'Eco-friendly floor cleaners, fabric conditioners, heavy-duty laundry powders, utensil scrubs, disinfectant sprays, and waste disposal liners.'
  },
  {
    id: 8,
    title: 'Personal Care & Hygiene',
    subtitle: 'Ayurvedic soaps, shampoos, oral care & grooming essentials',
    sortingOrder: 8,
    status: 'Inactive',
    isFeatured: false,
    image: '',
    description: 'Herbal body washes, natural bathing bars, hair oils, therapeutic toothpastes, moisturizers, and personal grooming supplies for daily wellness.'
  }
]

export default function ProductCategoriesView() {
  const toast = useToast()

  // Storage State
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
    } catch {
      return INITIAL_CATEGORIES
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to persist categories', e)
    }
  }, [categories])

  // Hash Route Parser & Listener
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
      if (hash.startsWith('product-categories') || hash.startsWith('product-category')) {
        const parts = hash.split('/')
        const action = parts[1] // 'add' | 'edit' | 'view'
        const id = parts[2] ? Number(parts[2]) : null

        if (action === 'add') {
          setSelectedCategory(null)
          setViewMode('add')
        } else if (action === 'edit' && id) {
          const found = categories.find((c) => c.id === id)
          if (found) {
            setSelectedCategory(found)
            setViewMode('edit')
          }
        } else if (action === 'view' && id) {
          const found = categories.find((c) => c.id === id)
          if (found) {
            setSelectedCategory(found)
            setViewMode('view')
          }
        } else if (!action) {
          setViewMode('list')
        }
      }
    }

    parseRoute()
    window.addEventListener('hashchange', parseRoute)
    return () => window.removeEventListener('hashchange', parseRoute)
  }, [categories])

  // Navigation handlers with route update
  const handleGoToList = () => {
    window.location.hash = '#/product-categories'
    setViewMode('list')
    setSelectedCategory(null)
  }

  const handleOpenAdd = () => {
    window.location.hash = '#/product-categories/add'
    setSelectedCategory(null)
    setViewMode('add')
  }

  const handleOpenEdit = (category) => {
    window.location.hash = `#/product-categories/edit/${category.id}`
    setSelectedCategory(category)
    setViewMode('edit')
  }

  const handleOpenView = (category) => {
    window.location.hash = `#/product-categories/view/${category.id}`
    setSelectedCategory(category)
    setViewMode('view')
  }

  // Save new category
  const handleSaveNewCategory = (newCategory) => {
    const updatedList = [newCategory, ...categories]
    setCategories(updatedList)
    toast.success('Category Created', `"${newCategory.title}" has been published to catalog!`)
    handleGoToList()
  }

  // Save edited category
  const handleSaveEditedCategory = (updatedCategory) => {
    const updatedList = categories.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
    setCategories(updatedList)
    setSelectedCategory(updatedCategory)
    toast.success('Category Updated', `"${updatedCategory.title}" updated successfully!`)
    handleGoToList()
  }

  // Delete category
  const handleDeleteCategory = (categoryId, categoryTitle) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    setDeleteModal({ isOpen: false, category: null })
    if (selectedCategory && selectedCategory.id === categoryId) {
      handleGoToList()
    }
    toast.success('Category Removed', `"${categoryTitle}" removed from catalog.`)
  }

  // Toggle status
  const handleToggleStatus = (category) => {
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = categories.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c))
    setCategories(updatedList)
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory({ ...selectedCategory, status: newStatus })
    }
    toast.info('Status Changed', `"${category.title}" is now ${newStatus}.`)
  }

  // Toggle featured
  const handleToggleFeatured = (category) => {
    const updatedList = categories.map((c) =>
      c.id === category.id ? { ...c, isFeatured: !c.isFeatured } : c
    )
    setCategories(updatedList)
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory({ ...selectedCategory, isFeatured: !selectedCategory.isFeatured })
    }
    toast.success('Featured Status', `"${category.title}" ${!category.isFeatured ? 'marked as Featured' : 'removed from Featured'}.`)
  }

  return (
    <div className="space-y-6">
      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <CategoryListView
          categories={categories}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onOpenView={handleOpenView}
          onOpenDelete={(cat) => setDeleteModal({ isOpen: true, category: cat })}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* 2. ADD VIEW */}
      {viewMode === 'add' && (
        <AddCategoryView
          onBack={handleGoToList}
          onSave={handleSaveNewCategory}
          categoriesCount={categories.length}
        />
      )}

      {/* 3. EDIT VIEW */}
      {viewMode === 'edit' && selectedCategory && (
        <EditCategoryView
          category={selectedCategory}
          onBack={handleGoToList}
          onSave={handleSaveEditedCategory}
        />
      )}

      {/* 4. DETAILS VIEW */}
      {viewMode === 'view' && selectedCategory && (
        <CategoryDetailsView
          category={selectedCategory}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
        />
      )}

      {/* Reusable AlertModal for Delete Confirmation */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={() =>
          handleDeleteCategory(deleteModal.category?.id, deleteModal.category?.title)
        }
        title="Delete Product Category?"
        message={`Are you sure you want to delete "${deleteModal.category?.title}"? This category will be removed from the catalog.`}
        confirmText="Delete Category"
        cancelText="Keep Category"
        type="danger"
      />
    </div>
  )
}
