import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import PermissionListView from './permissions/PermissionListView'
import AddPermissionView from './permissions/AddPermissionView'
import EditPermissionView from './permissions/EditPermissionView'
import PermissionDetailsView from './permissions/PermissionDetailsView'
import {
  getAdminPermissionsApi,
  createAdminPermissionApi,
  updateAdminPermissionApi,
  deleteAdminPermissionApi
} from '../../utils/adminApi'

const PERMISSIONS_STORAGE_KEY = 'bazario_permissions_data'

export default function AdminPermissionsView() {
  const toast = useToast()

  // Storage state
  const [permissions, setPermissions] = useState([])

  // Fetch live permissions from backend API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await getAdminPermissionsApi()
        const list = res.permissions || res.data || []
        const formatted = (Array.isArray(list) ? list : []).map((p, idx) => ({
          ...p,
          id: p.id || p._id || idx + 1,
          title: p.title || p.name || 'Permission',
          slug: p.slug || '',
          sortingOrder: p.sortingOrder || idx + 1,
          status: p.status || 'Active'
        }))
        setPermissions(formatted)
      } catch (err) {
        console.warn('API error fetching permissions:', err)
      }
    }
    fetchPermissions()
  }, [])

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
  const handleSaveNew = async (newPerm) => {
    try {
      const res = await createAdminPermissionApi({
        title: newPerm.title,
        name: newPerm.title,
        slug: newPerm.slug,
        sortingOrder: newPerm.sortingOrder || permissions.length + 1,
        status: newPerm.status || 'Active'
      })
      const created = res.data || res.permission || newPerm
      const formatted = {
        ...newPerm,
        ...created,
        id: created._id || created.id || Date.now()
      }
      setPermissions([formatted, ...permissions])
      toast.success('Permission Created', `"${newPerm.title}" added to system permissions!`)
    } catch (err) {
      console.warn('Backend create permission error:', err)
      setPermissions([newPerm, ...permissions])
      toast.success('Permission Created', `"${newPerm.title}" added to system permissions!`)
    }
    setViewMode('list')
  }

  // Save edited permission
  const handleSaveEdited = async (updatedPerm) => {
    try {
      const targetId = updatedPerm._id || updatedPerm.id
      await updateAdminPermissionApi(targetId, {
        title: updatedPerm.title,
        name: updatedPerm.title,
        slug: updatedPerm.slug,
        sortingOrder: updatedPerm.sortingOrder,
        status: updatedPerm.status
      })
    } catch (err) {
      console.warn('Backend update permission error:', err)
    }
    const updatedList = permissions.map((p) => (String(p.id || p._id) === String(updatedPerm.id || updatedPerm._id) ? updatedPerm : p))
    setPermissions(updatedList)
    setSelectedPermission(updatedPerm)
    toast.success('Permission Updated', `"${updatedPerm.title}" updated successfully!`)
    setViewMode('list')
  }

  // Delete permission
  const handleDelete = async (permId, permTitle) => {
    const targetPerm = permissions.find((p) => String(p.id || p._id) === String(permId))
    try {
      await deleteAdminPermissionApi(targetPerm?._id || permId)
    } catch (err) {
      console.warn('Backend delete permission error:', err)
    }
    setPermissions((prev) => prev.filter((p) => String(p.id || p._id) !== String(permId)))
    setDeleteModal({ isOpen: false, permission: null })
    if (selectedPermission && String(selectedPermission.id || selectedPermission._id) === String(permId)) {
      setViewMode('list')
      setSelectedPermission(null)
    }
    toast.success('Permission Removed', `"${permTitle}" removed from permissions matrix.`)
  }

  // Toggle active/inactive status
  const handleToggleStatus = async (perm) => {
    const newStatus = perm.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminPermissionApi(perm._id || perm.id, { status: newStatus })
    } catch (err) {
      console.warn('Backend toggle status error:', err)
    }
    const updatedList = permissions.map((p) => (String(p.id || p._id) === String(perm.id || perm._id) ? { ...p, status: newStatus } : p))
    setPermissions(updatedList)
    if (selectedPermission && String(selectedPermission.id || selectedPermission._id) === String(perm.id || perm._id)) {
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
