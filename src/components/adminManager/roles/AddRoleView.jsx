import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved,
  faSort,
  faKey,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faMagnifyingGlass,
  faSquareCheck,
  faSquare
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import InputField from '../../ui/InputField'
import ToggleButton from '../../ui/ToggleButton'
import { FormActions } from '../../ui/FormLayout'

const AVAILABLE_PERMISSIONS = [
  { id: 'stores.view-outlets', title: 'View Store Outlets', category: 'Stores' },
  { id: 'stores.create-location', title: 'Create Store Location', category: 'Stores' },
  { id: 'stores.edit-details', title: 'Edit Store Details', category: 'Stores' },
  { id: 'stores.delete-records', title: 'Delete Store Records', category: 'Stores' },
  { id: 'products.manage-stock', title: 'Manage Products & Stock', category: 'Products' },
  { id: 'orders.process-orders', title: 'Process Customer Orders', category: 'Orders' },
  { id: 'orders.issue-refunds', title: 'Issue Financial Refunds', category: 'Orders' },
  { id: 'admin.manage-users', title: 'Manage Admin Users & Security', category: 'Admin' },
]

export default function AddRoleView({ onBack, onSave, defaultSortingOrder = 1 }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    sortingOrder: defaultSortingOrder,
    permissions: ['stores.view-outlets', 'products.manage-stock', 'orders.process-orders'],
    status: 'Active',
  })

  const [permSearch, setPermSearch] = useState('')

  // Toggle single permission selection
  const handleTogglePermission = (permId) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId)
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((id) => id !== permId)
          : [...prev.permissions, permId],
      }
    })
  }

  // Select all or deselect all
  const handleSelectAllPerms = () => {
    const allIds = AVAILABLE_PERMISSIONS.map((p) => p.id)
    const isAllSelected = allIds.every((id) => formData.permissions.includes(id))
    setFormData((prev) => ({
      ...prev,
      permissions: isAllSelected ? [] : allIds,
    }))
  }

  const filteredPerms = AVAILABLE_PERMISSIONS.filter(
    (p) =>
      p.title.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(permSearch.toLowerCase())
  )

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please provide a role title / name.')
      return
    }

    const newRole = {
      id: Date.now(),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      sortingOrder: Number(formData.sortingOrder) || 1,
      permissions: formData.permissions,
      status: formData.status,
      isSystem: false,
    }

    onSave(newRole)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Roles"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Security Access Control
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create New Role
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
            Publish Role
          </Button>
        </div>
      </div>

      {/* Minimal Clean Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Role Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Basic Role Identity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <InputField
                  label="Role Title / Name"
                  required
                  placeholder="e.g. Store Manager"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  helperText="Primary role designation displayed across staff assignments"
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
                  helperText="Display priority (1 = Top)"
                />
              </div>
            </div>

            <InputField
              label="Subtitle / Role Description"
              placeholder="e.g. Operational control over local store products, stock levels, orders, and POS"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              helperText="Brief summary of duties and responsibilities assigned to this role"
            />
          </div>

          {/* Section 2: Select Role Permissions Matrix */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Role Permissions ({formData.permissions.length} Selected)
                </span>
                <p className="text-xs text-slate-500">
                  Choose which system features and capabilities this role can access.
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleSelectAllPerms}
                  className="text-xs font-bold text-[#064C23] hover:underline cursor-pointer"
                >
                  {AVAILABLE_PERMISSIONS.every((p) => formData.permissions.includes(p.id))
                    ? 'Deselect All'
                    : 'Select All Permissions'}
                </button>
              </div>
            </div>

            {/* Permission Search Filter */}
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
              </span>
              <input
                type="text"
                placeholder="Filter permissions..."
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
              />
            </div>

            {/* Permissions Checkbox Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPerms.map((perm) => {
                const isSelected = formData.permissions.includes(perm.id)
                return (
                  <div
                    key={perm.id}
                    onClick={() => handleTogglePermission(perm.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-[#f0f9f3] border-[#bae2cb] hover:border-[#064C23] shadow-2xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 transition-colors mt-0.5 ${
                        isSelected
                          ? 'bg-[#064C23] text-white shadow-2xs'
                          : 'bg-white border border-slate-300 text-transparent'
                      }`}
                    >
                      <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {perm.title}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400 truncate">
                        {perm.id}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Status Toggle Card */}
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
                <span className="text-sm font-bold text-slate-900">Role Operating Status</span>
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
                    Role is <strong className="text-[#064C23]">Active</strong>: Can be assigned to staff members and administrators.
                  </span>
                ) : (
                  <span>
                    Role is <strong className="text-slate-600">Inactive</strong>: Suspended from new staff assignments.
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
              Publish Role
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  )
}
