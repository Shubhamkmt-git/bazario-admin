import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faPhone,
  faCircleCheck,
  faBan,
  faPenToSquare,
  faTrashCan,
  faCartShopping,
  faWallet,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons'
import BackButton from '../ui/BackButton'
import Button from '../ui/Button'
import ToggleButton from '../ui/ToggleButton'

export default function CustomerDetailsView({
  customer,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!customer) return null

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Customers"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Customers Directory
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Customer Profile: {customer.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            variant="cancel"
            size="sm"
            onClick={() => onEdit(customer)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Profile
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(customer)}
            icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
          >
            Delete Customer
          </Button>
        </div>
      </div>

      {/* Hero Customer Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
            {customer.name
              ? customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'CU'}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {customer.name}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${
                  customer.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={customer.status === 'Active' ? faCircleCheck : faBan}
                  className="mr-1.5 text-[10px]"
                />
                {customer.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1.5 text-slate-400" />
                {customer.email}
              </span>
              <span className="flex items-center font-mono">
                <FontAwesomeIcon icon={faPhone} className="mr-1.5 text-slate-400" />
                {customer.phone}
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
                customer.status === 'Active' ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              <FontAwesomeIcon
                icon={customer.status === 'Active' ? faCircleCheck : faBan}
                className="mr-1.5 text-[11px]"
              />
              {customer.status}
            </span>
          </div>
          <ToggleButton
            size="md"
            checked={customer.status === 'Active'}
            onChange={() => onToggleStatus(customer)}
            activeColor="#064C23"
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Personal & Contact Details
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Customer Name</span>
              <span className="font-bold text-slate-800">{customer.name}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Registered Mobile</span>
              <span className="font-mono font-bold text-slate-800 select-all">{customer.phone}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Email Address</span>
              <span className="font-medium text-slate-700 select-all">{customer.email}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Account Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-sm">
              <FontAwesomeIcon icon={faCalendarDays} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Account Overview
            </h3>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Customer ID</span>
              <span className="font-mono text-xs font-bold text-slate-500">#{customer.id}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Member Since</span>
              <span className="font-semibold text-slate-700">{customer.joined || 'Recent'}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">Account Access</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${
                customer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {customer.status === 'Active' ? 'Active / Ordering Allowed' : 'Restricted / Blocked'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
