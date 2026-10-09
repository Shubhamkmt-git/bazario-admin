import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faPhone,
  faEnvelope,
  faCircleCheck,
  faCircleXmark,
  faStore,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons'
import { Button, BackButton } from '../index'

export default function StaffDetailsView({ staff, onBack, onEdit }) {
  if (!staff) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 font-bold">Staff member not found.</p>
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
                {staff.name}
              </h1>
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  staff.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={staff.status === 'Active' ? faCircleCheck : faCircleXmark}
                  className="text-[10px]"
                />
                <span>{staff.status === 'Active' ? 'Active / On Duty' : 'Inactive / On Leave'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Supermarket store staff profile, outlet assignment, and contact information.
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
            onClick={() => onEdit(staff.id)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {/* Avatar / Photo */}
          {staff.image ? (
            <img
              src={staff.image}
              alt={staff.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-black text-3xl shadow-sm shrink-0">
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

          {/* Details Column */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Supermarket Store Staff
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                {staff.staffId || `BAZ-STF-0${staff.id}`}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{staff.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#064C23]/10 text-[#064C23] font-bold text-xs">
                <FontAwesomeIcon icon={faStore} className="mr-1.5 text-xs" />
                Store: {staff.store || 'Bazario Central Superstore #01'}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs">
                <FontAwesomeIcon icon={faUserGroup} className="mr-1.5 text-xs text-slate-500" />
                Operations Team
              </span>
            </div>
          </div>
        </div>

        {/* Contact and Store Assignment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Assigned Store Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faStore} />
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Assigned Store
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                {staff.store || 'Bazario Central Superstore #01'}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                Active Branch Posting
              </span>
            </div>
          </div>

          {/* Mobile Number Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mobile Number
              </span>
              <a
                href={`tel:${staff.mobilenumber}`}
                className="text-xs font-bold font-mono text-slate-800 hover:text-[#064C23] hover:underline truncate block mt-0.5"
              >
                {staff.mobilenumber || 'Not provided'}
              </a>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Direct phone line
              </span>
            </div>
          </div>

          {/* Email Address Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm shrink-0 mt-0.5">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Email Address
              </span>
              <a
                href={`mailto:${staff.email}`}
                className="text-xs font-bold text-slate-800 hover:text-[#064C23] hover:underline truncate block mt-0.5"
              >
                {staff.email || 'Not provided'}
              </a>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Staff login & credentials
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
