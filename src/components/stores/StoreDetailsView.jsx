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
  faCheckCircle,
  faBoxOpen,
  faBoxesPacking,
  faTruck,
  faMotorcycle,
  faStar,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'
import ToggleButton from '../ui/ToggleButton'
import {
  getStoreStaffApi,
  assignStoreStaffApi,
  unassignStoreStaffApi,
  getStoreDeliveryStaffApi,
  assignStoreDeliveryStaffApi,
  unassignStoreDeliveryStaffApi,
  getAdminStaffApi,
  getAdminDeliveryStaffApi
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

  const [activeRosterTab, setActiveRosterTab] = useState('packers') // 'managers' | 'packers' | 'riders' | 'all'
  const [managers, setManagers] = useState(store?.managers || [])
  const [packers, setPackers] = useState(store?.packers || [])
  const [riders, setRiders] = useState(store?.deliveryStaff || [])
  const [loadingRoster, setLoadingRoster] = useState(false)

  // Assignment Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assignCategory, setAssignCategory] = useState('packer') // 'manager' | 'packer' | 'rider'
  const [modalTab, setModalTab] = useState('existing') // 'existing' | 'new'
  const [existingOptions, setExistingOptions] = useState([])
  const [selectedEntityId, setSelectedEntityId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New Staff / Rider Form State
  const [newForm, setNewForm] = useState({
    name: '',
    fathersName: '',
    email: '',
    phone: '',
    role: 'Order Packer',
    vehicleType: 'Bike',
    vehicleNumber: '',
    password: 'staff123'
  })

  // Load all staff & riders for this store
  const loadRoster = async () => {
    if (!store?.id) return
    try {
      setLoadingRoster(true)
      const [staffRes, ridersRes] = await Promise.allSettled([
        getStoreStaffApi(store.id),
        getStoreDeliveryStaffApi(store.id)
      ])

      if (staffRes.status === 'fulfilled' && staffRes.value) {
        const staffData = staffRes.value
        setManagers(staffData.managers || [])
        setPackers(staffData.packers || [])
      }

      if (ridersRes.status === 'fulfilled' && ridersRes.value) {
        const ridersData = ridersRes.value
        setRiders(ridersData.riders || ridersData.deliveryStaff || [])
      }
    } catch (err) {
      console.warn('Failed to load store roster:', err)
    } finally {
      setLoadingRoster(false)
    }
  }

  useEffect(() => {
    if (store?.id) {
      loadRoster()
    }
  }, [store?.id])

  // Open Assignment Modal
  const openAssignModalFor = async (category = 'packer') => {
    setAssignCategory(category)
    setIsAssignModalOpen(true)
    setModalTab('existing')
    setSelectedEntityId('')

    try {
      if (category === 'rider') {
        const res = await getAdminDeliveryStaffApi()
        const list = res.deliveryStaff || res.riders || res.data || []
        // Riders not assigned or assigned to other stores
        setExistingOptions(list)
        if (list.length > 0) setSelectedEntityId(list[0].id)
      } else {
        const res = await getAdminStaffApi()
        const list = res.staff || res.data || []
        if (category === 'manager') {
          const filtered = list.filter((s) => s.role === 'Store Manager' || !s.storeId)
          setExistingOptions(filtered)
          if (filtered.length > 0) setSelectedEntityId(filtered[0].id)
        } else {
          // Packers & Pickers
          const filtered = list.filter((s) =>
            s.role?.toLowerCase().includes('pack') ||
            s.role?.toLowerCase().includes('pick') ||
            s.role === 'Store Associate' ||
            !s.storeId
          )
          setExistingOptions(filtered)
          if (filtered.length > 0) setSelectedEntityId(filtered[0].id)
        }
      }
    } catch (err) {
      console.warn('Could not load candidates for assignment:', err)
    }
  }

  // Handle Assigning Existing Candidate
  const handleAssignExisting = async () => {
    if (!selectedEntityId) {
      toast.error('Selection Error', 'Please select a person from the list.')
      return
    }
    setIsSubmitting(true)
    try {
      if (assignCategory === 'rider') {
        const res = await assignStoreDeliveryStaffApi(store.id, { deliveryStaffId: selectedEntityId })
        toast.success('Rider Assigned', res.message || 'Delivery rider assigned to this store!')
      } else {
        const role = assignCategory === 'manager' ? 'Store Manager' : newForm.role || 'Order Packer'
        const res = await assignStoreStaffApi(store.id, { staffId: selectedEntityId, role })
        toast.success('Staff Assigned', res.message || 'Staff assigned to this store!')
      }
      setIsAssignModalOpen(false)
      loadRoster()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Assignment Failed', err.message || 'Failed to complete assignment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Onboarding New Candidate directly for this store
  const handleCreateNew = async (e) => {
    e.preventDefault()
    if (!newForm.name.trim()) {
      toast.error('Validation Error', 'Full name is required.')
      return
    }
    setIsSubmitting(true)
    try {
      if (assignCategory === 'rider') {
        if (!newForm.phone.trim()) {
          toast.error('Validation Error', 'Contact mobile number is required.')
          setIsSubmitting(false)
          return
        }
        const res = await assignStoreDeliveryStaffApi(store.id, {
          name: newForm.name.trim(),
          phone: newForm.phone.trim(),
          email: newForm.email.trim() || undefined,
          vehicleType: newForm.vehicleType || 'Bike',
          vehicleNumber: newForm.vehicleNumber.trim() || undefined,
        })
        toast.success('Rider Onboarded', res.message || 'New delivery partner onboarded for this store!')
      } else {
        if (!newForm.email.trim()) {
          toast.error('Validation Error', 'Login email is required.')
          setIsSubmitting(false)
          return
        }
        const role = assignCategory === 'manager' ? 'Store Manager' : (newForm.role || 'Order Packer')
        const res = await assignStoreStaffApi(store.id, {
          name: newForm.name.trim(),
          fathersName: newForm.fathersName.trim(),
          email: newForm.email.trim(),
          phone: newForm.phone.trim(),
          role,
          password: newForm.password.trim() || 'staff123'
        })
        toast.success('Staff Onboarded', res.message || 'New personnel onboarded & assigned!')
      }

      setIsAssignModalOpen(false)
      setNewForm({
        name: '',
        fathersName: '',
        email: '',
        phone: '',
        role: 'Order Packer',
        vehicleType: 'Bike',
        vehicleNumber: '',
        password: 'staff123'
      })
      loadRoster()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Onboarding Failed', err.message || 'Failed to onboard personnel.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Unassign Staff (Manager / Packer / Picker)
  const handleUnassignStaff = async (staffMember) => {
    if (!window.confirm(`Unassign "${staffMember.name}" (${staffMember.role}) from ${store.title}?`)) {
      return
    }
    try {
      const res = await unassignStoreStaffApi(store.id, staffMember.id || staffMember._id)
      toast.info('Staff Unassigned', res.message || `Unassigned ${staffMember.name}.`)
      loadRoster()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Unassign Error', err.message || 'Failed to unassign staff.')
    }
  }

  // Unassign Delivery Rider
  const handleUnassignRider = async (rider) => {
    if (!window.confirm(`Unassign Delivery Rider "${rider.name}" from ${store.title}?`)) {
      return
    }
    try {
      const res = await unassignStoreDeliveryStaffApi(store.id, rider.id || rider._id)
      toast.info('Rider Unassigned', res.message || `Unassigned ${rider.name}.`)
      loadRoster()
      onRefreshStore?.()
    } catch (err) {
      toast.error('Unassign Error', err.message || 'Failed to unassign rider.')
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
                Store Details & Roster
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
            size="md"
            onClick={() => onEdit(store)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Store
          </Button>
          <button
            type="button"
            onClick={() => onDelete(store)}
            className="w-10 h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            title="Delete this store branch"
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (4 cols): Store Image, Summary & Dark Store Badge */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="relative h-56 w-full bg-slate-100 overflow-hidden group">
              <img
                src={store.image || '/supermart-bg.jpg'}
                alt={store.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-[#064C23] text-white px-2.5 py-1 rounded-lg shadow-xs mb-1.5">
                  {store.isDarkStore ? '10-Min Dark Store' : 'Walk-in Supermarket'}
                </span>
                <h3 className="text-lg font-black leading-tight drop-shadow-xs">
                  {store.name || store.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {store.subtitle || store.location}
                </p>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="p-5 grid grid-cols-3 divide-x divide-slate-100 text-center border-b border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Managers</p>
                <p className="text-base font-black text-slate-800">{managers.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Packers</p>
                <p className="text-base font-black text-[#064C23]">{packers.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Fleet Riders</p>
                <p className="text-base font-black text-amber-700">{riders.length}</p>
              </div>
            </div>

            {/* Address & Logistics Info */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Full Physical Address
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-1 flex items-start space-x-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[#064C23] mt-0.5 shrink-0" />
                  <span>{store.address || store.subtitle || 'Address not configured'}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">City / State</span>
                  <p className="font-semibold text-slate-700">{store.city || 'Noida'}, {store.state || 'UP'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pincode</span>
                  <p className="font-semibold text-slate-700 font-mono">{store.pincode || '201301'}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Covered Delivery Pincodes</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {store.pincodes && store.pincodes.length > 0 ? (
                    store.pincodes.map((pin) => (
                      <span key={pin} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                        {pin}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No specific service pincodes set</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Personnel Roster (Managers, Packers, Riders) & Operations */}
        <div className="lg:col-span-8 space-y-6">

          {/* Quick Info 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: GPS Coordinates */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Opening Hours</span>
                <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {store.operatingHours || '7:00 AM - 11:00 PM'}
              </p>
              <p className="text-[11px] text-slate-500">Daily business schedule</p>
            </div>

            {/* Card 4: Display Order */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
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

          {/* DEDICATED STORE PERSONNEL ROSTER: Managers, Packers & Delivery Fleet */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-base">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Assigned Personnel & Fulfillment Team
                    </h3>
                    <p className="text-xs text-slate-500">
                      Staff, Packers, and Delivery Fleet assigned by Super Admin to this store branch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add / Assign Buttons Dropdown / Action */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignModalFor('packer')}
                  icon={<FontAwesomeIcon icon={faBoxOpen} className="text-xs" />}
                >
                  + Assign Packer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignModalFor('rider')}
                  icon={<FontAwesomeIcon icon={faTruck} className="text-xs" />}
                >
                  + Assign Rider
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openAssignModalFor('manager')}
                  icon={<FontAwesomeIcon icon={faUserTie} className="text-xs" />}
                >
                  + Assign Manager
                </Button>
              </div>
            </div>

            {/* Roster Segmented Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveRosterTab('packers')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                  activeRosterTab === 'packers'
                    ? 'bg-[#064C23] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FontAwesomeIcon icon={faBoxOpen} />
                <span>Packers & Pickers</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeRosterTab === 'packers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {packers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRosterTab('managers')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                  activeRosterTab === 'managers'
                    ? 'bg-[#064C23] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FontAwesomeIcon icon={faUserTie} />
                <span>Store Managers</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeRosterTab === 'managers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {managers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRosterTab('riders')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                  activeRosterTab === 'riders'
                    ? 'bg-[#064C23] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FontAwesomeIcon icon={faMotorcycle} />
                <span>Delivery Fleet</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeRosterTab === 'riders' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {riders.length}
                </span>
              </button>
            </div>

            {/* 1. PACKERS & PICKERS TAB CONTENT */}
            {activeRosterTab === 'packers' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Order Pickers & Packers pick supermarket items from dark store shelves and prepare grocery bags.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAssignModalFor('packer')}
                    className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                  >
                    + Add another packer
                  </button>
                </div>

                {packers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {packers.map((p) => (
                      <div
                        key={p.id || p._id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-[#064C23]/40 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#064C23] to-[#25854b] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                              <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {p.name}
                              </h4>
                              {p.fathersName && (
                                <span className="text-[11px] text-slate-400 block truncate">
                                  S/O {p.fathersName}
                                </span>
                              )}
                              <span className="inline-flex items-center text-[10px] font-extrabold text-[#064C23] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                                {p.role || 'Order Packer'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnassignStaff(p)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Unassign Packer from this store"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center text-slate-600 truncate">
                            <FontAwesomeIcon icon={faEnvelope} className="w-3.5 text-slate-400 mr-1.5 text-[10px]" />
                            <span className="truncate">{p.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center font-mono text-slate-700">
                            <FontAwesomeIcon icon={faPhone} className="w-3.5 text-[#064C23] mr-1.5 text-[10px]" />
                            <span>{p.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl">
                      <FontAwesomeIcon icon={faBoxOpen} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No Packers Assigned Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Assign an existing packer or picker from staff directory, or onboard a new packer for this branch.
                    </p>
                    <div className="pt-1">
                      <Button variant="primary" size="sm" onClick={() => openAssignModalFor('packer')}>
                        Assign Packer Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. STORE MANAGERS TAB CONTENT */}
            {activeRosterTab === 'managers' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Store Managers have access to the Store Manager portal to adjust inventory and process incoming branch orders.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAssignModalFor('manager')}
                    className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                  >
                    + Add another manager
                  </button>
                </div>

                {managers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {managers.map((m) => (
                      <div
                        key={m.id || m._id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-[#064C23]/40 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
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
                            onClick={() => handleUnassignStaff(m)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Unassign Manager from this Store"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 text-xs space-y-1">
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
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl">
                      <FontAwesomeIcon icon={faUserTie} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No Store Manager Assigned</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      This store does not have any assigned manager yet.
                    </p>
                    <div className="pt-1">
                      <Button variant="primary" size="sm" onClick={() => openAssignModalFor('manager')}>
                        Assign Manager Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. DELIVERY FLEET TAB CONTENT */}
            {activeRosterTab === 'riders' && (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Delivery partners assigned for 10-15 minute grocery deliveries within this store's coverage radius.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAssignModalFor('rider')}
                    className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                  >
                    + Add delivery rider
                  </button>
                </div>

                {riders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {riders.map((r) => (
                      <div
                        key={r.id || r._id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-[#064C23]/40 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                              <FontAwesomeIcon icon={faMotorcycle} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {r.name}
                              </h4>
                              <div className="flex items-center space-x-1.5 mt-0.5">
                                <span className="inline-flex items-center text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  {r.vehicleType || 'Bike'}
                                </span>
                                {r.rating && (
                                  <span className="text-[10px] font-bold text-amber-600 flex items-center">
                                    <FontAwesomeIcon icon={faStar} className="mr-0.5 text-[8px]" />
                                    {r.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnassignRider(r)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Unassign Rider from this store"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center font-mono text-slate-700">
                            <FontAwesomeIcon icon={faPhone} className="w-3.5 text-[#064C23] mr-1.5 text-[10px]" />
                            <span>{r.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center text-slate-500 text-[11px]">
                            <FontAwesomeIcon icon={faTruck} className="w-3.5 text-slate-400 mr-1.5 text-[10px]" />
                            <span>{r.vehicleNumber ? `Reg: ${r.vehicleNumber}` : 'Status: ' + (r.status || 'Active')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl">
                      <FontAwesomeIcon icon={faMotorcycle} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">No Delivery Fleet Assigned</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Assign delivery riders to fulfill orders from this dark store branch.
                    </p>
                    <div className="pt-1">
                      <Button variant="primary" size="sm" onClick={() => openAssignModalFor('rider')}>
                        Assign Rider Now
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* Interactive Modal: Assign or Onboard Personnel (Manager / Packer / Rider) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-lg">
                  <FontAwesomeIcon
                    icon={
                      assignCategory === 'rider'
                        ? faMotorcycle
                        : assignCategory === 'packer'
                        ? faBoxOpen
                        : faUserTie
                    }
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {assignCategory === 'rider'
                      ? 'Assign Delivery Rider'
                      : assignCategory === 'packer'
                      ? 'Assign Order Packer / Picker'
                      : 'Assign Store Manager'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Store Branch: <strong className="text-slate-800">{store.title}</strong>
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
                Select from Registered Personnel
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
                Onboard New for this Store
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalTab === 'existing' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Choose candidate to assign:
                    </label>
                    {existingOptions.length > 0 ? (
                      <select
                        value={selectedEntityId}
                        onChange={(e) => setSelectedEntityId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                      >
                        {existingOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name} {opt.role ? `(${opt.role})` : `(${opt.vehicleType || 'Rider'})`} - {opt.phone || opt.email}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                        No candidates found in directory. Use the "Onboard New" tab above to create and assign one immediately!
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-2">
                      This user will be linked to <strong>{store.title}</strong> and will be visible in this store's roster.
                    </p>
                  </div>

                  {assignCategory === 'packer' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Role Designation
                      </label>
                      <select
                        value={newForm.role}
                        onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      >
                        <option value="Order Packer">Order Packer</option>
                        <option value="Order Picker">Order Picker</option>
                        <option value="Store Associate">Store Associate</option>
                      </select>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-end space-x-2.5">
                    <Button variant="outline" size="sm" onClick={() => setIsAssignModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAssignExisting}
                      disabled={isSubmitting || !selectedEntityId}
                    >
                      {isSubmitting ? 'Assigning...' : 'Assign to this Store'}
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateNew} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Deepak Rawat"
                        value={newForm.name}
                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>

                    {assignCategory === 'rider' ? (
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Vehicle Type
                        </label>
                        <select
                          value={newForm.vehicleType}
                          onChange={(e) => setNewForm({ ...newForm, vehicleType: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                        >
                          <option value="Bike">Motorbike</option>
                          <option value="Scooter">Scooter / Activa</option>
                          <option value="EV Scooter">Electric Bike / EV</option>
                          <option value="Bicycle">Bicycle</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mahesh Rawat"
                          value={newForm.fathersName}
                          onChange={(e) => setNewForm({ ...newForm, fathersName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Contact Mobile <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={newForm.phone}
                        onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Email Address {assignCategory !== 'rider' && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="email"
                        required={assignCategory !== 'rider'}
                        placeholder="packer@bazario.com"
                        value={newForm.email}
                        onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                  </div>

                  {assignCategory === 'packer' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Role Type
                      </label>
                      <select
                        value={newForm.role}
                        onChange={(e) => setNewForm({ ...newForm, role: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      >
                        <option value="Order Packer">Order Packer</option>
                        <option value="Order Picker">Order Picker</option>
                        <option value="Store Associate">Store Associate</option>
                      </select>
                    </div>
                  )}

                  {assignCategory === 'rider' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Vehicle Number (Registration Plate)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UP 16 AB 1234"
                        value={newForm.vehicleNumber}
                        onChange={(e) => setNewForm({ ...newForm, vehicleNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end space-x-2.5">
                    <Button variant="outline" size="sm" type="button" onClick={() => setIsAssignModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Onboarding...' : 'Onboard & Assign to Store'}
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
