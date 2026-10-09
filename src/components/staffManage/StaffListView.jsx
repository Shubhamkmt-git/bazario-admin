import React, { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserGroup,
  faPlus,
  faSearch,
  faPhone,
  faEnvelope,
  faStore,
  faEye,
  faPenToSquare,
  faTrashCan,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton
} from '../index'

export default function StaffListView({
  staffList = [],
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [storeFilter, setStoreFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Extract unique stores for filtering
  const storeOptions = useMemo(() => {
    const set = new Set()
    staffList.forEach((s) => {
      if (s.store) set.add(s.store)
    })
    return Array.from(set)
  }, [staffList])

  // Filtered staff members
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.mobilenumber?.toLowerCase().includes(q) ||
        s.store?.toLowerCase().includes(q) ||
        s.staffId?.toLowerCase().includes(q)

      const matchesStore = storeFilter === 'all' || s.store === storeFilter
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter

      return matchesSearch && matchesStore && matchesStatus
    })
  }, [staffList, searchQuery, storeFilter, statusFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStoreFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faUserGroup} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Staff Manage
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {staffList.filter((s) => s.status === 'Active').length} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {staffList.length} Total Staff
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage store employees, outlet assignments, contact credentials, and duty status.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onAddNew}
          icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
        >
          Add Staff
        </Button>
      </div>

      {/* Toolbar: Search & Store/Status Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search by staff name, store, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Store Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
            <FontAwesomeIcon icon={faStore} className="text-[#064C23] text-xs ml-0.5" />
            <span className="font-bold text-slate-500 uppercase text-[10px]">Store:</span>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 outline-none cursor-pointer py-1 pr-1"
            >
              <option value="all">All Stores</option>
              {storeOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-2 font-bold text-slate-400 uppercase text-[10px]">Status:</span>
            {['all', 'Active', 'Inactive'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-[#064C23] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(searchQuery || storeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
              title="Reset Filters"
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
          )}
        </div>
      </div>

      {/* Staff Index Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16 text-center">#</th>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Assigned Store</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff, idx) => (
                  <tr key={staff.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Index */}
                    <td className="px-6 py-4 text-center font-mono font-bold text-xs text-slate-400">
                      #{idx + 1}
                    </td>

                    {/* Staff Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5 max-w-xs">
                        {staff.image ? (
                          <img
                            src={staff.image}
                            alt={staff.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {staff.name
                              ? staff.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()
                              : 'ST'}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {staff.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {staff.staffId || `BAZ-STF-0${staff.id}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Store */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-[#064C23]/10 text-[#064C23] font-bold text-xs max-w-[220px] truncate">
                        <FontAwesomeIcon icon={faStore} className="text-xs shrink-0" />
                        <span className="truncate">
                          {staff.store || 'Bazario Central Superstore #01'}
                        </span>
                      </div>
                    </td>

                    {/* Mobile Number */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 font-mono text-xs font-semibold text-slate-700">
                        <FontAwesomeIcon icon={faPhone} className="text-[#064C23] text-[10px]" />
                        <span>{staff.mobilenumber || '—'}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                        <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                        <span className="truncate max-w-[180px]">{staff.email || '—'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <ToggleButton
                          size="sm"
                          checked={staff.status === 'Active'}
                          onChange={() => onToggleStatus(staff.id)}
                          activeColor="#064C23"
                        />
                        <span
                          className={`text-[10px] font-bold mt-0.5 ${
                            staff.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {staff.status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <ActionButton
                          action="view"
                          tooltip="View Profile"
                          variant="ghost"
                          onClick={() => onView(staff.id)}
                        />
                        <ActionButton
                          action="edit"
                          tooltip="Edit Staff"
                          variant="ghost"
                          onClick={() => onEdit(staff.id)}
                        />
                        <ActionButton
                          action="delete"
                          tooltip="Delete Staff"
                          variant="danger"
                          onClick={() => onDelete(staff.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No staff members match your search or filter criteria.
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
