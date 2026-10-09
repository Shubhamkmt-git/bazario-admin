import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faPhone,
  faEnvelope,
  faCircleCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'
import InputField from '../ui/InputField'
import ToggleButton from '../ui/ToggleButton'
import { FormActions } from '../ui/FormLayout'

export default function EditCustomerView({ customer, onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    status: customer?.status || 'Active',
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
    if (!formData.name.trim()) errs.name = 'Customer name is required.'
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required.'
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!validate()) {
      toast.error('Validation Error', 'Please fill in all required customer fields.')
      return
    }

    const updatedCustomer = {
      ...customer,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      status: formData.status,
    }

    onSave(updatedCustomer)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Customers"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Customers Directory
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit Customer — {customer?.name}
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

      {/* Clean Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* Section 1: Customer Info */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Information
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Name */}
              <InputField
                label="Customer Name"
                required
                icon={<FontAwesomeIcon icon={faUser} className="text-xs" />}
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                helperText="Official customer account name"
              />

              {/* Mobile Number */}
              <InputField
                label="Mobile Number"
                type="tel"
                required
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs" />}
                placeholder="e.g. +91 98234 11223"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                helperText="Primary mobile number for SMS OTP & order delivery"
              />

              {/* Email Address */}
              <InputField
                label="Email Address"
                type="email"
                required
                icon={<FontAwesomeIcon icon={faEnvelope} className="text-xs" />}
                placeholder="e.g. priya.s@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                helperText="Email address for order receipts & invoice updates"
              />
            </div>
          </div>

          {/* Section 2: Account Status Toggle Card */}
          <div className="pt-2 border-t border-slate-100">
            <div
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  status: prev.status === 'Active' ? 'Restricted' : 'Active',
                }))
              }
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                formData.status === 'Active'
                  ? 'bg-[#f0f9f3] border-[#bae2cb] hover:border-[#064C23]'
                  : 'bg-rose-50/70 border-rose-200 hover:border-rose-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">Customer Account Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                      formData.status === 'Active'
                        ? 'bg-[#064C23] text-white shadow-2xs'
                        : 'bg-rose-600 text-white shadow-2xs'
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={formData.status === 'Active' ? faCircleCheck : faBan}
                      className="mr-1 text-[10px]"
                    />
                    {formData.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {formData.status === 'Active' ? (
                    <span>
                      Customer is <strong className="text-[#064C23]">Active</strong>: Account is verified and can place supermarket orders smoothly.
                    </span>
                  ) : (
                    <span>
                      Customer is <strong className="text-rose-600">Restricted</strong>: Account is blocked from ordering and checkout is suspended.
                    </span>
                  )}
                </p>
              </div>
              <ToggleButton
                checked={formData.status === 'Active'}
                onChange={(isChecked) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: isChecked ? 'Active' : 'Restricted',
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
              Save Changes
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  )
}
