import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImages,
  faPlus,
  faSearch,
  faDesktop,
  faMobileScreen
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton
} from '../index'

export default function HeroBannerListView({
  banners = [],
  onOpenAdd,
  onOpenEdit,
  onOpenView,
  onOpenDelete,
  onToggleStatus
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Active' | 'Inactive'

  // Filter logic
  const filteredBanners = banners.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort by sortingOrder
  const sortedBanners = [...filteredBanners].sort(
    (a, b) => (Number(a.sortingOrder) || 0) - (Number(b.sortingOrder) || 0)
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faImages} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hero Banner Manage
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {banners.filter((b) => b.status === 'Active').length} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {banners.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage homepage carousel hero banners for web (5:1) and mobile (1.5:1) devices.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
        >
          Add Hero Banner
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
            placeholder="Search hero banners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Status Filter */}
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

      {/* Clean Hero Banners Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Order</th>
                <th className="px-6 py-4">Banner Title</th>
                <th className="px-6 py-4">Web Banner (5:1)</th>
                <th className="px-6 py-4">Mobile Banner (1.5:1)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedBanners.length > 0 ? (
                sortedBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Order */}
                    <td className="px-6 py-4 text-center">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-200">
                        #{banner.sortingOrder || 1}
                      </span>
                    </td>

                    {/* Banner Title */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs sm:max-w-sm">
                        <span className="font-bold text-slate-900 text-sm block">
                          {banner.title}
                        </span>
                      </div>
                    </td>

                    {/* Web Banner Preview (5:1) */}
                    <td className="px-6 py-4">
                      {banner.webImage ? (
                        <div className="relative group w-44 aspect-[5/1] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                          <img
                            src={banner.webImage}
                            alt={`${banner.title} web banner`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                            5:1 Web
                          </span>
                        </div>
                      ) : (
                        <div className="w-44 aspect-[5/1] rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-medium space-x-1">
                          <FontAwesomeIcon icon={faDesktop} className="text-slate-300" />
                          <span>No Web Image</span>
                        </div>
                      )}
                    </td>

                    {/* Mobile Banner Preview (1.5:1) */}
                    <td className="px-6 py-4">
                      {banner.mobileImage ? (
                        <div className="relative group w-20 aspect-[1.5/1] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                          <img
                            src={banner.mobileImage}
                            alt={`${banner.title} mobile banner`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0.5 right-1 px-1 py-0.2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                            1.5:1
                          </span>
                        </div>
                      ) : (
                        <div className="w-20 aspect-[1.5/1] rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-medium space-x-1">
                          <FontAwesomeIcon icon={faMobileScreen} className="text-slate-300" />
                          <span>No Mobile</span>
                        </div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex justify-center">
                        <ToggleButton
                          size="sm"
                          checked={banner.status === 'Active'}
                          onChange={() => onToggleStatus(banner)}
                          activeColor="#064C23"
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <ActionButton
                          action="view"
                          tooltip="View Details"
                          onClick={() => onOpenView(banner)}
                        />
                        <ActionButton
                          action="edit"
                          tooltip="Edit Banner"
                          onClick={() => onOpenEdit(banner)}
                        />
                        <ActionButton
                          action="delete"
                          tooltip="Delete Banner"
                          onClick={() => onOpenDelete(banner)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg">
                        <FontAwesomeIcon icon={faImages} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No Hero Banners Found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? `No banners matching "${searchQuery}".`
                          : 'Create your first homepage hero banner to attract shoppers.'}
                      </p>
                      <Button size="sm" variant="primary" onClick={onOpenAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
                        Add Hero Banner
                      </Button>
                    </div>
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
