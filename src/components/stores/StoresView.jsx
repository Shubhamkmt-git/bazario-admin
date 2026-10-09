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
  faTrashCan,
  faArrowUpDown,
  faHashtag,
  faCompass,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'
import ActionButton from '../ui/ActionButton'
import AlertModal from '../ui/AlertModal'
import InputField from '../ui/InputField'
import ToggleButton from '../ui/ToggleButton'
import ImageUploadFrame from '../ui/ImageUploadFrame'
import { FormRow, FormActions } from '../ui/FormLayout'

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
  
  // Stores storage state
  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_STORES
    } catch {
      return INITIAL_STORES
    }
  })

  // Full-width view state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedStore, setSelectedStore] = useState(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, store: null })

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortingOrder: 1,
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

  // Sorted and filtered stores list
  const filteredStores = [...stores]
    .sort((a, b) => (Number(a.sortingOrder) || 999) - (Number(b.sortingOrder) || 999))
    .filter((store) => {
      const matchesStatus =
        statusFilter === 'all' || store.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        store.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (store.coordinates && store.coordinates.includes(searchQuery))
      return matchesStatus && matchesSearch
    })

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedStore(null)
  }

  const handleOpenAdd = () => {
    setSelectedStore(null)
    setFormData({
      title: '',
      subtitle: '',
      sortingOrder: stores.length + 1,
      image: '/supermart-bg.jpg',
      coordinates: '',
      googleUrl: '',
      status: 'Open',
      phone: '',
      operatingHours: '7:00 AM - 11:00 PM',
    })
    setViewMode('add')
  }

  const handleOpenEdit = (store) => {
    setSelectedStore(store)
    setFormData({
      title: store.title || '',
      subtitle: store.subtitle || '',
      sortingOrder: store.sortingOrder ?? 1,
      image: store.image || '/supermart-bg.jpg',
      coordinates: store.coordinates || '',
      googleUrl: store.googleUrl || '',
      status: store.status || 'Open',
      phone: store.phone || '',
      operatingHours: store.operatingHours || '7:00 AM - 11:00 PM',
    })
    setViewMode('edit')
  }

  const handleOpenView = (store) => {
    setSelectedStore(store)
    setViewMode('view')
  }

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please enter a store title / name.')
      return
    }

    const payload = {
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || 1,
    }

    if (viewMode === 'edit' && selectedStore) {
      // Update store
      const updatedList = stores.map((s) =>
        s.id === selectedStore.id
          ? {
              ...s,
              ...payload,
            }
          : s
      )
      setStores(updatedList)
      setSelectedStore({ ...selectedStore, ...payload })
      toast.success('Store Updated', `"${formData.title}" updated successfully!`)
      setViewMode('list')
    } else {
      // Create new store
      const newStore = {
        id: Date.now(),
        ...payload,
      }
      setStores([...stores, newStore])
      toast.success('Store Added', `"${formData.title}" added to store listings!`)
      setViewMode('list')
    }
  }

  const handleDeleteStore = (storeId, storeTitle) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId))
    setDeleteModal({ isOpen: false, store: null })
    if (selectedStore && selectedStore.id === storeId) {
      setViewMode('list')
      setSelectedStore(null)
    }
    toast.success('Store Removed', `"${storeTitle}" removed from listings.`)
  }

  const handleToggleStatus = (store) => {
    const newStatus = store.status === 'Open' ? 'Closed' : 'Open'
    const updatedList = stores.map((s) => (s.id === store.id ? { ...s, status: newStatus } : s))
    setStores(updatedList)
    if (selectedStore && selectedStore.id === store.id) {
      setSelectedStore({ ...selectedStore, status: newStatus })
    }
    toast.info('Status Changed', `"${store.title}" is now ${newStatus}.`)
  }

  const handleCopyCoordinates = (coords) => {
    if (!coords) return
    navigator.clipboard.writeText(coords)
    toast.success('Copied', `Coordinates "${coords}" copied to clipboard!`)
  }

  /* ==========================================================================
     FULL-WIDTH PAGE 1: ADD / EDIT STORE FORM (MINIMAL & CLEAN LAYOUT)
     ========================================================================== */
  if (viewMode === 'add' || viewMode === 'edit') {
    const isEdit = viewMode === 'edit'
    return (
      <div className="w-full space-y-6 pb-20">
        {/* Full-width Top Action Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <BackButton
              label="Back to Stores"
              onClick={handleGoToList}
              variant="bordered"
            />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                {isEdit ? 'Store Editor' : 'New Store Setup'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isEdit ? `Edit ${selectedStore?.title}` : 'Add New Store Location'}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            <Button
              variant="cancel"
              size="sm"
              onClick={handleGoToList}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleFormSubmit}
            >
              {isEdit ? 'Save Changes' : 'Publish Store'}
            </Button>
          </div>
        </div>

        {/* Minimal Clean Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* Group 1: Store Branding & Sorting */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Basic Store Identity
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step 1
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <InputField
                    label="Store Title / Name"
                    required
                    placeholder="e.g. Bazario Central Superstore #01"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    helperText="Primary brand and branch identifier"
                  />
                </div>

                <div className="md:col-span-1">
                  <InputField
                    label="Sorting Order"
                    type="number"
                    min="1"
                    icon={<FontAwesomeIcon icon={faArrowUpDown} className="text-xs text-slate-400" />}
                    placeholder="1"
                    value={formData.sortingOrder}
                    onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                    helperText="Display priority (1 = Top)"
                  />
                </div>
              </div>

              <InputField
                label="Store Subtitle / Area Description"
                placeholder="e.g. Flagship Mega Mart & Fresh Produce Hub, Sector 18"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                helperText="Branch location or shopping complex landmark"
              />
            </div>

            {/* Group 2: Location & Mapping */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Geo Coordinates & Navigation
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Step 2
                </span>
              </div>

              <FormRow cols={2}>
                <InputField
                  label="GPS Coordinates (Lat, Long)"
                  icon={<FontAwesomeIcon icon={faLocationDot} className="text-xs text-[#064C23]" />}
                  placeholder="e.g. 28.5708, 77.3261"
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                  helperText="Latitude, Longitude coordinates"
                />

                <InputField
                  label="Google Maps Location URL"
                  icon={<FontAwesomeIcon icon={faMapLocationDot} className="text-xs text-[#A44F37]" />}
                  placeholder="e.g. https://maps.google.com/?q=28.5708,77.3261"
                  value={formData.googleUrl}
                  onChange={(e) => setFormData({ ...formData, googleUrl: e.target.value })}
                  helperText="Google Maps share link for directions"
                />
              </FormRow>
            </div>

            {/* Group 3: Contact & Hours */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Store Contact & Operating Hours
                </span>
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Step 3
                </span>
              </div>

              <FormRow cols={2}>
                <InputField
                  label="Contact Helpline Phone"
                  icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-slate-400" />}
                  placeholder="e.g. +91 98111 22334"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  helperText="Branch phone or customer support number"
                />

                <InputField
                  label="Operating Hours"
                  icon={<FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />}
                  placeholder="e.g. 7:00 AM - 11:00 PM"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  helperText="Daily opening and closing schedule"
                />
              </FormRow>
            </div>

            {/* Group 4: Store Photo */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Store Facade Photo
                </span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Step 4
                </span>
              </div>

              <ImageUploadFrame
                label="Store Front Photo / Banner"
                aspectRatio="banner"
                value={formData.image}
                onChange={(img) => setFormData({ ...formData, image: img })}
              />
            </div>

            {/* Group 5: Operating Status Toggle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-800">Store Live Operating Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      formData.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {formData.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Controls whether this outlet accepts orders on the app and web.
                </p>
              </div>
              <ToggleButton
                enabled={formData.status === 'Open'}
                onChange={(enabled) => setFormData({ ...formData, status: enabled ? 'Open' : 'Closed' })}
                activeColor="#064C23"
              />
            </div>

            {/* Bottom Form Actions */}
            <FormActions align="right">
              <Button
                type="button"
                variant="cancel"
                size="md"
                onClick={handleGoToList}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                {isEdit ? 'Save Changes' : 'Publish Store'}
              </Button>
            </FormActions>
          </form>
        </div>
      </div>
    )
  }

  /* ==========================================================================
     FULL-WIDTH PAGE 2: VIEW STORE DETAILS
     ========================================================================== */
  if (viewMode === 'view' && selectedStore) {
    return (
      <div className="w-full space-y-6 pb-20">
        {/* Full-width Top Action Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <BackButton
              label="Back to Stores"
              onClick={handleGoToList}
              variant="bordered"
            />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                  Store Details
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  Order #{selectedStore.sortingOrder || 1}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedStore.status === 'Open'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={selectedStore.status === 'Open' ? faDoorOpen : faDoorClosed}
                    className="mr-1 text-[10px]"
                  />
                  {selectedStore.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedStore.title}
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleStatus(selectedStore)}
              icon={
                <FontAwesomeIcon
                  icon={selectedStore.status === 'Open' ? faDoorClosed : faDoorOpen}
                  className="text-xs"
                />
              }
            >
              Mark as {selectedStore.status === 'Open' ? 'Closed' : 'Open'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenEdit(selectedStore)}
              icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
            >
              Edit Store
            </Button>
            <Button
              variant="cancel"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              onClick={() => setDeleteModal({ isOpen: true, store: selectedStore })}
              icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Full-width Details Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Banner Image with Live Overlay */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
            <img
              src={selectedStore.image || '/supermart-bg.jpg'}
              alt={selectedStore.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#A44F37] text-white shadow-xs">
                    <FontAwesomeIcon icon={faStore} className="mr-1.5 text-[11px]" />
                    Bazario Supermarket
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-white/20 text-white backdrop-blur-xs">
                    Priority #{selectedStore.sortingOrder || 1}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{selectedStore.title}</h2>
                <p className="text-sm text-slate-200">{selectedStore.subtitle}</p>
              </div>

              {selectedStore.googleUrl && (
                <a
                  href={selectedStore.googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#064C23] rounded-2xl text-xs font-extrabold transition-all shadow-lg self-start md:self-auto shrink-0 group"
                >
                  <FontAwesomeIcon icon={faMapLocationDot} className="text-sm" />
                  <span>Navigate via Google Maps</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Grid Overview of Store Metadata */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: GPS Coordinates */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">GPS Coordinates</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCoordinates(selectedStore.coordinates)}
                    className="text-xs text-[#064C23] hover:underline font-bold cursor-pointer inline-flex items-center space-x-1"
                    title="Copy coordinates"
                  >
                    <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="font-mono text-base font-bold text-slate-900">
                  {selectedStore.coordinates || 'Not configured'}
                </p>
                <p className="text-[11px] text-slate-500">Precise map coordinates</p>
              </div>

              {/* Card 2: Contact Phone */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Store Contact</span>
                  <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
                </div>
                <p className="text-base font-bold text-slate-900">
                  {selectedStore.phone || 'Not available'}
                </p>
                <p className="text-[11px] text-slate-500">Helpline / counter phone</p>
              </div>

              {/* Card 3: Operating Hours */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Opening Hours</span>
                  <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
                </div>
                <p className="text-base font-bold text-slate-900">
                  {selectedStore.operatingHours || '7:00 AM - 11:00 PM'}
                </p>
                <p className="text-[11px] text-slate-500">Daily business schedule</p>
              </div>

              {/* Card 4: Sorting Order & Priority */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Display Order</span>
                  <FontAwesomeIcon icon={faArrowUpDown} className="text-[#064C23] text-xs" />
                </div>
                <p className="text-base font-bold text-slate-900 font-mono">
                  #{selectedStore.sortingOrder || 1}
                </p>
                <p className="text-[11px] text-slate-500">App listing sequence</p>
              </div>
            </div>

            {/* Google Maps Location Preview Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faCompass} className="text-[#064C23]" />
                    <span>Google Maps Destination URL</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hyperlink for customer directions and rider delivery navigation.
                  </p>
                </div>
                {selectedStore.googleUrl && (
                  <a
                    href={selectedStore.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#064C23] hover:bg-[#08632f] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
                  >
                    <span>Open in Maps</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                  </a>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 break-all select-all flex items-center justify-between gap-3">
                <span className="truncate">{selectedStore.googleUrl || 'No Google Maps URL configured.'}</span>
                {selectedStore.googleUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedStore.googleUrl)
                      toast.success('Copied URL', 'Google Maps link copied to clipboard!')
                    }}
                    className="text-xs font-bold text-[#064C23] hover:underline shrink-0 cursor-pointer"
                  >
                    Copy Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AlertModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, store: null })}
          onConfirm={() => handleDeleteStore(deleteModal.store?.id, deleteModal.store?.title)}
          type="danger"
          title="Delete Store Location"
          description={`Are you sure you want to delete "${deleteModal.store?.title}"? All associated store mapping data will be permanently removed.`}
          confirmText="Yes, Delete Store"
          cancelText="Cancel"
        />
      </div>
    )
  }

  /* ==========================================================================
     FULL-WIDTH PAGE 0: STORES DIRECTORY TABLE (DEFAULT LIST)
     ========================================================================== */
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
              Manage listed supermarket branches, sorting order priority, GPS coordinates, and live status.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
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
                <th className="px-6 py-4 w-20">Order</th>
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

                    {/* Sorting Order */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 border border-slate-200">
                        {store.sortingOrder ?? index + 1}
                      </span>
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
                          <button
                            type="button"
                            onClick={() => handleOpenView(store)}
                            className="font-bold text-slate-900 text-sm block leading-snug hover:text-[#064C23] text-left cursor-pointer transition-colors"
                          >
                            {store.title}
                          </button>
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

                    {/* Actions: Full-width Page Switchers */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => handleOpenView(store)}
                        title="View Full Page"
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => handleOpenEdit(store)}
                        title="Edit Full Page"
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => setDeleteModal({ isOpen: true, store })}
                        title="Delete Store"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No stores found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  )
}
