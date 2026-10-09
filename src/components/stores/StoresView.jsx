import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faArrowUpRightFromSquare,
  faDoorOpen,
  faDoorClosed,
  faPhone,
  faClock,
  faRotateRight,
  faMapLocationDot,
  faCopy,
  faPenToSquare,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import Modal from '../ui/Modal'
import AlertModal from '../ui/AlertModal'
import InputField from '../ui/InputField'
import ToggleButton from '../ui/ToggleButton'
import ImageUploadFrame from '../ui/ImageUploadFrame'
import { FormRow, FormActions } from '../ui/FormLayout'

const STORES_STORAGE_KEY = 'bazario_stores_data'

const INITIAL_STORES = [
  {
    id: 1,
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
  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_STORES
    } catch {
      return INITIAL_STORES
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [viewingStore, setViewingStore] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, store: null })

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '/supermart-bg.jpg',
    coordinates: '',
    googleUrl: '',
    status: 'Open',
    phone: '',
    operatingHours: '7:00 AM - 11:00 PM',
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores))
    } catch (e) {
      console.error('Failed to persist stores', e)
    }
  }, [stores])

  const filteredStores = stores.filter((store) => {
    const matchesStatus =
      statusFilter === 'all' || store.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSearch =
      store.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.coordinates && store.coordinates.includes(searchQuery))
    return matchesStatus && matchesSearch
  })

  const handleOpenAddModal = () => {
    setEditingStore(null)
    setFormData({
      title: '',
      subtitle: '',
      image: '/supermart-bg.jpg',
      coordinates: '',
      googleUrl: '',
      status: 'Open',
      phone: '',
      operatingHours: '7:00 AM - 11:00 PM',
    })
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (store) => {
    setEditingStore(store)
    setFormData({
      title: store.title,
      subtitle: store.subtitle,
      image: store.image || '/supermart-bg.jpg',
      coordinates: store.coordinates || '',
      googleUrl: store.googleUrl || '',
      status: store.status || 'Open',
      phone: store.phone || '',
      operatingHours: store.operatingHours || '7:00 AM - 11:00 PM',
    })
    setIsFormModalOpen(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formData.title) {
      toast.error('Validation Error', 'Please provide a store title.')
      return
    }

    if (editingStore) {
      // Update
      const updated = stores.map((s) =>
        s.id === editingStore.id
          ? {
              ...s,
              ...formData,
            }
          : s
      )
      setStores(updated)
      toast.success('Store Updated', `"${formData.title}" details updated.`)
    } else {
      // Create new
      const newStore = {
        id: Date.now(),
        ...formData,
      }
      setStores([newStore, ...stores])
      toast.success('Store Added', `"${formData.title}" has been listed.`)
    }

    setIsFormModalOpen(false)
  }

  const handleDeleteStore = (storeId, storeTitle) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId))
    setDeleteModal({ isOpen: false, store: null })
    toast.success('Store Removed', `"${storeTitle}" was deleted from listings.`)
  }

  const handleToggleStatus = (store) => {
    const newStatus = store.status === 'Open' ? 'Closed' : 'Open'
    const updated = stores.map((s) => (s.id === store.id ? { ...s, status: newStatus } : s))
    setStores(updated)
    toast.info('Status Changed', `"${store.title}" is now marked as ${newStatus}.`)
  }

  const handleCopyCoordinates = (coords) => {
    if (!coords) return
    navigator.clipboard.writeText(coords)
    toast.success('Copied', `Coordinates ${coords} copied to clipboard!`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store Locations & Outlets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage listed supermarket branches, GPS coordinates, Google Maps URLs, and live opening status.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Add New Store
          </Button>
        </div>
      </div>

      {/* Stores List / Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name, area, coordinates..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
              {['all', 'open', 'closed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#064C23] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-3 py-1.5 rounded-xl border border-[#bae2cb]">
              {filteredStores.length} Stores
            </span>
          </div>
        </div>

        {/* Stores Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4">Store Outlet</th>
                <th className="px-6 py-4">Area & Subtitle</th>
                <th className="px-6 py-4">GPS Coordinates</th>
                <th className="px-6 py-4">Google Maps</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStores.length > 0 ? (
                filteredStores.map((store, index) => (
                  <tr key={store.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Index */}
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </td>

                    {/* Store Name & Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={store.image || '/supermart-bg.jpg'}
                          alt={store.title}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 text-sm block leading-snug">
                            {store.title}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center mt-0.5">
                            <FontAwesomeIcon icon={faPhone} className="mr-1 text-[10px]" />
                            {store.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Subtitle / Area */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[220px]">
                      <p className="line-clamp-2">{store.subtitle}</p>
                    </td>

                    {/* Coordinates */}
                    <td className="px-6 py-4 text-xs font-mono">
                      {store.coordinates ? (
                        <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                          <FontAwesomeIcon icon={faLocationDot} className="text-[#064C23] text-[10px]" />
                          <span className="font-bold">{store.coordinates}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCoordinates(store.coordinates)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                            title="Copy coordinates"
                          >
                            <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">Not set</span>
                      )}
                    </td>

                    {/* Google Maps URL Link */}
                    <td className="px-6 py-4">
                      {store.googleUrl ? (
                        <a
                          href={store.googleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#f0f9f3] hover:bg-[#e2f3e8] text-[#064C23] border border-[#bae2cb] rounded-xl text-xs font-bold transition-all shadow-2xs group"
                        >
                          <FontAwesomeIcon icon={faMapLocationDot} />
                          <span>View Map</span>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="text-[10px] group-hover:translate-x-0.5 transition-transform"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No URL</span>
                      )}
                    </td>

                    {/* Status Badge Toggle */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(store)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          store.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <FontAwesomeIcon
                          icon={store.status === 'Open' ? faDoorOpen : faDoorClosed}
                          className="mr-1.5 text-[11px]"
                        />
                        {store.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => setViewingStore(store)}
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => handleOpenEditModal(store)}
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => setDeleteModal({ isOpen: true, store })}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No stores found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add / Edit Store Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingStore ? `Edit Store - ${editingStore.title}` : 'Add New Store Location'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormRow cols={1}>
            <InputField
              label="Store Title / Name"
              required
              placeholder="e.g. Bazario Central Superstore #01"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormRow>

          <FormRow cols={1}>
            <InputField
              label="Store Subtitle / Area Description"
              placeholder="e.g. Flagship Mega Mart & Fresh Produce Hub, Sector 18"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </FormRow>

          <FormRow cols={2}>
            <InputField
              label="GPS Coordinates (Lat, Long)"
              icon={<FontAwesomeIcon icon={faLocationDot} className="text-xs" />}
              placeholder="e.g. 28.5708, 77.3261"
              value={formData.coordinates}
              onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              helperText="Latitude, Longitude for map pins"
            />

            <InputField
              label="Google Maps Location URL"
              icon={<FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />}
              placeholder="e.g. https://maps.google.com/?q=28.5708,77.3261"
              value={formData.googleUrl}
              onChange={(e) => setFormData({ ...formData, googleUrl: e.target.value })}
              helperText="Full Google Maps link for directions"
            />
          </FormRow>

          <FormRow cols={2}>
            <InputField
              label="Store Contact Phone"
              icon={<FontAwesomeIcon icon={faPhone} className="text-xs" />}
              placeholder="e.g. +91 98111 22334"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <InputField
              label="Operating Hours"
              icon={<FontAwesomeIcon icon={faClock} className="text-xs" />}
              placeholder="e.g. 7:00 AM - 11:00 PM"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            />
          </FormRow>

          {/* Store Image Upload Frame */}
          <ImageUploadFrame
            label="Store Front Photo / Banner"
            aspectRatio="banner"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
          />

          {/* Operating Status Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Store Operating Status</h4>
              <p className="text-xs text-slate-500">
                Mark store as currently <span className="font-bold text-emerald-700">Open</span> for customer orders or <span className="font-bold text-rose-600">Closed</span>.
              </p>
            </div>
            <ToggleButton
              enabled={formData.status === 'Open'}
              onChange={(enabled) => setFormData({ ...formData, status: enabled ? 'Open' : 'Closed' })}
              activeColor="#064C23"
            />
          </div>

          <FormActions align="right">
            <Button
              type="button"
              variant="cancel"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingStore ? 'Save Changes' : 'Add Store'}
            </Button>
          </FormActions>
        </form>
      </Modal>

      {/* MODAL 2: View Store Details Modal */}
      {viewingStore && (
        <Modal
          isOpen={Boolean(viewingStore)}
          onClose={() => setViewingStore(null)}
          title={viewingStore.title}
          size="md"
        >
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={viewingStore.image || '/supermart-bg.jpg'}
                alt={viewingStore.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                  viewingStore.status === 'Open'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {viewingStore.status}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div>
                <p className="text-slate-400 uppercase font-bold text-[10px]">Subtitle / Area Description</p>
                <p className="text-sm font-semibold text-slate-800">{viewingStore.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <p className="text-slate-400 font-bold text-[10px]">GPS Coordinates</p>
                  <p className="font-mono font-bold text-slate-700">{viewingStore.coordinates || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-[10px]">Store Phone</p>
                  <p className="font-semibold text-slate-700">{viewingStore.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200">
                <p className="text-slate-400 font-bold text-[10px]">Operating Hours</p>
                <p className="font-semibold text-slate-700">{viewingStore.operatingHours || '7:00 AM - 11:00 PM'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {viewingStore.googleUrl ? (
                <a
                  href={viewingStore.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#064C23] hover:bg-[#096330] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <FontAwesomeIcon icon={faMapLocationDot} />
                  <span>Open in Google Maps</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                </a>
              ) : (
                <div />
              )}

              <Button variant="secondary" size="sm" onClick={() => setViewingStore(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: Delete Store Modal */}
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
    </div>
  )
}
