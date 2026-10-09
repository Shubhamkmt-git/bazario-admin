import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faSort,
  faLink,
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faTrashCan,
  faShieldHalved,
  faCopy
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../../context/ToastContext'
import Button from '../../ui/Button'
import BackButton from '../../ui/BackButton'
import ToggleButton from '../../ui/ToggleButton'

export default function PermissionDetailsView({
  permission,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const toast = useToast()

  if (!permission) return null

  const handleCopySlug = () => {
    navigator.clipboard.writeText(permission.slug)
    toast.success('Copied', `Slug "${permission.slug}" copied to clipboard!`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Permissions"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Permission Details
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Order #{permission.sortingOrder || 1}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  permission.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={permission.status === 'Active' ? faCircleCheck : faCircleXmark}
                  className="mr-1 text-[10px]"
                />
                {permission.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {permission.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              {permission.status === 'Active' ? 'Active' : 'Inactive'}
            </span>
            <ToggleButton
              size="sm"
              checked={permission.status === 'Active'}
              onChange={() => onToggleStatus(permission)}
              activeColor="#064C23"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(permission)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Permission
          </Button>
          <Button
            variant="cancel"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            onClick={() => onDelete(permission)}
            icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Details Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-2xl shrink-0">
              <FontAwesomeIcon icon={faKey} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                System Authority Key
              </span>
              <h2 className="text-2xl font-black text-slate-900">{permission.title}</h2>
            </div>
          </div>
        </div>

        {/* 3-Card Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Slug */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Programmatic Slug</span>
              <button
                type="button"
                onClick={handleCopySlug}
                className="text-xs text-[#064C23] hover:underline font-bold cursor-pointer inline-flex items-center space-x-1"
                title="Copy slug"
              >
                <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                <span>Copy</span>
              </button>
            </div>
            <p className="font-mono text-base font-bold text-slate-900 break-all">
              {permission.slug}
            </p>
            <p className="text-[11px] text-slate-500">Backend authority identifier</p>
          </div>

          {/* Card 2: Sorting Order */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Sorting Sequence</span>
              <FontAwesomeIcon icon={faSort} className="text-[#064C23] text-xs" />
            </div>
            <p className="font-mono text-base font-bold text-slate-900">
              #{permission.sortingOrder || 1}
            </p>
            <p className="text-[11px] text-slate-500">Display order in roles matrix</p>
          </div>

          {/* Card 3: Status */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Operational State</span>
              <FontAwesomeIcon
                icon={permission.status === 'Active' ? faCircleCheck : faCircleXmark}
                className={permission.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}
              />
            </div>
            <p className="text-base font-bold text-slate-900">
              {permission.status === 'Active' ? 'Enforced & Active' : 'Disabled'}
            </p>
            <p className="text-[11px] text-slate-500">Global role availability</p>
          </div>
        </div>
      </div>
    </div>
  )
}
