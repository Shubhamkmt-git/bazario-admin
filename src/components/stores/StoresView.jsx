import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import StoreListView from './StoreListView'
import AddStoreView from './AddStoreView'
import EditStoreView from './EditStoreView'
import StoreDetailsView from './StoreDetailsView'

const STORES_STORAGE_KEY = 'bazario_stores_data'

const INITIAL_STORES = [
  {
    id: 1,
    sortingOrder: 1,
    title: 'Bazario Central Superstore #01',
    subtitle: 'Flagship Mega Mart & Fresh Produce Hub, Sector 18',
    image: '/supermart-bg.jpg',
    coordinates: '28.5708, 77.3261',
    googleUrl: 'https://maps.google.com/?q=28.5708,77.3261',
    status: 'Open',
    phone: '+91 98111 22334',
    operatingHours: '7:00 AM - 11:00 PM',
  },
  {
    id: 2,
    sortingOrder: 2,
    title: 'Bazario Express Store - Cyber City',
    subtitle: '15-Min Quick Commerce & Convenience Branch, Phase 2',
    image: '/supermart-bg.jpg',
    coordinates: '28.4905, 77.0890',
    googleUrl: 'https://maps.google.com/?q=28.4905,77.0890',
    status: 'Open',
    phone: '+91 98222 33445',
    operatingHours: '6:30 AM - 12:00 AM',
  },
  {
    id: 3,
    sortingOrder: 3,
    title: 'Bazario Supermarket - Green Park',
    subtitle: 'Organic Dairy, Bakery & Gourmet Food Center',
    image: '/supermart-bg.jpg',
    coordinates: '28.5589, 77.2028',
    googleUrl: 'https://maps.google.com/?q=28.5589,77.2028',
    status: 'Open',
    phone: '+91 98333 44556',
    operatingHours: '8:00 AM - 10:30 PM',
  },
  {
    id: 4,
    sortingOrder: 4,
    title: 'Bazario Daily Outlet - Indirapuram',
    subtitle: 'Fresh Veggies & Household Essentials Depot, Block B',
    image: '/supermart-bg.jpg',
    coordinates: '28.6387, 77.3686',
    googleUrl: 'https://maps.google.com/?q=28.6387,77.3686',
    status: 'Closed',
    phone: '+91 98444 55667',
    operatingHours: '7:00 AM - 10:00 PM (Under Maintenance)',
  },
]

export default function StoresView() {
  const toast = useToast()

  // Storage State
  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_STORES
    } catch {
      return INITIAL_STORES
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedStore, setSelectedStore] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, store: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores))
    } catch (e) {
      console.error('Failed to persist stores', e)
    }
  }, [stores])

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedStore(null)
  }

  const handleOpenAdd = () => {
    setSelectedStore(null)
    setViewMode('add')
  }

  const handleOpenEdit = (store) => {
    setSelectedStore(store)
    setViewMode('edit')
  }

  const handleOpenView = (store) => {
    setSelectedStore(store)
    setViewMode('view')
  }

  // Save new store
  const handleSaveNewStore = (newStore) => {
    setStores([newStore, ...stores])
    toast.success('Store Published', `"${newStore.title}" has been listed successfully!`)
    setViewMode('list')
  }

  // Save edited store
  const handleSaveEditedStore = (updatedStore) => {
    const updatedList = stores.map((s) => (s.id === updatedStore.id ? updatedStore : s))
    setStores(updatedList)
    setSelectedStore(updatedStore)
    toast.success('Store Updated', `"${updatedStore.title}" updated successfully!`)
    setViewMode('list')
  }

  // Delete store
  const handleDeleteStore = (storeId, storeTitle) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId))
    setDeleteModal({ isOpen: false, store: null })
    if (selectedStore && selectedStore.id === storeId) {
      setViewMode('list')
      setSelectedStore(null)
    }
    toast.success('Store Removed', `"${storeTitle}" removed from listings.`)
  }

  // Toggle status
  const handleToggleStatus = (store) => {
    const newStatus = store.status === 'Open' ? 'Closed' : 'Open'
    const updatedList = stores.map((s) => (s.id === store.id ? { ...s, status: newStatus } : s))
    setStores(updatedList)
    if (selectedStore && selectedStore.id === store.id) {
      setSelectedStore({ ...selectedStore, status: newStatus })
    }
    toast.info('Status Changed', `"${store.title}" is now ${newStatus}.`)
  }

  return (
    <>
      {/* 1. Add Store Full-width Page */}
      {viewMode === 'add' && (
        <AddStoreView
          onBack={handleGoToList}
          onSave={handleSaveNewStore}
          defaultSortingOrder={stores.length + 1}
        />
      )}

      {/* 2. Edit Store Full-width Page */}
      {viewMode === 'edit' && selectedStore && (
        <EditStoreView
          store={selectedStore}
          onBack={handleGoToList}
          onSave={handleSaveEditedStore}
        />
      )}

      {/* 3. View Store Details Full-width Page */}
      {viewMode === 'view' && selectedStore && (
        <StoreDetailsView
          store={selectedStore}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
          onDelete={(store) => setDeleteModal({ isOpen: true, store })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 0. Default Stores Directory List Table */}
      {viewMode === 'list' && (
        <StoreListView
          stores={stores}
          onAddNew={handleOpenAdd}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(store) => setDeleteModal({ isOpen: true, store })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, store: null })}
        onConfirm={() => handleDeleteStore(deleteModal.store?.id, deleteModal.store?.title)}
        type="danger"
        title="Delete Store Location"
        description={`Are you sure you want to delete "${deleteModal.store?.title}" from the store catalog?`}
        confirmText="Yes, Delete Store"
        cancelText="Cancel"
      />
    </>
  )
}
