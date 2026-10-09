import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import RoleListView from './roles/RoleListView'
import AddRoleView from './roles/AddRoleView'
import EditRoleView from './roles/EditRoleView'
import RoleDetailsView from './roles/RoleDetailsView'

const ROLES_STORAGE_KEY = 'bazario_roles_data'

const INITIAL_ROLES = [
  {
    id: 1,
    title: 'Super Admin',
    subtitle: 'Full unrestricted root access to all stores, finance, settings, and staff credentials.',
    sortingOrder: 1,
    permissions: [
      'stores.view-outlets',
      'stores.create-location',
      'stores.edit-details',
      'stores.delete-records',
      'products.manage-stock',
      'orders.process-orders',
      'admin.manage-users',
      'orders.issue-refunds',
    ],
    status: 'Active',
    isSystem: true,
  },
  {
    id: 2,
    title: 'Store Manager',
    subtitle: 'Operational control over local store products, stock levels, orders, and daily POS cashflow.',
    sortingOrder: 2,
    permissions: [
      'stores.view-outlets',
      'stores.edit-details',
      'products.manage-stock',
      'orders.process-orders',
    ],
    status: 'Active',
    isSystem: false,
  },
  {
    id: 3,
    title: 'Inventory Lead',
    subtitle: 'Manage warehouse inventory intake, SKU barcodes, stock refill alerts, and supplier receipts.',
    sortingOrder: 3,
    permissions: [
      'products.manage-stock',
      'stores.view-outlets',
    ],
    status: 'Active',
    isSystem: false,
  },
  {
    id: 4,
    title: 'Customer Support Agent',
    subtitle: 'Handle customer inquiries, order delivery tracking, refunds, and support ticket resolutions.',
    sortingOrder: 4,
    permissions: [
      'orders.process-orders',
      'orders.issue-refunds',
      'stores.view-outlets',
    ],
    status: 'Active',
    isSystem: false,
  },
]

export default function AdminRolesView() {
  const toast = useToast()

  // Storage state
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem(ROLES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_ROLES
    } catch {
      return INITIAL_ROLES
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedRole, setSelectedRole] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, role: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles))
    } catch (e) {
      console.error('Failed to persist roles', e)
    }
  }, [roles])

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedRole(null)
  }

  const handleOpenAdd = () => {
    setSelectedRole(null)
    setViewMode('add')
  }

  const handleOpenEdit = (role) => {
    setSelectedRole(role)
    setViewMode('edit')
  }

  const handleOpenView = (role) => {
    setSelectedRole(role)
    setViewMode('view')
  }

  // Save new role
  const handleSaveNew = (newRole) => {
    setRoles([newRole, ...roles])
    toast.success('Role Created', `"${newRole.title}" has been created successfully!`)
    setViewMode('list')
  }

  // Save edited role
  const handleSaveEdited = (updatedRole) => {
    const updatedList = roles.map((r) => (r.id === updatedRole.id ? updatedRole : r))
    setRoles(updatedList)
    setSelectedRole(updatedRole)
    toast.success('Role Updated', `"${updatedRole.title}" updated successfully!`)
    setViewMode('list')
  }

  // Delete role
  const handleDelete = (roleId, roleTitle) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId))
    setDeleteModal({ isOpen: false, role: null })
    if (selectedRole && selectedRole.id === roleId) {
      setViewMode('list')
      setSelectedRole(null)
    }
    toast.success('Role Removed', `"${roleTitle}" removed from access control roles.`)
  }

  // Toggle status
  const handleToggleStatus = (role) => {
    const newStatus = role.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = roles.map((r) => (r.id === role.id ? { ...r, status: newStatus } : r))
    setRoles(updatedList)
    if (selectedRole && selectedRole.id === role.id) {
      setSelectedRole({ ...selectedRole, status: newStatus })
    }
    toast.info('Status Changed', `"${role.title}" is now ${newStatus}.`)
  }

  return (
    <>
      {/* 1. Add Role Full-width Page */}
      {viewMode === 'add' && (
        <AddRoleView
          onBack={handleGoToList}
          onSave={handleSaveNew}
          defaultSortingOrder={roles.length + 1}
        />
      )}

      {/* 2. Edit Role Full-width Page */}
      {viewMode === 'edit' && selectedRole && (
        <EditRoleView
          role={selectedRole}
          onBack={handleGoToList}
          onSave={handleSaveEdited}
        />
      )}

      {/* 3. View Role Details Full-width Page */}
      {viewMode === 'view' && selectedRole && (
        <RoleDetailsView
          role={selectedRole}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
          onDelete={(role) => setDeleteModal({ isOpen: true, role })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 0. Default Roles Index List Table */}
      {viewMode === 'list' && (
        <RoleListView
          roles={roles}
          onAddNew={handleOpenAdd}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(role) => setDeleteModal({ isOpen: true, role })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, role: null })}
        onConfirm={() => handleDelete(deleteModal.role?.id, deleteModal.role?.title)}
        type="danger"
        title="Delete Access Role"
        description={`Are you sure you want to delete role "${deleteModal.role?.title}"? Staff members assigned to this role will lose their privileges.`}
        confirmText="Yes, Delete Role"
        cancelText="Cancel"
      />
    </>
  )
}
