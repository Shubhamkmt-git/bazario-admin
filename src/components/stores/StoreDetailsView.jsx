import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faClock,
  faSort,
  faCompass,
  faDoorOpen,
  faDoorClosed,
  faCopy,
  faPenToSquare,
  faTrashCan,
  faArrowUpRightFromSquare,
  faUserTie,
  faShieldHalved,
  faPlus,
  faEnvelope,
  faIdCard,
  faLock,
  faXmark,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'
import ToggleButton from '../ui/ToggleButton'
import {
  getStoreManagersApi,
  assignStoreManagerApi,
  unassignStoreManagerApi,
  getAdminStaffApi
} from '../../utils/adminApi'

// Utility to open Google Maps safely in new tab
const openGoogleMaps = (googleUrl, coordinates, title = '') => {
  let targetUrl = googleUrl ? googleUrl.trim() : ''
  if (!targetUrl && coordinates) {
    targetUrl = `https://maps.google.com/?q=${encodeURIComponent(coordinates.trim())}`
  } else if (!targetUrl && title) {
    targetUrl = `https://maps.google.com/?q=${encodeURIComponent(title.trim())}`
  }

  if (targetUrl) {
    const finalUrl = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
      ? targetUrl
      : `https://${targetUrl}`
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  }
}

export default function StoreDetailsView({
  store,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
  onRefreshStore,
}) {
  const toast = useToast()

  const [managers, setManagers] = useState(store?.managers || [])
  const [loadingManagers, setLoadingManagers] = useState(false)

  // Manager Assignment Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState('existing') // 'existing' | 'new'
  const [existingStaffList, setExistingStaffList] = useState([])
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New Manager Form State
  const [newManagerForm, setNewManagerForm] = useState({
    name: '',
    fathersName: '',
    email: '',
    phone: '',
    password: 'manager123'
  })

  const loadManagers = async () => {
    if (!store?.id) return
    try {
      setLoadingManagers(true)
      const res = await getStoreManagersApi(store.id)
      const list = res.managers || res.data || []
      setManagers(list)
    } catch (err) {
      console.warn('Failed to load store managers:', err)
    } finally {
      setLoadingManagers(false)
    }
  }

  useEffect(() => {
    if (store?.id) {
      loadManagers()
    }
  }, [store?.id])

  const openAssignModal = async () => {
    setIsAssignModalOpen(true)
    try {
      const res = await getAdminStaffApi()
      const list = res.staff || res.data || []
      // Show all Store Managers or staff that can be assigned
      const storeManagers = list.filter((s) => s.role === 'Store Manager' || !s.storeId)
      setExistingStaffList(storeManagers)
      if (storeManagers.length > 0) {
        setSelectedStaffId(storeManagers[0].id)
      }
    } catch (err) {
      console.warn('Could not load staff list:', err)
    }
  }

  const handleAssignExisting = async () => {
    if (!selectedStaffId) {
      toast.error('Selection Error', 'Please select a staff member to assign.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await assignStoreManagerApi(store.id, { staffId: selectedStaffId })
      toast.success('Manager Assigned', res.message || 'Store Manager assigned successfully!')
      setIsAssignModalOpen(false)
      loadManagers()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Assignment Failed', err.message || 'Failed to assign manager.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateNewManager = async (e) => {
    e.preventDefault()
    if (!newManagerForm.name.trim() || !newManagerForm.email.trim()) {
      toast.error('Validation Error', 'Name and email are required.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await assignStoreManagerApi(store.id, {
        name: newManagerForm.name.trim(),
        fathersName: newManagerForm.fathersName.trim(),
        email: newManagerForm.email.trim(),
        phone: newManagerForm.phone.trim(),
        password: newManagerForm.password.trim() || 'manager123'
      })
      toast.success('Manager Created', res.message || 'New Store Manager created and assigned!')
      setIsAssignModalOpen(false)
      setNewManagerForm({ name: '', fathersName: '', email: '', phone: '', password: 'manager123' })
      loadManagers()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Failed to Create Manager', err.message || 'Failed to create manager.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnassignManager = async (manager) => {
    if (!window.confirm(`Are you sure you want to unassign "${manager.name}" from ${store.title}?`)) {
      return
    }
    try {
      const res = await unassignStoreManagerApi(store.id, manager.id || manager._id)
      toast.info('Manager Unassigned', res.message || `Manager ${manager.name} unassigned.`)
      loadManagers()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Unassign Error', err.message || 'Failed to unassign manager.')
    }
  }

  if (!store) return null

  const handleCopyCoordinates = (coords) => {
    if (!coords) return
    navigator.clipboard.writeText(coords)
    toast.success('Copied', `Coordinates "${coords}" copied to clipboard!`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Stores"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Store Details
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Order #{store.sortingOrder || 1}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  store.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={store.status === 'Open' ? faDoorOpen : faDoorClosed}
                  className="mr-1 text-[10px]"
                />
                {store.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {store.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              {store.status === 'Open' ? 'Store Open' : 'Store Closed'}
            </span>
            <ToggleButton
              size="sm"
              checked={store.status === 'Open'}
              onChange={() => onToggleStatus(store)}
              activeColor="#064C23"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(store)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Store
          </Button>
          <Button
            variant="cancel"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            onClick={() => onDelete(store)}
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
            src={store.image || '/supermart-bg.jpg'}
            alt={store.title}
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
                  Priority #{store.sortingOrder || 1}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{store.title}</h2>
              <p className="text-sm text-slate-200">{store.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => openGoogleMaps(store.googleUrl, store.coordinates, store.title)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#064C23] rounded-2xl text-xs font-extrabold transition-all shadow-lg self-start md:self-auto shrink-0 cursor-pointer group active:scale-95"
            >
              <FontAwesomeIcon icon={faMapLocationDot} className="text-sm text-[#A44F37]" />
              <span>Navigate via Google Maps</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
            </button>
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
                  onClick={() => handleCopyCoordinates(store.coordinates)}
                  className="text-xs text-[#064C23] hover:underline font-bold cursor-pointer inline-flex items-center space-x-1"
                  title="Copy coordinates"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="font-mono text-base font-bold text-slate-900">
                {store.coordinates || 'Not configured'}
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
                {store.phone || 'Not available'}
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
                {store.operatingHours || '7:00 AM - 11:00 PM'}
              </p>
              <p className="text-[11px] text-slate-500">Daily business schedule</p>
            </div>

            {/* Card 4: Sorting Order & Priority */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Display Order</span>
                <FontAwesomeIcon icon={faSort} className="text-[#064C23] text-xs" />
              </div>
              <p className="text-base font-bold text-slate-900 font-mono">
                #{store.sortingOrder || 1}
              </p>
              <p className="text-[11px] text-slate-500">App listing sequence</p>
            </div>
          </div>

          {/* Dedicated Section: Assigned Store Managers (Multiple Managers Supported) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
                    <FontAwesomeIcon icon={faUserTie} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Assigned Store Managers
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-[#064C23] border border-emerald-300">
                    {managers.length} {managers.length === 1 ? 'Manager' : 'Managers'} Assigned
                  </span>
                </div>
                <p className="text-xs text-slate-500 pl-10">
                  Multiple managers can be assigned to this branch to manage inventory, stock availability, and branch orders.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={openAssignModal}
                icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
              >
                Assign / Add Manager
              </Button>
            </div>

            {/* Managers Cards Grid */}
            {managers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {managers.map((m) => (
                  <div
                    key={m.id || m._id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#064C23]/40 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {m.name
                            ? m.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()
                            : 'SM'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {m.name}
                          </h4>
                          {m.fathersName && (
                            <span className="text-[11px] text-slate-400 block truncate">
                              S/O {m.fathersName}
                            </span>
                          )}
                          <span className="inline-flex items-center text-[10px] font-extrabold text-[#064C23] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                            <FontAwesomeIcon icon={faShieldHalved} className="mr-1 text-[8px]" />
                            Store Manager
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUnassignManager(m)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Unassign Manager from this Store"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                      <div className="flex items-center text-slate-600 truncate">
                        <FontAwesomeIcon icon={faEnvelope} className="w-3.5 text-slate-400 mr-1.5 text-[10px]" />
                        <span className="truncate">{m.email}</span>
                      </div>
                      <div className="flex items-center font-mono text-slate-700">
                        <FontAwesomeIcon icon={faPhone} className="w-3.5 text-[#064C23] mr-1.5 text-[10px]" />
                        <span>{m.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl">
                  <FontAwesomeIcon icon={faUserTie} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  No Store Manager Assigned
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  This store does not have any assigned manager yet. Click the button below to assign an existing staff manager or onboard a new manager.
                </p>
                <div className="pt-1">
                  <Button variant="primary" size="sm" onClick={openAssignModal}>
                    Assign Manager Now
                  </Button>
                </div>
              </div>
            )}
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
              <button
                type="button"
                onClick={() => openGoogleMaps(store.googleUrl, store.coordinates, store.title)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#064C23] hover:bg-[#08632f] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
                <span>Open in Maps</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 break-all select-all flex items-center justify-between gap-3">
              <span className="truncate">{store.googleUrl || `https://maps.google.com/?q=${encodeURIComponent(store.coordinates || store.title)}`}</span>
              <button
                type="button"
                onClick={() => {
                  const link = store.googleUrl || (store.coordinates ? `https://maps.google.com/?q=${encodeURIComponent(store.coordinates)}` : '')
                  if (link) {
                    navigator.clipboard.writeText(link)
                    toast.success('Copied URL', 'Google Maps link copied to clipboard!')
                  }
                }}
                className="text-xs font-bold text-[#064C23] hover:underline shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Assign or Onboard Store Manager */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-lg">
                  <FontAwesomeIcon icon={faUserTie} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Assign Store Manager
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assigning manager for: <strong className="text-slate-800">{store.title}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 pt-4 flex border-b border-slate-100 space-x-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('existing')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'existing'
                    ? 'border-[#064C23] text-[#064C23]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Select Existing Staff Manager
              </button>
              <button
                type="button"
                onClick={() => setModalTab('new')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'new'
                    ? 'border-[#064C23] text-[#064C23]'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Onboard New Manager for this Branch
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalTab === 'existing' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Choose Manager from Staff Directory
                    </label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                    >
                      {existingStaffList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.email}) {s.storeName ? `[Current: ${s.storeName}]` : '[Unassigned]'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Selecting an existing staff member will reassign them as Store Manager for <strong>{store.title}</strong>.
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-end space-x-2.5">
                    <Button variant="outline" size="sm" onClick={() => setIsAssignModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAssignExisting}
                      disabled={isSubmitting || !selectedStaffId}
                    >
                      {isSubmitting ? 'Assigning...' : 'Assign Manager'}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateNewManager} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Verma"
                        value={newManagerForm.name}
                        onChange={(e) => setNewManagerForm({ ...newManagerForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Suresh Verma"
                        value={newManagerForm.fathersName}
                        onChange={(e) => setNewManagerForm({ ...newManagerForm, fathersName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Login Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="manager.branch@bazario.com"
                        value={newManagerForm.email}
                        onChange={(e) => setNewManagerForm({ ...newManagerForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Contact Mobile
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={newManagerForm.phone}
                        onChange={(e) => setNewManagerForm({ ...newManagerForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Portal Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newManagerForm.password}
                      onChange={(e) => setNewManagerForm({ ...newManagerForm, password: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Default credentials for Store Manager portal login</p>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsAssignModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create & Assign to Store'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
