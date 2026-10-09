import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faPhone,
  faEnvelope,
  faCircleCheck,
  faCircleXmark,
  faTruck,
  faIdCard
} from '@fortawesome/free-solid-svg-icons'
import { Button, BackButton } from '../index'

export default function DeliveryStaffDetailsView({ staff, onBack, onEdit }) {
  if (!staff) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 font-bold">Delivery staff member not found.</p>
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
                <span>{staff.status === 'Active' ? 'Active / On Duty' : 'Inactive / Off Duty'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Delivery rider profile, contact details, and dispatch information.
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
            onClick={() => onEdit(staff)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
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
                : 'DS'}
            </div>
          )}

          {/* Details Column */}
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                  Bazario Fleet Personnel
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                  BAZ-DRV-0{staff.id}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{staff.name}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm shrink-0">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Mobile Number
                  </span>
                  <a
                    href={`tel:${staff.mobileNumber}`}
                    className="text-xs font-bold font-mono text-slate-800 hover:text-[#064C23] hover:underline truncate block"
                  >
                    {staff.mobileNumber || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${staff.email}`}
                    className="text-xs font-bold text-slate-800 hover:text-[#064C23] hover:underline truncate block"
                  >
                    {staff.email || 'Not provided'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
