import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie,
  faPlus,
  faMagnifyingGlass,
  faShieldHalved,
  faPhone,
  faEnvelope,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'
import ActionButton from '../../ui/ActionButton'
import ToggleButton from '../../ui/ToggleButton'

export default function UserListView({
  users = [],
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  // Extract unique roles for filter
  const uniqueRoles = ['all', ...Array.from(new Set(users.map((u) => u.role).filter(Boolean)))]

  const filteredUsers = users.filter((user) => {
    const matchesStatus =
      statusFilter === 'all' || user.status?.toLowerCase() === statusFilter.toLowerCase()
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.fathersName && user.fathersName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phone && user.phone.includes(searchQuery)) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesRole && matchesSearch
  })

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faUserTie} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Users & Staff
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage system administrator accounts, security credentials, contact profiles, and role permissions.
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
            Add New Admin
          </Button>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, father's name, email, phone..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Role:
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] cursor-pointer"
              >
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>
                    {r === 'all' ? 'All Roles' : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
              {['all', 'active', 'inactive'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-[#064C23] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-3.5 py-1.5 rounded-xl border border-[#bae2cb]">
              {filteredUsers.length} Admins
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4">Admin Profile</th>
                <th className="px-6 py-4">Father's Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Index */}
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </td>

                    {/* Admin Profile & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                            {user.name
                              ? user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()
                              : 'AU'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onView(user)}
                            className="font-bold text-slate-900 text-sm hover:text-[#064C23] text-left cursor-pointer transition-colors block truncate"
                          >
                            {user.name}
                          </button>
                          <span className="text-xs text-slate-400 flex items-center truncate mt-0.5">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-[10px]" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Father's Name */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <FontAwesomeIcon icon={faIdCard} className="text-slate-400 text-xs" />
                        <span>{user.fathersName || '—'}</span>
                      </div>
                    </td>

                    {/* Contact Number */}
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-[10px]" />
                        <span>{user.phone || '—'}</span>
                      </div>
                    </td>

                    {/* Assigned Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-[10px] text-[#064C23]" />
                        {user.role || 'Admin'}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <ToggleButton
                        size="sm"
                        checked={user.status === 'Active'}
                        onChange={() => onToggleStatus(user)}
                        activeColor="#064C23"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => onView(user)}
                        title="View Admin Profile"
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => onEdit(user)}
                        title="Edit Admin User"
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => onDelete(user)}
                        title="Delete Admin User"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No admin users found matching your search or filters.
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
