import React, { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faPhone,
  faEnvelope,
  faUser,
  faStore
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

const DEFAULT_STORES = [
  'Bazario Central Superstore #01',
  'Bazario Express Store - Cyber City',
  'Bazario Supermarket - Green Park',
  'Bazario Daily Outlet - Indirapuram',
  'Bazario Hub - Sector 62 Noida'
]

export default function EditStaffView({ staff, onBack, onSave }) {
  const toast = useToast()

  // Dynamically load stores from localStorage if available
  const availableStores = useMemo(() => {
    try {
      const saved = localStorage.getItem('bazario_stores_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const titles = parsed.map((s) => s.title || s.name).filter(Boolean)
          if (titles.length > 0) return titles
        }
      }
    } catch {}
    return DEFAULT_STORES
  }, [])

  const [formData, setFormData] = useState({
    name: staff?.name || '',
    store: staff?.store || availableStores[0] || 'Bazario Central Superstore #01',
    email: staff?.email || '',
    mobilenumber: staff?.mobilenumber || '',
    image: staff?.image || '',
    status: staff?.status || 'Active'
  })

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Please enter staff member full name.')
      return
    }
    if (!formData.mobilenumber.trim()) {
      toast.error('Validation Error', 'Please enter a contact mobile number.')
      return
    }
    if (!formData.store) {
      toast.error('Validation Error', 'Please select which store this staff belongs to.')
      return
    }

    const updatedStaff = {
      ...staff,
      ...formData
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
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Staff Member
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update store staff contact info, outlet assignment, and employment status.
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
          </div>

          {/* Right Column (8 cols): Inputs */}
          <div className="lg:col-span-8 space-y-5">
            {/* Full Name */}
            <InputField
              label="FULL NAME"
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<FontAwesomeIcon icon={faUser} className="text-xs text-slate-400" />}
              helperText="Official full name of staff member as per government ID"
              required
            />

            {/* Store & Status in 2-column row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Store Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  ASSIGNED STORE <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.store}
                  onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Store Outlet</option>
                  {availableStores.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Supermarket store branch where staff is posted</p>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  STATUS
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

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="MOBILE NUMBER"
                type="tel"
                placeholder="e.g. +91 98765 12345"
                value={formData.mobilenumber}
                onChange={(e) => setFormData({ ...formData, mobilenumber: e.target.value })}
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-[#064C23]" />}
                helperText="Primary contact number for branch communication"
                required
              />

              <InputField
                label="EMAIL ADDRESS"
                type="email"
                placeholder="e.g. priya.sharma@bazario.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" />}
                helperText="Official company email address"
              />
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
