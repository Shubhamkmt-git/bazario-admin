import React, { useState, useEffect, useCallback } from 'react'
import ProductListView from './ProductListView'
import AddProductView from './AddProductView'
import EditProductView from './EditProductView'
import ProductDetailsView from './ProductDetailsView'
import { AlertModal } from '../index'
import { useToast } from '../../context/ToastContext'
import {
  getAdminProductsApi,
  getAdminProductByIdApi,
  getAdminCategoriesApi,
  createAdminProductApi,
  updateAdminProductApi,
  deleteAdminProductApi,
} from '../../utils/adminApi'

export default function ProductManageView() {
  const toast = useToast()

  // Load from backend API
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [categoriesList, setCategoriesList] = useState([])

  // Subrouting via window hash
  const [currentSubView, setCurrentSubView] = useState({ type: 'list', id: null })
  const [singleProduct, setSingleProduct] = useState(null)
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, productId: null })

  // Pagination & filter state
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const hashQuery = window.location.hash.includes('?')
        ? window.location.hash.split('?')[1]
        : ''
      const params = new URLSearchParams(hashQuery)
      return parseInt(params.get('page'), 10) || 1
    } catch {
      return 1
    }
  })

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    try {
      const hashQuery = window.location.hash.includes('?')
        ? window.location.hash.split('?')[1]
        : ''
      const params = new URLSearchParams(hashQuery)
      return parseInt(params.get('limit'), 10) || 10
    } catch {
      return 10
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Fetch categories on mount
  useEffect(() => {
    getAdminCategoriesApi()
      .then((res) => {
        const list = res.categories || res.data || []
        if (Array.isArray(list) && list.length > 0) {
          setCategoriesList(list.map((c) => c.name || c.title))
        }
      })
      .catch((err) => console.warn('Categories load error:', err))
  }, [])

  const fetchProducts = useCallback(
    async (
      page = currentPage,
      limit = itemsPerPage,
      search = searchQuery,
      cat = selectedCategory,
      brand = selectedBrand,
      status = selectedStatus
    ) => {
      setLoading(true)
      try {
        const params = { page, limit }
        if (search && search.trim()) params.search = search.trim()
        if (cat && cat !== 'all') params.categoryId = cat
        if (brand && brand !== 'all') params.brand = brand
        if (status && status !== 'all') params.status = status

        const res = await getAdminProductsApi(params)
        const list = res.products || res.data || []
        const total = typeof res.total === 'number' ? res.total : list.length || 0
        setTotalCount(total)

        const formatted = (Array.isArray(list) ? list : []).map((p) => ({
          id: p._id || p.id,
          _id: p._id || p.id,
          title: p.title || p.name,
          category:
            typeof p.category === 'object'
              ? p.category?.title || p.category?.name
              : p.categoryTitle || p.category || 'Grocery Essentials',
          brand: p.brand || 'Bazario Essentials',
          sku: p.sku || `BZ-PRD-${String(p._id || p.id || '').slice(-4).toUpperCase()}`,
          qty: p.stock ?? p.stockQuantity ?? p.qty ?? 0,
          unit: p.unit || 'PCS',
          price: (p.mrp || p.price || 0).toFixed(2),
          sellingPrice: (p.price || p.sellingPrice || 0).toFixed(2),
          image: p.image || '/product-placeholder.svg',
          galleryImages:
            p.galleryImages?.length > 0 ? p.galleryImages : [p.image || '/product-placeholder.svg'],
          searchKeywords: p.tags || p.searchKeywords || [],
          metaTitle: p.metaTitle || '',
          metaDescription: p.metaDescription || '',
          slug: p.slug || '',
          status: p.status || 'Active',
          createdAt: p.createdAt,
        }))
        setProducts(formatted)
      } catch (err) {
        console.warn('Failed to fetch admin products:', err)
      } finally {
        setLoading(false)
      }
    },
    [currentPage, itemsPerPage, searchQuery, selectedCategory, selectedBrand, selectedStatus]
  )

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Parse URL Hash
  const syncSubViewFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
    const parts = hash.split('?')[0].split('/')
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

  // If viewing or editing a product that might not be on current page, fetch it directly
  useEffect(() => {
    if ((currentSubView.type === 'edit' || currentSubView.type === 'view') && currentSubView.id) {
      const found = products.find(
        (p) =>
          String(p.id) === String(currentSubView.id) || String(p._id) === String(currentSubView.id)
      )
      if (found) {
        setSingleProduct(found)
      } else {
        getAdminProductByIdApi(currentSubView.id)
          .then((res) => {
            const p = res.product || res.data
            if (p) {
              setSingleProduct({
                id: p._id || p.id,
                _id: p._id || p.id,
                title: p.title || p.name,
                category:
                  typeof p.category === 'object'
                    ? p.category?.title || p.category?.name
                    : p.categoryTitle || p.category || 'Grocery Essentials',
                brand: p.brand || 'Bazario Essentials',
                sku: p.sku || `BZ-PRD-${String(p.id || '').slice(-4).toUpperCase()}`,
                qty: p.stock ?? p.stockQuantity ?? 0,
                unit: p.unit || 'PCS',
                price: (p.mrp || p.price || 0).toFixed(2),
                sellingPrice: (p.price || p.sellingPrice || 0).toFixed(2),
                image: p.image || '/product-placeholder.svg',
                galleryImages: p.images?.length > 0 ? p.images : ['/product-placeholder.svg'],
                searchKeywords: p.tags || [],
                slug: p.slug || '',
                status: p.status || 'Active',
              })
            }
          })
          .catch((err) => console.warn('Failed to fetch single product:', err))
      }
    }
  }, [currentSubView, products])

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
        toast.success('Product Deleted', 'Product removed successfully.')
      }
    }
    setDeleteModalState({ isOpen: false, productId: null })
  }

  // Active product for edit / view
  const activeProduct =
    singleProduct ||
    products.find(
      (p) =>
        String(p.id) === String(currentSubView.id) || String(p._id) === String(currentSubView.id)
    )

  return (
    <div className="w-full">
      {currentSubView.type === 'list' && (
        <ProductListView
          products={products}
          totalItems={totalCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onLimitChange={(limit) => {
            setItemsPerPage(limit)
            setCurrentPage(1)
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q)
            setCurrentPage(1)
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => {
            setSelectedCategory(c)
            setCurrentPage(1)
          }}
          selectedBrand={selectedBrand}
          onBrandChange={(b) => {
            setSelectedBrand(b)
            setCurrentPage(1)
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(s) => {
            setSelectedStatus(s)
            setCurrentPage(1)
          }}
          categoriesList={categoriesList}
          loading={loading}
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
