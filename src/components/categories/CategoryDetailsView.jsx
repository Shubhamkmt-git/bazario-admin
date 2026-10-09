import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faStar,
  faTags
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  BackButton
} from '../index'

export default function CategoryDetailsView({ category, onBack, onEdit }) {
  if (!category) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {category.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  category.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {category.status}
              </span>
              {category.isFeatured && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                  <span>Featured Highlight</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {category.subtitle || 'Catalog Category Overview'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onEdit(category)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Category
          </Button>
        </div>
      </div>

      {/* Details Overview Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Sorting Order</span>
            <p className="text-lg font-black font-mono text-[#064C23]">#{category.sortingOrder || 1}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Status</span>
            <p className="text-sm font-bold text-slate-900">{category.status}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Featured Highlight</span>
            <p className="text-sm font-bold text-slate-900">
              {category.isFeatured ? '★ Yes, Featured' : 'No, Standard'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Category ID</span>
            <p className="text-sm font-mono font-bold text-slate-700">CAT-{category.id}</p>
          </div>
        </div>

        {/* Title, Image Preview & Subtitle Card */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start gap-5">
          {category.image ? (
            <img
              src={category.image}
              alt={category.title}
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 text-[#064C23] flex items-center justify-center text-3xl shrink-0 shadow-2xs">
              <FontAwesomeIcon icon={faTags} />
            </div>
          )}

          <div className="space-y-3 flex-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Category Title
              </span>
              <p className="text-xl font-black text-slate-900">
                {category.title}
              </p>
            </div>

            {category.subtitle && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Subtitle / Tagline
                </span>
                <p className="text-sm font-medium text-slate-700">
                  {category.subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Card */}
        {category.description && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Description
            </span>
            <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line">
              {category.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
