import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import OffersListView from './OffersListView'
import AddOfferView from './AddOfferView'
import EditOfferView from './EditOfferView'
import OfferDetailsView from './OfferDetailsView'

const MANAGE_OFFERS_STORAGE_KEY = 'bazario_manage_offers'

const INITIAL_OFFERS = [
  {
    id: 1,
    title: 'Super Saver Weekend - Flat 40% Off on Fresh Fruits & Veggies',
    redirectionUrl: '/categories/farm-fresh-fruits-vegetables',
    image: '/supermart-bg.jpg',
    sortingOrder: 1,
    status: 'Active',
    createdAt: '2026-10-01'
  },
  {
    id: 2,
    title: 'Buy 1 Get 1 Free on Premium Dairy & Bakery Essentials',
    redirectionUrl: '/categories/dairy-bread-eggs',
    image: '',
    sortingOrder: 2,
    status: 'Active',
    createdAt: '2026-10-03'
  },
  {
    id: 3,
    title: 'Mega Festive Grocery Hamper - Up to 50% Off On Snacks & Sweets',
    redirectionUrl: '/categories/snacks-munchies',
    image: '',
    sortingOrder: 3,
    status: 'Inactive',
    createdAt: '2026-10-05'
  }
]

export default function ManageOffersView() {
  const toast = useToast()

  // Storage State
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem(MANAGE_OFFERS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_OFFERS
    } catch {
      return INITIAL_OFFERS
    }
  })

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
  const handleSaveAdd = (newOfferData) => {
    const nextId = offers.length > 0 ? Math.max(...offers.map((o) => o.id)) + 1 : 1
    const newOffer = {
      ...newOfferData,
      id: nextId,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setOffers([newOffer, ...offers])
    toast.success('Offer Created', `"${newOffer.title}" was added successfully.`)
    handleOpenList()
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

  const handleConfirmDelete = () => {
    if (!deleteModal.offer) return
    const offerToDelete = deleteModal.offer
    setOffers(offers.filter((o) => o.id !== offerToDelete.id))
    toast.success('Offer Deleted', `"${offerToDelete.title}" has been deleted.`)
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
