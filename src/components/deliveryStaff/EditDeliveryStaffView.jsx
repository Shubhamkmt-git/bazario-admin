import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faPhone,
  faEnvelope,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

export default function EditDeliveryStaffView({ staff, onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: staff?.name || '',
    mobileNumber: staff?.mobileNumber || '',
    email: staff?.email || '',
    image: staff?.image || '',
    status: staff?.status || 'Active'
  })

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Please enter delivery staff full name.')
      return
    }
    if (!formData.mobileNumber.trim()) {
      toast.error('Validation Error', 'Please enter a contact mobile number.')
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
              Edit Delivery Staff
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update delivery personnel contact numbers, email address, profile image, and duty status.
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

      {/* Clean Unified Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Main Grid: Info (8 cols) & Profile Photo (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Name, Mobile, Email, Status */}
          <div className="lg:col-span-8 space-y-4">
            <InputField
              label="FULL NAME"
              placeholder="e.g. Ramesh Kumar Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<FontAwesomeIcon icon={faUser} className="text-xs text-slate-400" />}
              helperText="Official full name of delivery rider / driver"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="MOBILE NUMBER"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-[#064C23]" />}
                helperText="Primary contact number for order dispatch"
                required
              />

              <InputField
                label="EMAIL ADDRESS"
                type="email"
                placeholder="e.g. ramesh.delivery@bazario.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs text-slate-400" />}
                helperText="Account notification & login email address"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                STATUS
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
              >
                <option value="Active">Active (Available for Dispatch)</option>
                <option value="Inactive">Inactive (Off Duty / Suspended)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Delivery availability and dispatch status</p>
            </div>
          </div>

          {/* Right Column (4 cols): Staff Profile Image */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <ImageUploadFrame
              label="PROFILE PHOTO / AVATAR"
              aspectRatio="square"
              description="Upload rider passport size or avatar image (PNG, JPG, WEBP up to 5MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
        </div>

        {/* Form Action Buttons */}
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
