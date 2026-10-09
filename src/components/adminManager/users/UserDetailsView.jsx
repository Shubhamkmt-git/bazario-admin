import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faPhone,
  faIdCard,
  faShieldHalved,
  faClock,
  faLock,
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faTrashCan,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import BackButton from '../../ui/BackButton'
import Button from '../../ui/Button'
import ToggleButton from '../../ui/ToggleButton'

export default function UserDetailsView({
  user,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!user) return null

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Admin Users"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Admin Manager
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Admin Profile: {user.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            variant="cancel"
            size="sm"
            onClick={() => onEdit(user)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Profile
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(user)}
            icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
          >
            Delete User
          </Button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Preview */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              {user.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'AU'}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-xs text-[#064C23]" />
                {user.role || 'Admin'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="mr-1.5 text-slate-400" />
              <span>Father's Name: <strong className="text-slate-700 font-semibold">{user.fathersName || 'N/A'}</strong></span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1.5 text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center font-mono">
                <FontAwesomeIcon icon={faPhone} className="mr-1.5 text-slate-400" />
                {user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="w-full md:w-auto bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between md:justify-end space-x-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Account Status
            </span>
            <span
              className={`inline-flex items-center text-xs font-bold mt-1 ${
                user.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'
              }`}
            >
              <FontAwesomeIcon
                icon={user.status === 'Active' ? faCircleCheck : faCircleXmark}
                className="mr-1.5 text-[11px]"
              />
              {user.status}
            </span>
          </div>
          <ToggleButton
            size="md"
            checked={user.status === 'Active'}
            onChange={() => onToggleStatus(user)}
            activeColor="#064C23"
          />
        </div>
      </div>

      {/* Details Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Identification & Contact Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Personal & Contact Information
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Full Legal Name</span>
              <span className="font-bold text-slate-800">{user.name}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Father's Name</span>
              <span className="font-bold text-slate-800">{user.fathersName || '—'}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Official Email</span>
              <span className="font-medium text-slate-700 select-all">{user.email}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Contact Number</span>
              <span className="font-mono font-bold text-slate-800 select-all">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Access Role */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Security & Role Assignment
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Assigned Access Role</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#064C23] text-white">
                <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-[10px]" />
                {user.role}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Password Status</span>
              <span className="inline-flex items-center text-xs font-semibold text-slate-700">
                <FontAwesomeIcon icon={faLock} className="mr-1 text-slate-400 text-xs" />
                •••••••• (Secured)
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Last Portal Session</span>
              <span className="inline-flex items-center text-xs font-medium text-slate-600">
                <FontAwesomeIcon icon={faClock} className="mr-1 text-slate-400 text-xs" />
                {user.lastLogin || 'Recently'}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Account ID</span>
              <span className="font-mono text-xs font-bold text-slate-400">#{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
