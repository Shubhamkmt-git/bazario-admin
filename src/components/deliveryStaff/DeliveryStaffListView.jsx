import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTruck,
  faPlus,
  faSearch,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton
} from '../index'

export default function DeliveryStaffListView({
  staffMembers = [],
  onOpenAdd,
  onOpenEdit,
  onOpenView,
  onOpenDelete,
  onToggleStatus
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Active' | 'Inactive'

  // Filter logic
  const filteredStaff = staffMembers.filter((staff) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      staff.name?.toLowerCase().includes(q) ||
      (staff.mobileNumber && staff.mobileNumber.toLowerCase().includes(q)) ||
      (staff.email && staff.email.toLowerCase().includes(q)) ||
      (staff.riderId && staff.riderId.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'all' ? true : staff.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faTruck} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Delivery Staff
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {staffMembers.filter((s) => s.status === 'Active').length} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {staffMembers.length} Staff
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage delivery riders, driver contact details, and dispatch status.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
        >
          Add Delivery Staff
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
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
      </div>

      {/* Clean Delivery Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16 text-center">#</th>
                <th className="px-6 py-4">Delivery Staff</th>
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

                    {/* Staff Name & Avatar */}
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
                              : 'DS'}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {staff.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {staff.riderId || `BAZ-DRV-0${staff.id}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Mobile Number */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 font-mono text-xs font-semibold text-slate-700">
                        <FontAwesomeIcon icon={faPhone} className="text-[#064C23] text-[10px]" />
                        <span>{staff.mobileNumber || '—'}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                        <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                        <span>{staff.email || '—'}</span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex justify-center">
                        <ToggleButton
                          size="sm"
                          checked={staff.status === 'Active'}
                          onChange={() => onToggleStatus(staff)}
                          activeColor="#064C23"
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <ActionButton
                          action="view"
                          tooltip="View Profile"
                          variant="ghost"
                          onClick={() => onOpenView(staff)}
                        />
                        <ActionButton
                          action="edit"
                          tooltip="Edit Rider"
                          variant="ghost"
                          onClick={() => onOpenEdit(staff)}
                        />
                        <ActionButton
                          action="delete"
                          tooltip="Delete Rider"
                          variant="danger"
                          onClick={() => onOpenDelete(staff)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                    No delivery personnel match your filter criteria.
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
