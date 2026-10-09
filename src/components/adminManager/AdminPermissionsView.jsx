import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faStore,
  faBoxesStacked,
  faCartShopping,
  faUsers,
  faGear,
  faUserShield,
  faFloppyDisk
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ToggleButton from '../ui/ToggleButton'

const PERMISSION_GROUPS = [
  {
    category: 'Store Locations & Outlets',
    icon: faStore,
    iconColor: 'text-[#064C23]',
    permissions: [
      { id: 'stores.view', name: 'View Store Outlets', desc: 'Browse store listings, addresses, and live statuses', enabled: true },
      { id: 'stores.create', name: 'Add New Store', desc: 'Register new physical supermarkets and map coordinates', enabled: true },
      { id: 'stores.edit', name: 'Edit Store Info', desc: 'Update operating hours, phone numbers, and images', enabled: true },
      { id: 'stores.delete', name: 'Delete Store', desc: 'Permanently remove store records from database', enabled: false },
    ],
  },
  {
    category: 'Products & Inventory Catalog',
    icon: faBoxesStacked,
    iconColor: 'text-amber-600',
    permissions: [
      { id: 'products.view', name: 'View Products Catalog', desc: 'Search catalog, pricing, SKU barcodes, and categories', enabled: true },
      { id: 'products.create', name: 'Add Products', desc: 'Add new items into stock inventory', enabled: true },
      { id: 'products.pricing', name: 'Modify Unit Prices', desc: 'Adjust retail discount and shelf prices', enabled: true },
      { id: 'products.stock', name: 'Update Stock Levels', desc: 'Perform manual inventory counts & restock requisitions', enabled: true },
    ],
  },
  {
    category: 'Orders & POS Billing',
    icon: faCartShopping,
    iconColor: 'text-blue-600',
    permissions: [
      { id: 'orders.view', name: 'View All Orders', desc: 'Inspect live checkout orders and customer payment records', enabled: true },
      { id: 'orders.process', name: 'Update Order Status', desc: 'Mark orders as Processing, Completed, or Dispatched', enabled: true },
      { id: 'orders.refund', name: 'Issue Refunds', desc: 'Authorize customer transaction reversals and returns', enabled: false },
    ],
  },
  {
    category: 'Admin Manager & Security',
    icon: faUserShield,
    iconColor: 'text-[#A44F37]',
    permissions: [
      { id: 'admin.users', name: 'Manage Admin Users', desc: 'Create, suspend, or invite administrator accounts', enabled: true },
      { id: 'admin.roles', name: 'Configure Roles', desc: 'Create and adjust access control role privileges', enabled: true },
      { id: 'admin.permissions', name: 'Modify Permissions Matrix', desc: 'Toggle global security flags across modules', enabled: false },
    ],
  },
]

export default function AdminPermissionsView() {
  const toast = useToast()
  const [groups, setGroups] = useState(PERMISSION_GROUPS)

  const handleToggle = (groupIndex, permIndex) => {
    const updated = [...groups]
    updated[groupIndex].permissions[permIndex].enabled = !updated[groupIndex].permissions[permIndex].enabled
    setGroups(updated)
    toast.info('Permission Toggled', `${updated[groupIndex].permissions[permIndex].name} state changed.`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              System Permissions Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Audit granular security permissions, capability flags, and API endpoint access.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => toast.success('Saved', 'Permission matrix changes synchronized.')}
            icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
          >
            Save Permissions
          </Button>
        </div>
      </div>

      {/* Permissions Groups */}
      <div className="space-y-6">
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6"
          >
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className={`w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg ${group.iconColor}`}>
                <FontAwesomeIcon icon={group.icon} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{group.category}</h3>
                <p className="text-xs text-slate-400">Granular operation rules for this module</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.permissions.map((perm, pIdx) => (
                <div
                  key={perm.id}
                  onClick={() => handleToggle(gIdx, pIdx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    perm.enabled
                      ? 'bg-[#f0f9f3] border-[#bae2cb] hover:border-[#064C23]'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-800">{perm.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {perm.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{perm.desc}</p>
                  </div>

                  <ToggleButton
                    checked={perm.enabled}
                    onChange={() => handleToggle(gIdx, pIdx)}
                    activeColor="#064C23"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
