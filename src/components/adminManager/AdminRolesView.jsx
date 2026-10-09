import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShieldHalved,
  faPlus,
  faUsers,
  faKey,
  faCheck,
  faPenToSquare,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'

const INITIAL_ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full unrestricted root access to all stores, finance, settings, and staff credentials.',
    usersCount: 2,
    permissionsCount: 'All (38/38)',
    badgeColor: 'bg-[#064C23] text-white',
    isSystem: true,
  },
  {
    id: 2,
    name: 'Store Manager',
    description: 'Operational control over local store products, stock levels, orders, and daily POS cashflow.',
    usersCount: 6,
    permissionsCount: '24 Permissions',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    isSystem: false,
  },
  {
    id: 3,
    name: 'Inventory Lead',
    description: 'Manage warehouse inventory intake, SKU barcodes, stock refill alerts, and supplier receipts.',
    usersCount: 4,
    permissionsCount: '16 Permissions',
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    isSystem: false,
  },
  {
    id: 4,
    name: 'Customer Support Agent',
    description: 'Handle customer inquiries, order delivery tracking, refunds, and support ticket resolutions.',
    usersCount: 8,
    permissionsCount: '9 Permissions',
    badgeColor: 'bg-blue-100 text-blue-800 border border-blue-300',
    isSystem: false,
  },
]

export default function AdminRolesView() {
  const toast = useToast()
  const [roles, setRoles] = useState(INITIAL_ROLES)

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Roles & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Define administrative security roles, privilege bundles, and staff permission boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => toast.info('New Role', 'Creating new custom role...')}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Create New Role
          </Button>
        </div>
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${role.badgeColor}`}>
                      <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-[10px]" />
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        System Built-in
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-1">{role.name}</h3>
                </div>

                <div className="flex items-center space-x-1">
                  <ActionButton
                    action="edit"
                    onClick={() => toast.info('Edit Role', `Editing permissions for ${role.name}...`)}
                  />
                  {!role.isSystem && (
                    <ActionButton
                      action="delete"
                      onClick={() => toast.warning('Delete Role', `Cannot delete active role ${role.name}.`)}
                    />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {role.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
                <FontAwesomeIcon icon={faUsers} className="text-[#064C23]" />
                <span>{role.usersCount} Staff Members</span>
              </div>

              <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
                <FontAwesomeIcon icon={faKey} className="text-amber-600" />
                <span>{role.permissionsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
