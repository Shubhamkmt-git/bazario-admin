import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import OffersListView from './OffersListView'
import AddOfferView from './AddOfferView'
import EditOfferView from './EditOfferView'
import OfferDetailsView from './OfferDetailsView'
import {
  getAdminOffersApi,
  createAdminOfferApi,
  deleteAdminOfferApi
} from '../../utils/adminApi'

const MANAGE_OFFERS_STORAGE_KEY = 'bazario_manage_offers'

export default function ManageOffersView() {
  const toast = useToast()

  // Storage State
  const [offers, setOffers] = useState([])

  const fetchOffers = async () => {
    try {
      const res = await getAdminOffersApi()
      const list = res.offers || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((o, idx) => ({
        id: o._id || o.id || idx + 1,
        _id: o._id,
        title: o.title || `Promo ${o.code || ''}`,
        code: o.code || '',
        redirectionUrl: o.redirectionUrl || '/offers',
        image: o.image || '/product-placeholder.svg',
        sortingOrder: o.sortingOrder || idx + 1,
        status: o.active ? 'Active' : (o.status || 'Active'),
        discount: o.discount || (o.discountValue ? `${o.discountValue}%` : ''),
        minOrder: o.minOrderValue || o.minOrder || 0,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '2026-10-01'
      }))
      setOffers(formatted)
    } catch (err) {
      console.warn('Failed to fetch admin offers:', err)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedOffer, setSelectedOffer] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, offer: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MANAGE_OFFERS_STORAGE_KEY, JSON.stringify(offers))
    } catch (e) {
      console.error('Failed to persist offers', e)
    }
  }, [offers])

  // Hash Route Parser & Listener
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
      if (
        hash.startsWith('manage-offers') ||
        hash.startsWith('offers-manage') ||
        hash.startsWith('offers')
      ) {
        const parts = hash.split('/')
        const action = parts[1] // 'add' | 'edit' | 'view'
        const id = parts[2] ? parts[2] : null

        if (action === 'add') {
          setSelectedOffer(null)
          setViewMode('add')
        } else if (action === 'edit' && id) {
          const found = offers.find((o) => String(o.id) === String(id))
          if (found) {
            setSelectedOffer(found)
            setViewMode('edit')
          } else {
            setViewMode('list')
          }
        } else if (action === 'view' && id) {
          const found = offers.find((o) => String(o.id) === String(id))
          if (found) {
            setSelectedOffer(found)
            setViewMode('view')
          } else {
            setViewMode('list')
          }
        } else {
          setSelectedOffer(null)
          setViewMode('list')
        }
      }
    }

    parseRoute()
    window.addEventListener('hashchange', parseRoute)
    return () => window.removeEventListener('hashchange', parseRoute)
  }, [offers])

  // Navigation handlers
  const handleOpenList = () => {
    setSelectedOffer(null)
    setViewMode('list')
    window.location.hash = '#/manage-offers'
  }

  const handleOpenAdd = () => {
    setSelectedOffer(null)
    setViewMode('add')
    window.location.hash = '#/manage-offers/add'
  }

  const handleOpenEdit = (offer) => {
    setSelectedOffer(offer)
    setViewMode('edit')
    window.location.hash = `#/manage-offers/edit/${offer.id}`
  }

  const handleOpenView = (offer) => {
    setSelectedOffer(offer)
    setViewMode('view')
    window.location.hash = `#/manage-offers/view/${offer.id}`
  }

  // CRUD Operations
  const handleSaveAdd = async (newOfferData) => {
    try {
      await createAdminOfferApi(newOfferData)
      toast.success('Offer Created', `"${newOfferData.title}" was added successfully.`)
      fetchOffers()
      handleOpenList()
    } catch (err) {
      const nextId = offers.length > 0 ? Math.max(...offers.map((o) => o.id)) + 1 : 1
      const newOffer = {
        ...newOfferData,
        id: nextId,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setOffers([newOffer, ...offers])
      toast.success('Offer Created', `"${newOffer.title}" was added.`)
      handleOpenList()
    }
  }

  const handleSaveEdit = (updatedOffer) => {
    setOffers(offers.map((o) => (o.id === updatedOffer.id ? updatedOffer : o)))
    toast.success('Offer Updated', `"${updatedOffer.title}" was updated successfully.`)
    handleOpenList()
  }

  const handleToggleStatus = (offer) => {
    const nextStatus = offer.status === 'Active' ? 'Inactive' : 'Active'
    setOffers(
      offers.map((o) => (o.id === offer.id ? { ...o, status: nextStatus } : o))
    )
    toast.info('Status Changed', `Offer status changed to ${nextStatus}.`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.offer) return
    const offerToDelete = deleteModal.offer
    try {
      await deleteAdminOfferApi(offerToDelete._id || offerToDelete.id)
      toast.success('Offer Deleted', `"${offerToDelete.title}" has been deleted.`)
      fetchOffers()
    } catch (err) {
      setOffers(offers.filter((o) => o.id !== offerToDelete.id))
      toast.success('Offer Deleted', `"${offerToDelete.title}" has been deleted.`)
    }
    setDeleteModal({ isOpen: false, offer: null })

    if (viewMode === 'edit' || viewMode === 'view') {
      handleOpenList()
    }
  }

  return (
    <div className="space-y-6">
      {viewMode === 'list' && (
        <OffersListView
          offers={offers}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onOpenView={handleOpenView}
          onOpenDelete={(offer) => setDeleteModal({ isOpen: true, offer })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {viewMode === 'add' && (
        <AddOfferView onBack={handleOpenList} onSave={handleSaveAdd} />
      )}

      {viewMode === 'edit' && (
        <EditOfferView
          offer={selectedOffer}
          onBack={handleOpenList}
          onSave={handleSaveEdit}
        />
      )}

      {viewMode === 'view' && (
        <OfferDetailsView
          offer={selectedOffer}
          onBack={handleOpenList}
          onEdit={() => handleOpenEdit(selectedOffer)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, offer: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Offer"
        message={
          deleteModal.offer
            ? `Are you sure you want to delete the offer "${deleteModal.offer.title}"? This promotional banner will be removed from customer apps immediately.`
            : 'Are you sure you want to delete this offer?'
        }
        confirmText="Delete Offer"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}
