import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTags,
  faPlus,
  faStar,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton
} from '../index'

export default function CategoryListView({
  categories = [],
  onOpenAdd,
  onOpenEdit,
  onOpenView,
  onOpenDelete,
  onToggleStatus,
  onToggleFeatured
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'Active' | 'Inactive'
  const [featuredFilter, setFeaturedFilter] = useState('all') // 'all' | 'featured' | 'standard'

  // Filter logic
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'all' ? true : c.status === statusFilter

    const matchesFeatured =
      featuredFilter === 'all'
        ? true
        : featuredFilter === 'featured'
        ? Boolean(c.isFeatured)
        : !c.isFeatured

    return matchesSearch && matchesStatus && matchesFeatured
  })

  // Sort by sortingOrder
  const sortedCategories = [...filteredCategories].sort(
    (a, b) => (Number(a.sortingOrder) || 0) - (Number(b.sortingOrder) || 0)
  )

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faTags} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Product Category
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {categories.filter((c) => c.status === 'Active').length} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                {categories.filter((c) => c.isFeatured).length} Featured
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Organize, sort, and manage grocery catalog categories and featured storefront highlights.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
        >
          Add Category
        </Button>
      </div>

      {/* Minimal Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
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

          {/* Featured Filter */}
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-2 font-bold text-slate-400 uppercase text-[10px]">Type:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'featured', label: '★ Featured' },
              { id: 'standard', label: 'Standard' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFeaturedFilter(item.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  featuredFilter === item.id
                    ? 'bg-white text-[#064C23] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Minimal Categories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Order</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Featured</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/75 transition-colors">
                    {/* Order */}
                    <td className="px-6 py-4 text-center">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-200">
                        #{category.sortingOrder || 1}
                      </span>
                    </td>

                    {/* Category: Thumbnail + Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5 max-w-md">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#064C23] border border-slate-200 flex items-center justify-center text-sm shrink-0">
                            <FontAwesomeIcon icon={faTags} />
                          </div>
                        )}
                        <span className="font-bold text-slate-900 text-sm">
                          {category.title}
                        </span>
                      </div>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex justify-center">
                        <ToggleButton
                          size="sm"
                          checked={Boolean(category.isFeatured)}
                          onChange={() => onToggleFeatured(category)}
                          activeColor="#064C23"
                        />
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex justify-center">
                        <ToggleButton
                          size="sm"
                          checked={category.status === 'Active'}
                          onChange={() => onToggleStatus(category)}
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
                          onClick={() => onOpenView(category)}
                        />
                        <ActionButton
                          action="edit"
                          tooltip="Edit Category"
                          onClick={() => onOpenEdit(category)}
                        />
                        <ActionButton
                          action="delete"
                          tooltip="Delete Category"
                          onClick={() => onOpenDelete(category)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-lg">
                        <FontAwesomeIcon icon={faTags} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No Categories Found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery
                          ? `No product categories matching "${searchQuery}".`
                          : 'Create your first product category to organize your catalog.'}
                      </p>
                      <Button size="sm" variant="primary" onClick={onOpenAdd} icon={<FontAwesomeIcon icon={faPlus} />}>
                        Add Category
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
