import React, { useState, useEffect } from 'react'
import ProductListView from './ProductListView'
import AddProductView from './AddProductView'
import EditProductView from './EditProductView'
import ProductDetailsView from './ProductDetailsView'
import { AlertModal } from '../index'
import { useToast } from '../../context/ToastContext'

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'Amul Butter - Pasteurized (500g Pack)',
    category: 'Dairy, Bread & Eggs',
    brand: 'Amul',
    sku: 'BZ-PRD-1001',
    qty: '120',
    unit: '500 g',
    price: '275.00',
    sellingPrice: '255.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['butter', 'amul', 'table-butter', 'pasteurized', 'dairy', 'breakfast'],
    metaTitle: 'Buy Amul Butter 500g Online at Best Price | Bazario',
    metaDescription: 'Fresh Amul Pasteurized Butter 500g at wholesale supermarket rates. Express 30-min doorstep delivery from Bazario.',
    slug: 'amul-butter-pasteurized-500g',
    status: 'Active',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 2,
    title: 'Aashirvaad Superior MP Shudh Chakki Atta (10kg)',
    category: 'Atta, Rice, Oil & Dals',
    brand: 'Aashirvaad',
    sku: 'BZ-PRD-1002',
    qty: '85',
    unit: '10 kg',
    price: '465.00',
    sellingPrice: '419.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['atta', 'wheat-flour', 'chakki-atta', 'aashirvaad', 'roti', 'staples'],
    metaTitle: 'Aashirvaad Shudh Chakki Atta 10kg Online | Bazario Supermarket',
    metaDescription: '100% whole wheat grain Aashirvaad Atta 10kg with natural dietary fibre. Guaranteed lowest price at Bazario.',
    slug: 'aashirvaad-shudh-chakki-atta-10kg',
    status: 'Active',
    createdAt: '2026-10-02T11:30:00.000Z'
  },
  {
    id: 3,
    title: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)',
    category: 'Atta, Rice, Oil & Dals',
    brand: 'Fortune',
    sku: 'BZ-PRD-1003',
    qty: '140',
    unit: '1 L',
    price: '165.00',
    sellingPrice: '142.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['cooking-oil', 'sunflower-oil', 'fortune', 'refined-oil', 'edible-oil'],
    metaTitle: 'Fortune Sunlite Sunflower Oil 1L at Best Price | Bazario',
    metaDescription: 'Light and healthy Fortune Sunlite Refined Sunflower Cooking Oil. Daily supermarket discount offers at Bazario.',
    slug: 'fortune-sunlite-sunflower-oil-1l',
    status: 'Active',
    createdAt: '2026-10-03T09:15:00.000Z'
  },
  {
    id: 4,
    title: 'Tata Salt Vacuum Evaporated Iodized (1kg Pack)',
    category: 'Atta, Rice, Oil & Dals',
    brand: 'Tata Sampann',
    sku: 'BZ-PRD-1004',
    qty: '300',
    unit: '1 kg',
    price: '28.00',
    sellingPrice: '26.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['salt', 'tata-salt', 'iodized-salt', 'namak', 'groceries'],
    metaTitle: 'Tata Salt 1kg Online | Bazario Supermarket',
    metaDescription: 'India ki Shaan - Desh Ka Namak Tata Salt 1kg with essential iodine purity.',
    slug: 'tata-salt-iodized-1kg',
    status: 'Active',
    createdAt: '2026-10-04T14:20:00.000Z'
  },
  {
    id: 5,
    title: 'Britannia Good Day Butter Cookies (600g Value Pack)',
    category: 'Bakery & Biscuits',
    brand: 'Britannia',
    sku: 'BZ-PRD-1005',
    qty: '75',
    unit: '500 g',
    price: '140.00',
    sellingPrice: '115.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['biscuits', 'cookies', 'good-day', 'britannia', 'snacks', 'tea-time'],
    metaTitle: 'Britannia Good Day Butter Cookies 600g | Bazario',
    metaDescription: 'Rich cashew and butter taste with signature smile patterns. Value family pack at Bazario.',
    slug: 'britannia-good-day-butter-cookies-600g',
    status: 'Active',
    createdAt: '2026-10-05T16:00:00.000Z'
  },
  {
    id: 6,
    title: 'Dabur 100% Pure Honey (500g Squeezy Bottle)',
    category: 'Breakfast & Spreads',
    brand: 'Dabur',
    sku: 'BZ-PRD-1006',
    qty: '8',
    unit: '500 g',
    price: '235.00',
    sellingPrice: '199.00',
    image: '/supermart-bg.jpg',
    galleryImages: ['/supermart-bg.jpg'],
    searchKeywords: ['honey', 'dabur-honey', 'pure-honey', 'immunity', 'organic', 'breakfast'],
    metaTitle: 'Dabur Pure Honey 500g Online at Discount Price | Bazario',
    metaDescription: '100% pure NMR tested Dabur Honey with immunity boosters and no added sugar.',
    slug: 'dabur-pure-honey-500g',
    status: 'Active',
    createdAt: '2026-10-06T12:00:00.000Z'
  }
]

export default function ProductManageView() {
  const toast = useToast()

  // Load from localStorage or use initial seed
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_products')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Error loading products from storage:', e)
    }
    return INITIAL_PRODUCTS
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bazario_products', JSON.stringify(products))
    } catch (e) {
      console.error('Error saving products to storage:', e)
    }
  }, [products])

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
      const targetId = parts[2] ? parseInt(parts[2], 10) : null

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
  const handleSaveNewProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev])
    toast.success('Product Added', `"${newProduct.title}" has been created successfully.`)
    goToList()
  }

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
    )
    toast.success('Product Updated', `"${updatedProduct.title}" details updated.`)
    goToList()
  }

  const handleToggleStatus = (id) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active'
          toast.info(
            'Status Changed',
            `"${item.title}" is now ${nextStatus}.`
          )
          return { ...item, status: nextStatus }
        }
        return item
      })
    )
  }

  const handlePromptDelete = (id) => {
    setDeleteModalState({ isOpen: true, productId: id })
  }

  const handleConfirmDelete = () => {
    const { productId } = deleteModalState
    const targetProduct = products.find((p) => p.id === productId)
    if (productId) {
      setProducts((prev) => prev.filter((item) => item.id !== productId))
      toast.success(
        'Product Deleted',
        `"${targetProduct?.title || 'Product'}" was permanently removed.`
      )
    }
    setDeleteModalState({ isOpen: false, productId: null })
  }

  // Active product for edit / view
  const activeProduct = products.find((p) => p.id === currentSubView.id)

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
