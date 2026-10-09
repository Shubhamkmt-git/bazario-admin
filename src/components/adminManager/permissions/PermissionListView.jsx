import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faPlus,
  faMagnifyingGlass,
  faCircleCheck,
  faCircleXmark,
  faLink,
  faCopy
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import ActionButton from '../../ui/ActionButton'

export default function PermissionListView({
  permissions = [],
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPermissions = [...permissions]
    .sort((a, b) => (Number(a.sortingOrder) || 999) - (Number(b.sortingOrder) || 999))
    .filter((perm) => {
      const matchesStatus =
        statusFilter === 'all' || perm.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        perm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.slug.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })

  const handleCopySlug = (slug) => {
    navigator.clipboard.writeText(slug)
    toast.success('Copied', `Slug "${slug}" copied to clipboard!`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              System Permissions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage system permissions, auto-generated unique slugs, sorting order, and active/inactive status.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={onAddNew}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Add New Permission
          </Button>
        </div>
      </div>

      {/* Permissions Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search permission title, slug..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
              {['all', 'active', 'inactive'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#064C23] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-3 py-1.5 rounded-xl border border-[#bae2cb]">
              {filteredPermissions.length} Permissions
            </span>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4 w-20">Order</th>
                <th className="px-6 py-4">Permission Title</th>
                <th className="px-6 py-4">Programmatic Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((perm, index) => (
                  <tr key={perm.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Index */}
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </td>

                    {/* Sorting Order */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 border border-slate-200">
                        {perm.sortingOrder ?? index + 1}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onView(perm)}
                        className="font-bold text-slate-900 text-sm hover:text-[#064C23] text-left cursor-pointer transition-colors"
                      >
                        {perm.title}
                      </button>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                        <FontAwesomeIcon icon={faLink} className="text-[#064C23] text-[10px]" />
                        <span className="font-bold">{perm.slug}</span>
                        <button
                          type="button"
                          onClick={() => handleCopySlug(perm.slug)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                          title="Copy slug"
                        >
                          <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge Toggle */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(perm)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                          perm.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <FontAwesomeIcon
                          icon={perm.status === 'Active' ? faCircleCheck : faCircleXmark}
                          className="mr-1.5 text-[11px]"
                        />
                        {perm.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => onView(perm)}
                        title="View Full Page"
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => onEdit(perm)}
                        title="Edit Full Page"
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => onDelete(perm)}
                        title="Delete Permission"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No permissions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
