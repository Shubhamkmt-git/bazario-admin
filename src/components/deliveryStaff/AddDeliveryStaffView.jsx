import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faPhone,
  faEnvelope,
  faUser,
  faTruck,
  faCircleCheck,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  BackButton
} from '../index'
import { useToast } from '../../context/ToastContext'

export default function AddDeliveryStaffView({ onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    image: '',
    status: 'Active'
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

    const newStaff = {
      id: Date.now(),
      ...formData
    }

    onSave(newStaff)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Add Delivery Staff
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Onboard a new delivery rider or dispatch driver with contact details and profile photo.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Delivery Staff
          </Button>
        </div>
      </div>

      {/* Clean Unified Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Main Grid: Left Profile Photo (4 cols) & Right Form Fields (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Staff Profile Image Card */}
          <div className="lg:col-span-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                PROFILE PHOTO
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                1:1 SQUARE
              </span>
            </div>

            <ImageUploadFrame
              label=""
              aspectRatio="square"
              description="Upload rider passport photo or avatar (PNG, JPG, WEBP max 5MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />

            {/* Status & ID Badge Preview Card */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Duty Status</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black ${
                    formData.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      formData.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  {formData.status === 'Active' ? 'Available' : 'Off Duty'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Fleet System</span>
                <span className="font-bold text-slate-700">Bazario Express</span>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Name, Mobile, Email, Status */}
          <div className="lg:col-span-8 space-y-5">
            {/* Full Name */}
            <InputField
              label="FULL NAME"
              placeholder="e.g. Ramesh Kumar Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<FontAwesomeIcon icon={faUser} className="text-xs text-slate-400" />}
              helperText="Official full name of delivery rider / driver as per ID"
              required
            />

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="MOBILE NUMBER"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-[#064C23]" />}
                helperText="Primary mobile number for dispatch & calls"
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

            {/* Status Selection & Helper Info in balanced 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
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

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center">
                  <FontAwesomeIcon icon={faTruck} className="text-[#064C23] mr-1.5 text-xs" />
                  Dispatch Assignment Note
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {formData.status === 'Active'
                    ? 'Rider will automatically be eligible to receive and accept incoming supermarket orders.'
                    : 'Rider is currently paused and will not appear in the active dispatch assignment queue.'}
                </p>
              </div>
            </div>
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
            Save Delivery Staff
          </Button>
        </div>
      </form>
    </div>
  )
}
