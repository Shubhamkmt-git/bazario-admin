import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import PermissionListView from './permissions/PermissionListView'
import AddPermissionView from './permissions/AddPermissionView'
import EditPermissionView from './permissions/EditPermissionView'
import PermissionDetailsView from './permissions/PermissionDetailsView'

const PERMISSIONS_STORAGE_KEY = 'bazario_permissions_data'

const INITIAL_PERMISSIONS = [
  {
    id: 1,
    title: 'View Store Outlets',
    slug: 'stores.view-outlets',
    sortingOrder: 1,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Create Store Location',
    slug: 'stores.create-location',
    sortingOrder: 2,
    status: 'Active',
  },
  {
    id: 3,
    title: 'Edit Store Details',
    slug: 'stores.edit-details',
    sortingOrder: 3,
    status: 'Active',
  },
  {
    id: 4,
    title: 'Delete Store Records',
    slug: 'stores.delete-records',
    sortingOrder: 4,
    status: 'Active',
  },
  {
    id: 5,
    title: 'Manage Products & Stock',
    slug: 'products.manage-stock',
    sortingOrder: 5,
    status: 'Active',
  },
  {
    id: 6,
    title: 'Process Customer Orders',
    slug: 'orders.process-orders',
    sortingOrder: 6,
    status: 'Active',
  },
  {
    id: 7,
    title: 'Manage Admin Users & Security',
    slug: 'admin.manage-users',
    sortingOrder: 7,
    status: 'Active',
  },
  {
    id: 8,
    title: 'Issue Financial Refunds',
    slug: 'orders.issue-refunds',
    sortingOrder: 8,
    status: 'Inactive',
  },
]

export default function AdminPermissionsView() {
  const toast = useToast()

  // Storage state
  const [permissions, setPermissions] = useState(() => {
    try {
      const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_PERMISSIONS
    } catch {
      return INITIAL_PERMISSIONS
    }
  })

  // Full-width view state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedPermission, setSelectedPermission] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, permission: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
    } catch (e) {
      console.error('Failed to persist permissions', e)
    }
  }, [permissions])

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedPermission(null)
  }

  const handleOpenAdd = () => {
    setSelectedPermission(null)
    setViewMode('add')
  }

  const handleOpenEdit = (perm) => {
    setSelectedPermission(perm)
    setViewMode('edit')
  }

  const handleOpenView = (perm) => {
    setSelectedPermission(perm)
    setViewMode('view')
  }

  // Save new permission
  const handleSaveNew = (newPerm) => {
    setPermissions([newPerm, ...permissions])
    toast.success('Permission Created', `"${newPerm.title}" added to system permissions!`)
    setViewMode('list')
  }

  // Save edited permission
  const handleSaveEdited = (updatedPerm) => {
    const updatedList = permissions.map((p) => (p.id === updatedPerm.id ? updatedPerm : p))
    setPermissions(updatedList)
    setSelectedPermission(updatedPerm)
    toast.success('Permission Updated', `"${updatedPerm.title}" updated successfully!`)
    setViewMode('list')
  }

  // Delete permission
  const handleDelete = (permId, permTitle) => {
    setPermissions((prev) => prev.filter((p) => p.id !== permId))
    setDeleteModal({ isOpen: false, permission: null })
    if (selectedPermission && selectedPermission.id === permId) {
      setViewMode('list')
      setSelectedPermission(null)
    }
    toast.success('Permission Removed', `"${permTitle}" removed from permissions matrix.`)
  }

  // Toggle active/inactive status
  const handleToggleStatus = (perm) => {
    const newStatus = perm.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = permissions.map((p) => (p.id === perm.id ? { ...p, status: newStatus } : p))
    setPermissions(updatedList)
    if (selectedPermission && selectedPermission.id === perm.id) {
      setSelectedPermission({ ...selectedPermission, status: newStatus })
    }
    toast.info('Status Changed', `"${perm.title}" is now ${newStatus}.`)
  }

  return (
    <>
      {/* 1. Add Permission Full-width Page */}
      {viewMode === 'add' && (
        <AddPermissionView
          onBack={handleGoToList}
          onSave={handleSaveNew}
          defaultSortingOrder={permissions.length + 1}
        />
      )}

      {/* 2. Edit Permission Full-width Page */}
      {viewMode === 'edit' && selectedPermission && (
        <EditPermissionView
          permission={selectedPermission}
          onBack={handleGoToList}
          onSave={handleSaveEdited}
        />
      )}

      {/* 3. View Permission Details Full-width Page */}
      {viewMode === 'view' && selectedPermission && (
        <PermissionDetailsView
          permission={selectedPermission}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
          onDelete={(perm) => setDeleteModal({ isOpen: true, permission: perm })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 0. Default Permissions Index List Table */}
      {viewMode === 'list' && (
        <PermissionListView
          permissions={permissions}
          onAddNew={handleOpenAdd}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(perm) => setDeleteModal({ isOpen: true, permission: perm })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, permission: null })}
        onConfirm={() => handleDelete(deleteModal.permission?.id, deleteModal.permission?.title)}
        type="danger"
        title="Delete System Permission"
        description={`Are you sure you want to permanently delete "${deleteModal.permission?.title}" (${deleteModal.permission?.slug})? This cannot be undone.`}
        confirmText="Yes, Delete Permission"
        cancelText="Cancel"
      />
    </>
  )
}
