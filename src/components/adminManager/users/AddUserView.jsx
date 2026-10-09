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
  faCamera,
  faTrashCan,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import InputField from '../../ui/InputField'
import ToggleButton from '../../ui/ToggleButton'
import { FormActions } from '../../ui/FormLayout'

const DEFAULT_ROLES = [
  'Super Admin',
  'Store Manager',
  'Inventory Lead',
  'Customer Support Agent',
]

export default function AddUserView({ onBack, onSave }) {
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
    name: '',
    fathersName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Store Manager',
    avatar: null,
    status: 'Active',
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
    if (!formData.password) {
      errs.password = 'Password is required.'
    } else if (formData.password.length < 6) {
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

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      fathersName: formData.fathersName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
      avatar: formData.avatar,
      status: formData.status,
      lastLogin: 'Never',
    }

    onSave(newUser)
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
              Add New Admin User
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
            Create Admin User
          </Button>
        </div>
      </div>

      {/* Well-Structured Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* Section 1: Profile & Personal Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal & Contact Information
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-1">
              {/* Profile Avatar Frame */}
              <div className="flex flex-col items-center space-y-2 shrink-0">
                <div className="w-28 h-28 relative rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#064C23] bg-slate-50/80 overflow-hidden flex flex-col items-center justify-center transition-all group shadow-2xs">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    id="avatar-upload-add"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (ev) => handleChange('avatar', ev.target.result)
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {formData.avatar ? (
                    <div className="relative w-full h-full">
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <label
                          htmlFor="avatar-upload-add"
                          className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center text-xs shadow-md cursor-pointer hover:scale-110 transition-transform"
                          title="Change Photo"
                        >
                          <FontAwesomeIcon icon={faRotateRight} />
                        </label>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation()
                            handleChange('avatar', null)
                          }}
                          className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md cursor-pointer hover:scale-110 transition-transform"
                          title="Remove Photo"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="avatar-upload-add"
                      className="w-full h-full flex flex-col items-center justify-center p-2 text-center cursor-pointer select-none"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faCamera} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">Upload</span>
                    </label>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Profile Photo
                </span>
              </div>

              {/* Inputs Grid (2 rows x 2 columns) */}
              <div className="flex-1 w-full space-y-4">
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
              </div>
            </div>
          </div>

          {/* Section 2: Account Credentials & Role */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Security & Role Assignment
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Account Password"
                type="password"
                required
                icon={<FontAwesomeIcon icon={faLock} className="text-xs" />}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
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

          {/* Section 3: Status Toggle Card */}
          <div className="pt-2 border-t border-slate-100">
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
              Create Admin User
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  )
}
