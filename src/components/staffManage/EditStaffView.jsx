import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faPhone,
  faEnvelope,
  faUser,
  faStore,
  faShieldHalved,
  faLock,
  faIdCard
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'
import { getAdminStoresApi } from '../../utils/adminApi'

const STAFF_ROLES = [
  'Store Manager',
  'Store Associate',
  'Order Picker',
  'Order Packer',
  'Store POC'
]

export default function EditStaffView({ staff, onBack, onSave }) {
  const toast = useToast()

  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    fathersName: staff?.fathersName || '',
    role: staff?.role || 'Store Manager',
    storeId: staff?.storeId || '',
    store: staff?.storeName || staff?.store || '',
    email: staff?.email || '',
    mobilenumber: staff?.mobilenumber || staff?.phone || '',
    password: '',
    image: staff?.image || '',
    status: staff?.status || 'Active'
  })

  // Load live stores
  useEffect(() => {
    getAdminStoresApi()
      .then((res) => {
        const list = res.stores || res.data || []
        if (Array.isArray(list) && list.length > 0) {
          setStores(list)
          // If staff has storeId matching a store or store name
          if (!formData.storeId) {
            const matched = list.find((s) => s.name === formData.store || s.title === formData.store)
            if (matched) {
              setFormData((prev) => ({ ...prev, storeId: matched.id }))
            }
          }
        }
      })
      .catch((err) => console.warn('Could not load stores for edit staff:', err))
  }, [])

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || '',
        fathersName: staff.fathersName || '',
        role: staff.role || 'Store Manager',
        storeId: staff.storeId || '',
        store: staff.storeName || staff.store || '',
        email: staff.email || '',
        mobilenumber: staff.mobilenumber || staff.phone || '',
        password: '',
        image: staff.image || '',
        status: staff.status || 'Active'
      })
    }
  }, [staff])

  const handleStoreChange = (e) => {
    const selectedId = e.target.value
    const matched = stores.find((s) => s.id === selectedId)
    setFormData((prev) => ({
      ...prev,
      storeId: selectedId,
      store: matched ? matched.name : selectedId
    }))
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Please enter staff member full name.')
      return
    }
    if (!formData.storeId && !formData.store) {
      toast.error('Validation Error', 'Please select which store this staff belongs to.')
      return
    }
    if (!formData.mobilenumber.trim()) {
      toast.error('Validation Error', 'Please enter a contact mobile number.')
      return
    }

    const updatedStaff = {
      ...staff,
      name: formData.name.trim(),
      fathersName: formData.fathersName.trim(),
      role: formData.role,
      storeId: formData.storeId,
      store: formData.store,
      storeName: formData.store,
      email: formData.email.trim().toLowerCase(),
      mobilenumber: formData.mobilenumber.trim(),
      phone: formData.mobilenumber.trim(),
      status: formData.status,
      image: formData.image,
      ...(formData.password && formData.password.trim() ? { password: formData.password.trim() } : {})
    }

    onSave(updatedStaff)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Store Personnel Management
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Staff Member
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update store staff role, credentials, outlet assignment, and employment status.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Single Unified Page Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Profile Image */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <ImageUploadFrame
              label="PROFILE PHOTO / AVATAR"
              aspectRatio="square"
              description="Upload staff passport photo or avatar (PNG, JPG, WEBP max 5MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />

            {/* Quick Role Note */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <span className="font-bold flex items-center">
                <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-[#064C23]" />
                Role & Access Level
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                <strong>Store Managers</strong> have portal access strictly for branch stock adjustments and order processing.
              </p>
            </div>
          </div>

          {/* Right Column (8 cols): Inputs */}
          <div className="lg:col-span-8 space-y-5">
            {/* Full Name & Father's Name in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="FULL NAME"
                placeholder="e.g. Ramesh Verma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<FontAwesomeIcon icon={faUser} className="text-xs text-slate-400" />}
                helperText="Official full name as per Aadhaar/Govt ID"
                required
              />

              <InputField
                label="FATHER'S NAME"
                placeholder="e.g. Suresh Verma"
                value={formData.fathersName}
                onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
                icon={<FontAwesomeIcon icon={faIdCard} className="text-xs text-slate-400" />}
                helperText="Father's full name"
              />
            </div>

            {/* Role & Store in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Role Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  DESIGNATION / ROLE <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-xs text-[#064C23]" />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Operational role in supermarket store</p>
              </div>

              {/* Store Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ASSIGNED STORE OUTLET <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faStore} className="text-xs text-[#064C23]" />
                  </div>
                  <select
                    value={formData.storeId || ''}
                    onChange={handleStoreChange}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                    required
                  >
                    <option value="" disabled>-- Select Store Branch --</option>
                    {stores.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.code}) - {st.city}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Branch where this staff member operates</p>
              </div>
            </div>

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="MOBILE NUMBER"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.mobilenumber}
                onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-[#064C23]" />}
                helperText="Primary contact number"
                required
              />

              <InputField
                label="EMAIL ADDRESS (LOGIN ID)"
                type="email"
                placeholder="e.g. manager.branch@bazario.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" />}
                helperText="Email used for portal login"
                required
              />
            </div>

            {/* Password & Status in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <InputField
                label="RESET / CHANGE PASSWORD"
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<FontAwesomeIcon icon={faLock} className="text-xs text-slate-400" />}
                helperText="Enter a new password only if resetting credentials"
              />

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  EMPLOYMENT STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  <option value="Active">Active (On Duty / Employed)</option>
                  <option value="Inactive">Inactive (On Leave / Suspended)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Employment and portal access status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
