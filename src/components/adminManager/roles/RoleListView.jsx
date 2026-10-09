import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved,
  faPlus,
  faMagnifyingGlass,
  faCircleCheck,
  faCircleXmark,
  faKey
} from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'
import ActionButton from '../../ui/ActionButton'
import ToggleButton from '../../ui/ToggleButton'

export default function RoleListView({
  roles = [],
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredRoles = [...roles]
    .sort((a, b) => (Number(a.sortingOrder) || 999) - (Number(b.sortingOrder) || 999))
    .filter((role) => {
      const matchesStatus =
        statusFilter === 'all' || role.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.subtitle && role.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesStatus && matchesSearch
    })

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Roles & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage staff administrative roles, capabilities, and permission privileges.
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
            Create New Role
          </Button>
        </div>
      </div>

      {/* Roles Table Container */}
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
              placeholder="Search role title, description..."
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
              {filteredRoles.length} Roles
            </span>
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4 w-20">Order</th>
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Subtitle / Scope</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <tr key={role.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Index */}
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </td>

                    {/* Sorting Order */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 border border-slate-200">
                        {role.sortingOrder ?? index + 1}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => onView(role)}
                        className="font-bold text-slate-900 text-sm hover:text-[#064C23] text-left cursor-pointer transition-colors"
                      >
                        {role.title}
                      </button>
                      {role.isSystem && (
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">
                          System Default
                        </span>
                      )}
                    </td>

                    {/* Subtitle */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[280px]">
                      <p className="line-clamp-2">{role.subtitle || 'General role'}</p>
                    </td>

                    {/* Permissions count badge */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold font-mono">
                        <FontAwesomeIcon icon={faKey} className="text-[10px]" />
                        <span>{role.permissions?.length || 0} Granted</span>
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <ToggleButton
                        size="sm"
                        checked={role.status === 'Active'}
                        onChange={() => onToggleStatus(role)}
                        activeColor="#064C23"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => onView(role)}
                        title="View Full Page"
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => onEdit(role)}
                        title="Edit Full Page"
                      />
                      {!role.isSystem && (
                        <ActionButton
                          action="delete"
                          onClick={() => onDelete(role)}
                          title="Delete Role"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No roles found matching your search.
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
