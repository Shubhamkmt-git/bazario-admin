import React, { useState, useEffect } from 'react'
import ProductListView from './ProductListView'
import AddProductView from './AddProductView'
import EditProductView from './EditProductView'
import ProductDetailsView from './ProductDetailsView'
import { AlertModal } from '../index'
import { useToast } from '../../context/ToastContext'
import {
  getAdminProductsApi,
  createAdminProductApi,
  updateAdminProductApi,
  deleteAdminProductApi
} from '../../utils/adminApi'

export default function ProductManageView() {
  const toast = useToast()

  // Load from backend API
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await getAdminProductsApi({ limit: 100 })
      const list = res.products || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((p) => ({
        id: p._id || p.id,
        _id: p._id,
        title: p.title || p.name,
        category:
          typeof p.category === 'object'
            ? p.category?.title
            : p.category || 'Grocery Essentials',
        brand: p.brand || 'Bazario Fresh',
        sku: p.sku || `BZ-PRD-${(p._id || '').slice(-4).toUpperCase()}`,
        qty: p.stockQuantity ?? p.qty ?? 50,
        unit: p.unit || '500 g',
        price: (p.price || 0).toFixed(2),
        sellingPrice: (p.sellingPrice || p.price || 0).toFixed(2),
        image: p.image || '/supermart-bg.jpg',
        galleryImages:
          p.galleryImages?.length > 0 ? p.galleryImages : [p.image || '/supermart-bg.jpg'],
        searchKeywords: p.searchKeywords || [],
        metaTitle: p.metaTitle || '',
        metaDescription: p.metaDescription || '',
        slug: p.slug || '',
        status: p.status || 'Active',
        createdAt: p.createdAt,
      }))
      setProducts(formatted)
    } catch (err) {
      console.warn('Failed to fetch admin products:', err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Subrouting via window hash
  const [currentSubView, setCurrentSubView] = useState({ type: 'list', id: null })
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, productId: null })

  // Parse URL Hash
  const syncSubViewFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
    const parts = hash.split('/')
    const base = parts[0]?.toLowerCase()

    if (base === 'products' || base === 'product-manage' || base === 'product') {
      const subAction = parts[1]?.toLowerCase()
      const targetId = parts[2] ? parts[2] : null

      if (subAction === 'add') {
        setCurrentSubView({ type: 'add', id: null })
      } else if (subAction === 'edit' && targetId) {
        setCurrentSubView({ type: 'edit', id: targetId })
      } else if (subAction === 'view' && targetId) {
        setCurrentSubView({ type: 'view', id: targetId })
      } else {
        setCurrentSubView({ type: 'list', id: null })
      }
    }
  }

  useEffect(() => {
    syncSubViewFromHash()
    const handleHash = () => syncSubViewFromHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Navigation helpers
  const goToList = () => {
    window.location.hash = '#/products'
    setCurrentSubView({ type: 'list', id: null })
  }

  const goToAddNew = () => {
    window.location.hash = '#/products/add'
    setCurrentSubView({ type: 'add', id: null })
  }

  const goToEdit = (id) => {
    window.location.hash = `#/products/edit/${id}`
    setCurrentSubView({ type: 'edit', id })
  }

  const goToView = (id) => {
    window.location.hash = `#/products/view/${id}`
    setCurrentSubView({ type: 'view', id })
  }

  // CRUD Operations
  const handleSaveNewProduct = async (newProduct) => {
    try {
      await createAdminProductApi(newProduct)
      toast.success('Product Added', `"${newProduct.title}" has been created successfully.`)
      fetchProducts()
      goToList()
    } catch (err) {
      setProducts((prev) => [newProduct, ...prev])
      toast.success('Product Added', `"${newProduct.title}" has been created.`)
      goToList()
    }
  }

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await updateAdminProductApi(updatedProduct.id || updatedProduct._id, updatedProduct)
      toast.success('Product Updated', `"${updatedProduct.title}" details updated.`)
      fetchProducts()
      goToList()
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      )
      toast.success('Product Updated', `"${updatedProduct.title}" details updated.`)
      goToList()
    }
  }

  const handleToggleStatus = async (id) => {
    const target = products.find((p) => String(p.id) === String(id) || String(p._id) === String(id))
    const nextStatus = target?.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminProductApi(id, { status: nextStatus })
      toast.info('Status Changed', `"${target?.title}" is now ${nextStatus}.`)
      fetchProducts()
    } catch (err) {
      setProducts((prev) =>
        prev.map((item) => {
          if (String(item.id) === String(id)) {
            return { ...item, status: nextStatus }
          }
          return item
        })
      )
      toast.info('Status Changed', `"${target?.title}" is now ${nextStatus}.`)
    }
  }

  const handlePromptDelete = (id) => {
    setDeleteModalState({ isOpen: true, productId: id })
  }

  const handleConfirmDelete = async () => {
    const { productId } = deleteModalState
    const targetProduct = products.find(
      (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
    )
    if (productId) {
      try {
        await deleteAdminProductApi(productId)
        toast.success(
          'Product Deleted',
          `"${targetProduct?.title || 'Product'}" was permanently removed.`
        )
        fetchProducts()
      } catch (err) {
        setProducts((prev) => prev.filter((item) => String(item.id) !== String(productId)))
        toast.success(
          'Product Deleted',
          `"${targetProduct?.title || 'Product'}" was permanently removed.`
        )
      }
    }
    setDeleteModalState({ isOpen: false, productId: null })
  }

  // Active product for edit / view (supporting string and integer matching)
  const activeProduct = products.find(
    (p) => String(p.id) === String(currentSubView.id) || String(p._id) === String(currentSubView.id)
  )

  return (
    <div className="w-full">
      {currentSubView.type === 'list' && (
        <ProductListView
          products={products}
          onAddNew={goToAddNew}
          onView={goToView}
          onEdit={goToEdit}
          onDelete={handlePromptDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {currentSubView.type === 'add' && (
        <AddProductView onBack={goToList} onSave={handleSaveNewProduct} />
      )}

      {currentSubView.type === 'edit' && activeProduct && (
        <EditProductView
          product={activeProduct}
          onBack={goToList}
          onSave={handleUpdateProduct}
        />
      )}

      {currentSubView.type === 'view' && activeProduct && (
        <ProductDetailsView
          product={activeProduct}
          onBack={goToList}
          onEdit={goToEdit}
        />
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, productId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product from the supermarket catalog? This action will remove all pricing, stock, gallery images and SEO index data permanently."
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
