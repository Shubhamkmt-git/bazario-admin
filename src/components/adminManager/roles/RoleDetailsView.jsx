import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved,
  faSort,
  faKey,
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faTrashCan,
  faCheck,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import ToggleButton from '../../ui/ToggleButton'

export default function RoleDetailsView({
  role,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!role) return null

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Roles"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Role Details
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Order #{role.sortingOrder || 1}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  role.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={role.status === 'Active' ? faCircleCheck : faCircleXmark}
                  className="mr-1 text-[10px]"
                />
                {role.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {role.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              {role.status === 'Active' ? 'Active' : 'Inactive'}
            </span>
            <ToggleButton
              size="sm"
              checked={role.status === 'Active'}
              onChange={() => onToggleStatus(role)}
              activeColor="#064C23"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(role)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Role
          </Button>
          {!role.isSystem && (
            <Button
              variant="cancel"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              onClick={() => onDelete(role)}
              icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Role Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-2xl shrink-0">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Role Specification
              </span>
              <h2 className="text-2xl font-black text-slate-900">{role.title}</h2>
              {role.subtitle && <p className="text-xs text-slate-500 mt-0.5">{role.subtitle}</p>}
            </div>
          </div>
        </div>

        {/* 3-Card Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <span className="text-xs font-bold uppercase text-slate-400">Granted Permissions</span>
            <p className="font-mono text-xl font-black text-[#064C23]">
              {role.permissions?.length || 0} Capabilities
            </p>
            <p className="text-[11px] text-slate-500">Privileges granted to this role</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <span className="text-xs font-bold uppercase text-slate-400">Sorting Priority</span>
            <p className="font-mono text-xl font-black text-slate-900">
              #{role.sortingOrder || 1}
            </p>
            <p className="text-[11px] text-slate-500">Listing display sequence</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
            <span className="text-xs font-bold uppercase text-slate-400">Role State</span>
            <p className="text-xl font-black text-slate-900">
              {role.status === 'Active' ? 'Active & Assignable' : 'Suspended'}
            </p>
            <p className="text-[11px] text-slate-500">Security enforcement status</p>
          </div>
        </div>

        {/* Assigned Permissions List */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faKey} className="text-amber-600" />
            <span>Active Permissions Checklist ({role.permissions?.length || 0})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {role.permissions && role.permissions.length > 0 ? (
              role.permissions.map((permId) => (
                <div
                  key={permId}
                  className="p-3 bg-[#f0f9f3] border border-[#bae2cb] rounded-xl flex items-center space-x-2.5 text-xs text-slate-800 font-bold"
                >
                  <FontAwesomeIcon icon={faCheck} className="text-[#064C23] text-xs shrink-0" />
                  <span className="truncate font-mono">{permId}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No permissions assigned to this role.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
