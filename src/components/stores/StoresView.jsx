import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import StoreListView from './StoreListView'
import AddStoreView from './AddStoreView'
import EditStoreView from './EditStoreView'
import StoreDetailsView from './StoreDetailsView'
import {
  getAdminStoresApi,
  createAdminStoreApi,
  updateAdminStoreApi,
  deleteAdminStoreApi
} from '../../utils/adminApi'

const STORES_STORAGE_KEY = 'bazario_stores_data'

export default function StoresView() {
  const toast = useToast()

  // Storage State
  const [stores, setStores] = useState([])

  const fetchStores = async () => {
    try {
      const res = await getAdminStoresApi()
      const list = res.stores || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((s, idx) => ({
        id: s._id || s.id || idx + 1,
        _id: s._id,
        sortingOrder: s.sortingOrder || idx + 1,
        title: s.title || s.name,
        subtitle: s.subtitle || s.address || '',
        image: s.image || '/supermart-bg.jpg',
        coordinates: s.coordinates || '28.5708, 77.3261',
        googleUrl: s.googleUrl || `https://maps.google.com/?q=${s.coordinates || '28.5708,77.3261'}`,
        status: s.status || 'Open',
        phone: s.phone || '+91 98111 22334',
        operatingHours: s.operatingHours || '7:00 AM - 11:00 PM',
      }))
      setStores(formatted)
    } catch (err) {
      console.warn('Failed to fetch stores:', err)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedStore, setSelectedStore] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, store: null })

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
  const handleSaveNewStore = async (newStore) => {
    try {
      await createAdminStoreApi(newStore)
      toast.success('Store Published', `"${newStore.title}" has been listed successfully!`)
      fetchStores()
      setViewMode('list')
    } catch (err) {
      setStores([newStore, ...stores])
      toast.success('Store Published', `"${newStore.title}" has been listed!`)
      setViewMode('list')
    }
  }

  // Save edited store
  const handleSaveEditedStore = async (updatedStore) => {
    try {
      await updateAdminStoreApi(updatedStore._id || updatedStore.id, updatedStore)
      toast.success('Store Updated', `"${updatedStore.title}" updated successfully!`)
      fetchStores()
      setViewMode('list')
    } catch (err) {
      const updatedList = stores.map((s) => (s.id === updatedStore.id ? updatedStore : s))
      setStores(updatedList)
      setSelectedStore(updatedStore)
      toast.success('Store Updated', `"${updatedStore.title}" updated successfully!`)
      setViewMode('list')
    }
  }

  // Delete store
  const handleDeleteStore = async (storeId, storeTitle) => {
    try {
      await deleteAdminStoreApi(storeId)
      toast.success('Store Removed', `"${storeTitle}" removed from listings.`)
      fetchStores()
    } catch (err) {
      setStores((prev) => prev.filter((s) => s.id !== storeId))
      toast.success('Store Removed', `"${storeTitle}" removed from listings.`)
    }
    setDeleteModal({ isOpen: false, store: null })
    if (selectedStore && selectedStore.id === storeId) {
      setViewMode('list')
      setSelectedStore(null)
    }
  }

  // Toggle status
  const handleToggleStatus = async (store) => {
    const nextStatus = store.status === 'Open' ? 'Closed' : 'Open'
    try {
      await updateAdminStoreApi(store._id || store.id, { status: nextStatus })
      toast.info('Status Changed', `"${store.title}" is now marked as ${nextStatus}.`)
      fetchStores()
    } catch (err) {
      const updatedList = stores.map((s) => (s.id === store.id ? { ...s, status: nextStatus } : s))
      setStores(updatedList)
      if (selectedStore && selectedStore.id === store.id) {
        setSelectedStore({ ...selectedStore, status: nextStatus })
      }
      toast.info('Status Changed', `"${store.title}" is now marked as ${nextStatus}.`)
    }
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
