import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faPlus,
  faMagnifyingGlass,
  faDoorOpen,
  faDoorClosed,
  faPhone,
  faUserTie,
  faBoxOpen,
  faMotorcycle
} from '@fortawesome/free-solid-svg-icons'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import ToggleButton from '../ui/ToggleButton'

export default function StoreListView({
  stores = [],
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStores = [...stores]
    .sort((a, b) => (Number(a.sortingOrder) || 999) - (Number(b.sortingOrder) || 999))
    .filter((store) => {
      const matchesStatus =
        statusFilter === 'all' || store.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesSearch =
        store.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (store.coordinates && store.coordinates.includes(searchQuery))
      return matchesStatus && matchesSearch
    })

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Store Locations & Outlets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage listed supermarket branches, sorting order priority, and live operating status.
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
            Add New Store
          </Button>
        </div>
      </div>

      {/* Stores List / Table Container */}
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
              placeholder="Search store name, area, coordinates..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 text-xs">
              {['all', 'open', 'closed'].map((st) => (
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
              {filteredStores.length} Stores
            </span>
          </div>
        </div>

        {/* Stores Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20">Order</th>
                <th className="px-6 py-4">Store Outlet</th>
                <th className="px-6 py-4">Area & Subtitle</th>
                <th className="px-6 py-4">Assigned Personnel (Team & Fleet)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStores.length > 0 ? (
                filteredStores.map((store, index) => (
                  <tr key={store.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Sorting Order */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 border border-slate-200">
                        {store.sortingOrder ?? index + 1}
                      </span>
                    </td>

                    {/* Store Name & Thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={store.image || '/supermart-bg.jpg'}
                          alt={store.title}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onView(store)}
                            className="font-bold text-slate-900 text-sm block leading-snug hover:text-[#064C23] text-left cursor-pointer transition-colors"
                          >
                            {store.title}
                          </button>
                          <span className="text-xs text-slate-400 flex items-center mt-0.5">
                            <FontAwesomeIcon icon={faPhone} className="mr-1 text-[10px]" />
                            {store.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Subtitle / Area */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-[240px]">
                      <p className="line-clamp-2">{store.subtitle}</p>
                    </td>

                    {/* Assigned Personnel: Managers, Packers, Delivery Fleet */}
                    <td className="px-6 py-4">
                      {(() => {
                        const mCount = store.managerCount ?? (store.managers ? store.managers.length : 0)
                        const pCount = store.packerCount ?? (store.packers ? store.packers.length : 0)
                        const rCount = store.riderCount ?? store.deliveryCount ?? (store.deliveryStaff ? store.deliveryStaff.length : 0)

                        return (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Managers Badge */}
                            <button
                              type="button"
                              onClick={() => onView(store)}
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                                mCount > 0
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                              }`}
                              title="Assigned Store Managers"
                            >
                              <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                              <span>{mCount} {mCount === 1 ? 'Manager' : 'Managers'}</span>
                            </button>

                            {/* Packers Badge */}
                            <button
                              type="button"
                              onClick={() => onView(store)}
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                                pCount > 0
                                  ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                              }`}
                              title="Assigned Order Packers & Pickers"
                            >
                              <FontAwesomeIcon icon={faBoxOpen} className="text-[10px]" />
                              <span>{pCount} {pCount === 1 ? 'Packer' : 'Packers'}</span>
                            </button>

                            {/* Fleet Riders Badge */}
                            <button
                              type="button"
                              onClick={() => onView(store)}
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                                rCount > 0
                                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                              }`}
                              title="Assigned Delivery Fleet / Riders"
                            >
                              <FontAwesomeIcon icon={faMotorcycle} className="text-[10px]" />
                              <span>{rCount} {rCount === 1 ? 'Rider' : 'Riders'}</span>
                            </button>
                          </div>
                        )
                      })()}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <ToggleButton
                        size="sm"
                        checked={store.status === 'Open'}
                        onChange={() => onToggleStatus(store)}
                        activeColor="#064C23"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => onView(store)}
                        title="View Full Page"
                      />
                      <ActionButton
                        action="edit"
                        onClick={() => onEdit(store)}
                        title="Edit Full Page"
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => onDelete(store)}
                        title="Delete Store"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No stores found matching your search.
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
