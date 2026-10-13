import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import CategoryListView from './CategoryListView'
import AddCategoryView from './AddCategoryView'
import EditCategoryView from './EditCategoryView'
import CategoryDetailsView from './CategoryDetailsView'
import {
  getAdminCategoriesApi,
  createAdminCategoryApi,
  updateAdminCategoryApi,
  deleteAdminCategoryApi
} from '../../utils/adminApi'

const CATEGORIES_STORAGE_KEY = 'bazario_product_categories'

export default function ProductCategoriesView() {
  const toast = useToast()

  // Storage State
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategoriesApi()
      const list = res.categories || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((c, idx) => ({
        id: c._id || c.id || idx + 1,
        _id: c._id,
        title: c.title || c.name,
        subtitle: c.subtitle || '',
        sortingOrder: c.sortingOrder || idx + 1,
        status: c.status || 'Active',
        isFeatured: Boolean(c.isFeatured),
        image: c.image || '',
        description: c.description || '',
      }))
      setCategories(formatted)
    } catch (err) {
      console.warn('Failed to fetch categories:', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null })

  // Hash Route Parser & Listener
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
      if (hash.startsWith('product-categories') || hash.startsWith('product-category')) {
        const parts = hash.split('/')
        const action = parts[1] // 'add' | 'edit' | 'view'
        const id = parts[2] ? parts[2] : null

        if (action === 'add') {
          setSelectedCategory(null)
          setViewMode('add')
        } else if (action === 'edit' && id) {
          const found = categories.find((c) => String(c.id) === String(id) || String(c._id) === String(id))
          if (found) {
            setSelectedCategory(found)
            setViewMode('edit')
          } else {
            setViewMode('list')
          }
        } else if (action === 'view' && id) {
          const found = categories.find((c) => String(c.id) === String(id) || String(c._id) === String(id))
          if (found) {
            setSelectedCategory(found)
            setViewMode('view')
          } else {
            setViewMode('list')
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
  const handleSaveNewCategory = async (newCategory) => {
    try {
      await createAdminCategoryApi(newCategory)
      toast.success('Category Created', `"${newCategory.title}" has been published to catalog!`)
      fetchCategories()
      handleGoToList()
    } catch (err) {
      setCategories((prev) => [newCategory, ...prev])
      toast.success('Category Created', `"${newCategory.title}" has been created!`)
      handleGoToList()
    }
  }

  // Save edited category
  const handleSaveEditedCategory = async (updatedCategory) => {
    try {
      await updateAdminCategoryApi(updatedCategory._id || updatedCategory.id, updatedCategory)
      toast.success('Category Updated', `"${updatedCategory.title}" updated successfully!`)
      fetchCategories()
      handleGoToList()
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
      )
      toast.success('Category Updated', `"${updatedCategory.title}" updated successfully!`)
      handleGoToList()
    }
  }

  // Delete category
  const handleDeleteCategory = async (categoryId, categoryTitle) => {
    try {
      await deleteAdminCategoryApi(categoryId)
      toast.success('Category Removed', `"${categoryTitle}" removed from catalog.`)
      fetchCategories()
    } catch (err) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      toast.success('Category Removed', `"${categoryTitle}" removed from catalog.`)
    }
    setDeleteModal({ isOpen: false, category: null })
    if (selectedCategory && selectedCategory.id === categoryId) {
      handleGoToList()
    }
  }

  // Toggle status
  const handleToggleStatus = async (category) => {
    const newStatus = category.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminCategoryApi(category._id || category.id, { status: newStatus })
      toast.info('Status Changed', `"${category.title}" is now ${newStatus}.`)
      fetchCategories()
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c))
      )
      toast.info('Status Changed', `"${category.title}" is now ${newStatus}.`)
    }
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
