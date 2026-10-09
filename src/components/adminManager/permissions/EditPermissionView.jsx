import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faSort,
  faLink,
  faCircleCheck,
  faCircleXmark,
  faRotate
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import InputField from '../../ui/InputField'
import ToggleButton from '../../ui/ToggleButton'
import { FormActions } from '../../ui/FormLayout'

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function EditPermissionView({ permission, onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: permission?.title || '',
    slug: permission?.slug || '',
    sortingOrder: permission?.sortingOrder ?? 1,
    status: permission?.status || 'Active',
  })

  useEffect(() => {
    if (permission) {
      setFormData({
        title: permission.title || '',
        slug: permission.slug || '',
        sortingOrder: permission.sortingOrder ?? 1,
        status: permission.status || 'Active',
      })
    }
  }, [permission])

  const handleRegenerateSlug = () => {
    const freshSlug = generateSlug(formData.title)
    setFormData((prev) => ({ ...prev, slug: freshSlug }))
    toast.info('Slug Regenerated', `Slug updated to "${freshSlug}"`)
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please provide a permission title.')
      return
    }

    const finalSlug = (formData.slug || generateSlug(formData.title)).trim()
    if (!finalSlug) {
      toast.error('Validation Error', 'Please provide a valid slug.')
      return
    }

    const updatedPermission = {
      ...permission,
      title: formData.title.trim(),
      slug: finalSlug,
      sortingOrder: Number(formData.sortingOrder) || 1,
      status: formData.status,
    }

    onSave(updatedPermission)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Permissions"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Security Access Control
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit: {permission?.title}
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

      {/* Minimal Clean Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Permission Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Permission Configuration
              </span>
            </div>

            {/* Row 1: Title & Sorting Order */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <InputField
                  label="Permission Title"
                  required
                  placeholder="e.g. View Store Outlets"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  helperText="Human-readable title displayed across admin access controls"
                />
              </div>

              <div className="md:col-span-1">
                <InputField
                  label="Sorting Order"
                  type="number"
                  min="1"
                  icon={<FontAwesomeIcon icon={faSort} className="text-xs text-slate-400" />}
                  placeholder="1"
                  value={formData.sortingOrder}
                  onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                  helperText="Listing sequence priority"
                />
              </div>
            </div>

            {/* Row 2: Auto-generated Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Permission Slug
                </label>
                {formData.title && (
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                    <span>Regenerate from Title</span>
                  </button>
                )}
              </div>

              <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <FontAwesomeIcon icon={faLink} className="text-xs" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. stores.view-outlets"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Unique programmatic key used in code/backend authorization checks (e.g. <code className="font-mono text-slate-600">stores.view-outlets</code>)
              </p>
            </div>
          </div>

          {/* Section: Status Toggle Card */}
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
                <span className="text-sm font-bold text-slate-900">Permission Status</span>
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
                    Permission is <strong className="text-[#064C23]">Active</strong>: Available to be granted and enforced across system roles.
                  </span>
                ) : (
                  <span>
                    Permission is <strong className="text-slate-600">Inactive</strong>: Temporarily disabled across all roles.
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

          {/* Bottom Form Actions */}
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
