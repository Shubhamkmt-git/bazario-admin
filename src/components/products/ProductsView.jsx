import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxesStacked,
  faPlus,
  faMagnifyingGlass,
  faTriangleExclamation,
  faCircleCheck,
  faTag,
  faPenToSquare,
  faTrashCan,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import Modal from '../ui/Modal'
import InputField from '../ui/InputField'
import ImageUploadFrame from '../ui/ImageUploadFrame'
import { FormRow, FormActions } from '../ui/FormLayout'

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Fresh Red Apples (1kg)',
    category: 'Fresh Fruits',
    sku: 'BZ-FRU-091',
    price: '$3.50',
    stock: 84,
    status: 'In Stock',
    image: '/supermart-bg.jpg',
  },
  {
    id: 2,
    name: 'Organic Whole Milk (1L)',
    category: 'Dairy & Eggs',
    sku: 'BZ-DRY-012',
    price: '$2.10',
    stock: 120,
    status: 'In Stock',
    image: '/supermart-bg.jpg',
  },
  {
    id: 3,
    name: 'Farm Fresh Strawberries (500g)',
    category: 'Fresh Fruits',
    sku: 'BZ-FRU-044',
    price: '$4.80',
    stock: 6,
    status: 'Low Stock',
    image: '/supermart-bg.jpg',
  },
  {
    id: 4,
    name: 'Artisan Whole Wheat Sourdough',
    category: 'Bakery',
    sku: 'BZ-BAK-108',
    price: '$3.90',
    stock: 22,
    status: 'In Stock',
    image: '/supermart-bg.jpg',
  },
  {
    id: 5,
    name: 'Cold Pressed Virgin Olive Oil (1L)',
    category: 'Pantry Essentials',
    sku: 'BZ-OIL-003',
    price: '$14.50',
    stock: 4,
    status: 'Low Stock',
    image: '/supermart-bg.jpg',
  },
  {
    id: 6,
    name: 'Organic Greek Yogurt (500g)',
    category: 'Dairy & Eggs',
    sku: 'BZ-DRY-078',
    price: '$3.20',
    stock: 0,
    status: 'Out of Stock',
    image: '/supermart-bg.jpg',
  },
]

export default function ProductsView() {
  const toast = useToast()
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fresh Fruits',
    sku: '',
    price: '',
    stock: '',
    image: null,
  })

  const categories = ['all', 'Fresh Fruits', 'Dairy & Eggs', 'Bakery', 'Pantry Essentials']

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) {
      toast.error('Validation Error', 'Please specify product name and price.')
      return
    }

    const stockNum = parseInt(newProduct.stock) || 0
    const created = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      sku: newProduct.sku || `BZ-${Math.floor(100 + Math.random() * 900)}`,
      price: `$${parseFloat(newProduct.price).toFixed(2)}`,
      stock: stockNum,
      status: stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'In Stock',
      image: newProduct.image || '/supermart-bg.jpg',
    }

    setProducts([created, ...products])
    setIsAddModalOpen(false)
    setNewProduct({ name: '', category: 'Fresh Fruits', sku: '', price: '', stock: '', image: null })
    toast.success('Product Added', `"${created.name}" is now live in store inventory.`)
  }

  const handleDeleteProduct = (id, name) => {
    setProducts(products.filter((p) => p.id !== id))
    toast.success('Product Removed', `"${name}" removed from catalog.`)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faBoxesStacked} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Products & Stock Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage inventory levels, prices, barcodes, and stock refill alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* Catalog Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU, department..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs self-start md:self-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-white text-[#064C23] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">SKU / Code</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-800">{prod.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {prod.category}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-500">
                      {prod.sku}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      {prod.price}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {prod.stock} units
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          prod.status === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prod.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <ActionButton
                        action="edit"
                        onClick={() => toast.info('Edit Product', `Editing ${prod.name}...`)}
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No products found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supermarket Product"
        size="lg"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <FormRow cols={2}>
            <InputField
              label="Product Name"
              required
              placeholder="e.g. Organic Avocados (2pk)"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <InputField
              label="SKU / Barcode"
              placeholder="e.g. BZ-FRU-099"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
          </FormRow>

          <FormRow cols={2}>
            <InputField
              label="Price ($)"
              type="number"
              required
              placeholder="0.00"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <InputField
              label="Initial Stock Count"
              type="number"
              placeholder="50"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </FormRow>

          <ImageUploadFrame
            label="Product Image"
            aspectRatio="video"
            value={newProduct.image}
            onChange={(img) => setNewProduct({ ...newProduct, image: img })}
          />

          <FormActions align="right">
            <Button
              type="button"
              variant="cancel"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Product
            </Button>
          </FormActions>
        </form>
      </Modal>
    </div>
  )
}
