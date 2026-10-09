import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faDesktop,
  faMobileScreen,
  faSort,
  faCircleCheck,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons'
import { Button, BackButton } from '../index'

export default function HeroBannerDetailsView({ banner, onBack, onEdit }) {
  if (!banner) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 font-bold">Hero banner details not found.</p>
        <Button variant="primary" size="sm" onClick={onBack}>
          Back to List
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {banner.title}
              </h1>
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  banner.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={banner.status === 'Active' ? faCircleCheck : faCircleXmark}
                  className="text-[10px]"
                />
                <span>{banner.status}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Hero banner configuration and display previews.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => onEdit(banner)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Banner
          </Button>
        </div>
      </div>

      {/* Metadata KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
            <FontAwesomeIcon icon={faSort} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Carousel Sorting Order
            </span>
            <span className="text-base font-black text-slate-800">
              Priority #{banner.sortingOrder || 1}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              banner.status === 'Active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <FontAwesomeIcon icon={banner.status === 'Active' ? faCircleCheck : faCircleXmark} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Visibility Status
            </span>
            <span className="text-base font-black text-slate-800">
              {banner.status === 'Active' ? 'Active on Homepage' : 'Hidden / Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Banners Preview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Web Banner Preview (5:1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faDesktop} className="text-[#064C23] text-sm" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Web Banner Display (5:1 Ratio)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Desktop / Laptop</span>
          </div>

          {banner.webImage ? (
            <div className="w-full aspect-[5/1] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
              <img
                src={banner.webImage}
                alt={`${banner.title} web banner`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-[5/1] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-sm font-medium">
              No desktop banner uploaded
            </div>
          )}
        </div>

        {/* Mobile Banner Preview (1.5:1) */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faMobileScreen} className="text-[#064C23] text-sm" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Mobile Banner Display (1.5:1 Ratio)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Mobile App / Browser</span>
          </div>

          <div className="max-w-xs">
            {banner.mobileImage ? (
              <div className="w-full aspect-[1.5/1] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={banner.mobileImage}
                  alt={`${banner.title} mobile banner`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[1.5/1] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium">
                No mobile banner uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
