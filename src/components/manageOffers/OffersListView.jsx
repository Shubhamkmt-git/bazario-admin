import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPercent,
  faPlus,
  faSearch,
  faArrowUpRightFromSquare,
  faImage,
  faSort,
  faCheckCircle,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton
} from '../index'

export default function OffersListView({
  offers = [],
  onOpenAdd,
  onOpenEdit,
  onOpenView,
  onOpenDelete,
  onToggleStatus
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Active' | 'Inactive'

  // Filter offers based on search and status
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.redirectionUrl && offer.redirectionUrl.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' ? true : offer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sort by sortingOrder
  const sortedOffers = [...filteredOffers].sort(
    (a, b) => (Number(a.sortingOrder) || 0) - (Number(b.sortingOrder) || 0)
  )

  const activeCount = offers.filter((o) => o.status === 'Active').length
  const inactiveCount = offers.filter((o) => o.status === 'Inactive').length

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faPercent} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Manage Offers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeCount} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {offers.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure promotional offer banners (1.5:1 ratio), redirection URLs, and display priority.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
        >
          Add New Offer
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
            placeholder="Search offers by title or URL..."
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

      {/* Offers Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Order</th>
                <th className="px-6 py-4 w-44">Banner (1.5:1)</th>
                <th className="px-6 py-4">Offer Title</th>
                <th className="px-6 py-4">Redirection URL</th>
                <th className="px-6 py-4 w-32">Status</th>
                <th className="px-6 py-4 text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedOffers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 text-lg">
                        <FontAwesomeIcon icon={faPercent} />
                      </div>
                      <p className="font-semibold text-slate-700">No offers found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try adjusting your search criteria or filter.'
                          : 'Get started by creating your first promotional offer.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Sorting Order */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
                        {offer.sortingOrder || 1}
                      </span>
                    </td>

                    {/* Banner Image 1.5:1 Thumbnail */}
                    <td className="px-6 py-4">
                      {offer.image ? (
                        <div
                          onClick={() => onOpenView(offer)}
                          className="relative aspect-[1.5/1] w-36 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group cursor-pointer bg-slate-100"
                        >
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                            1.5:1
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[1.5/1] w-36 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-xs">
                          <FontAwesomeIcon icon={faImage} className="text-base mb-1 text-slate-300" />
                          <span className="text-[10px]">No Image (1.5:1)</span>
                        </div>
                      )}
                    </td>

                    {/* Offer Title */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p
                          onClick={() => onOpenView(offer)}
                          className="font-bold text-slate-900 hover:text-[#064C23] cursor-pointer transition-colors leading-snug line-clamp-2"
                        >
                          {offer.title}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: #{offer.id}
                        </span>
                      </div>
                    </td>

                    {/* Redirection URL */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 max-w-xs">
                        <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 truncate">
                          {offer.redirectionUrl || '/'}
                        </span>
                        {offer.redirectionUrl && (
                          <a
                            href={offer.redirectionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#064C23] p-1 transition-colors"
                            title="Open URL"
                          >
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle & Badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2.5">
                        <ToggleButton
                          size="sm"
                          checked={offer.status === 'Active'}
                          onChange={() => onToggleStatus(offer)}
                          activeColor="#064C23"
                        />
                        <span
                          className={`text-xs font-bold ${
                            offer.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <ActionButton
                          action="view"
                          size="sm"
                          onClick={() => onOpenView(offer)}
                          tooltip="View Offer Details"
                        />
                        <ActionButton
                          action="edit"
                          size="sm"
                          onClick={() => onOpenEdit(offer)}
                          tooltip="Edit Offer"
                        />
                        <ActionButton
                          action="delete"
                          size="sm"
                          onClick={() => onOpenDelete(offer)}
                          tooltip="Delete Offer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
