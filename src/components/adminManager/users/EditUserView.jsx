import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faShieldHalved,
  faLock,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import InputField from '../../ui/InputField'
import ImageUploadFrame from '../../ui/ImageUploadFrame'
import ToggleButton from '../../ui/ToggleButton'
import { FormActions } from '../../ui/FormLayout'

const DEFAULT_ROLES = [
  'Super Admin',
  'Store Manager',
  'Inventory Lead',
  'Customer Support Agent',
]

export default function EditUserView({ user, onBack, onSave }) {
  const toast = useToast()

  const [availableRoles, setAvailableRoles] = useState(DEFAULT_ROLES)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bazario_roles_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const roleTitles = parsed.map((r) => r.title)
          setAvailableRoles(Array.from(new Set([...roleTitles, ...DEFAULT_ROLES])))
        }
      }
    } catch {
      // fallback
    }
  }, [])

  const [formData, setFormData] = useState({
    name: user?.name || '',
    fathersName: user?.fathersName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: user?.password || '',
    role: user?.role || 'Store Manager',
    avatar: user?.avatar || null,
    status: user?.status || 'Active',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Full name is required.'
    if (!formData.fathersName.trim()) errs.fathersName = "Father's name is required."
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact number is required.'
    }
    if (formData.password && formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }
    if (!formData.role) errs.role = 'Please select an assigned role.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!validate()) {
      toast.error('Validation Failed', 'Please fill in all required fields.')
      return
    }

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      fathersName: formData.fathersName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password || user.password,
      role: formData.role,
      avatar: formData.avatar,
      status: formData.status,
    }

    onSave(updatedUser)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Admin Users"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Admin Manager
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Admin User — {user?.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            variant="cancel"
            size="sm"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Clean Minimal Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Profile Photo Frame */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Photo
              </label>
              <div className="w-full max-w-[220px]">
                <ImageUploadFrame
                  label=""
                  description="Upload JPG, PNG (Max 5MB)"
                  aspectRatio="square"
                  value={formData.avatar}
                  onChange={(img) => handleChange('avatar', img)}
                />
              </div>
            </div>

            {/* Right Column: Account & Profile Inputs */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Row 1: Name & Father's Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Admin Full Name"
                  required
                  icon={<FontAwesomeIcon icon={faUser} className="text-xs" />}
                  placeholder="e.g. Shubham Kumar"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                />

                <InputField
                  label="Father's Name"
                  required
                  icon={<FontAwesomeIcon icon={faIdCard} className="text-xs" />}
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.fathersName}
                  onChange={(e) => handleChange('fathersName', e.target.value)}
                  error={errors.fathersName}
                />
              </div>

              {/* Row 2: Contact Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Contact Number"
                  type="tel"
                  required
                  icon={<FontAwesomeIcon icon={faPhone} className="text-xs" />}
                  placeholder="e.g. +91 98111 00221"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                />

                <InputField
                  label="Email Address"
                  type="email"
                  required
                  icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs" />}
                  placeholder="e.g. shubham@bazario.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                />
              </div>

              {/* Row 3: Password & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  type="password"
                  icon={<FontAwesomeIcon icon={faLock} className="text-xs" />}
                  placeholder="Leave blank to keep existing password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={errors.password}
                  helperText="Leave unchanged or enter a new password (min. 6 chars)"
                />

                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Role <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-xs text-[#064C23]" />
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className={`w-full py-2.5 pl-10 pr-8 text-sm bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer ${
                        errors.role
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:border-[#064C23] focus:ring-[#064C23]/20'
                      }`}
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.role && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.role}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Toggle Card */}
          <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                status: prev.status === 'Active' ? 'Inactive' : 'Active',
              }))
            }
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              formData.status === 'Active'
                ? 'bg-[#f0f9f3] border-[#bae2cb] hover:border-[#064C23]'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">User Account Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                    formData.status === 'Active'
                      ? 'bg-[#064C23] text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={formData.status === 'Active' ? faCircleCheck : faCircleXmark}
                    className="mr-1 text-[10px]"
                  />
                  {formData.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {formData.status === 'Active' ? (
                  <span>
                    Account is <strong className="text-[#064C23]">Active</strong>: User can log in, access assigned dashboards, and perform operations.
                  </span>
                ) : (
                  <span>
                    Account is <strong className="text-slate-600">Inactive</strong>: User login is temporarily suspended.
                  </span>
                )}
              </p>
            </div>
            <ToggleButton
              checked={formData.status === 'Active'}
              onChange={(isChecked) =>
                setFormData((prev) => ({
                  ...prev,
                  status: isChecked ? 'Active' : 'Inactive',
                }))
              }
              activeColor="#064C23"
            />
          </div>

          {/* Bottom Actions */}
          <FormActions align="right">
            <Button
              type="button"
              variant="cancel"
              size="md"
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  )
}
