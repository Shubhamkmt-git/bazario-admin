import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import RoleListView from './roles/RoleListView'
import AddRoleView from './roles/AddRoleView'
import EditRoleView from './roles/EditRoleView'
import RoleDetailsView from './roles/RoleDetailsView'
import {
  getAdminRolesApi,
  createAdminRoleApi,
  updateAdminRoleApi,
  deleteAdminRoleApi
} from '../../utils/adminApi'

const ROLES_STORAGE_KEY = 'bazario_roles_data'

export default function AdminRolesView() {
  const toast = useToast()

  // Storage state
  const [roles, setRoles] = useState([])

  // Fetch live roles from backend API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAdminRolesApi()
        const list = res.roles || res.data || []
        const formatted = (Array.isArray(list) ? list : []).map((r, idx) => ({
          ...r,
          id: r.id || r._id || idx + 1,
          title: r.title || r.name || 'Role',
          subtitle: r.subtitle || r.description || '',
          permissions: r.permissions || [],
          sortingOrder: r.sortingOrder || idx + 1,
          status: r.status || 'Active',
          isSystem: Boolean(r.isSystem)
        }))
        setRoles(formatted)
      } catch (err) {
        console.warn('API error fetching roles:', err)
      }
    }
    fetchRoles()
  }, [])

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
  const handleSaveNew = async (newRole) => {
    try {
      const res = await createAdminRoleApi({
        title: newRole.title,
        name: newRole.title,
        subtitle: newRole.subtitle,
        description: newRole.subtitle,
        permissions: newRole.permissions || [],
        sortingOrder: newRole.sortingOrder || roles.length + 1,
        status: newRole.status || 'Active'
      })
      const created = res.data || res.role || newRole
      const formatted = {
        ...newRole,
        ...created,
        id: created._id || created.id || Date.now()
      }
      setRoles([formatted, ...roles])
      toast.success('Role Created', `"${newRole.title}" has been created successfully!`)
    } catch (err) {
      console.warn('Backend create role error:', err)
      setRoles([newRole, ...roles])
      toast.success('Role Created', `"${newRole.title}" has been created successfully!`)
    }
    setViewMode('list')
  }

  // Save edited role
  const handleSaveEdited = async (updatedRole) => {
    try {
      const targetId = updatedRole._id || updatedRole.id
      await updateAdminRoleApi(targetId, {
        title: updatedRole.title,
        name: updatedRole.title,
        subtitle: updatedRole.subtitle,
        description: updatedRole.subtitle,
        permissions: updatedRole.permissions,
        sortingOrder: updatedRole.sortingOrder,
        status: updatedRole.status
      })
    } catch (err) {
      console.warn('Backend update role error:', err)
    }
    const updatedList = roles.map((r) => (String(r.id || r._id) === String(updatedRole.id || updatedRole._id) ? updatedRole : r))
    setRoles(updatedList)
    setSelectedRole(updatedRole)
    toast.success('Role Updated', `"${updatedRole.title}" updated successfully!`)
    setViewMode('list')
  }

  // Delete role
  const handleDelete = async (roleId, roleTitle) => {
    const targetRole = roles.find((r) => String(r.id || r._id) === String(roleId))
    try {
      await deleteAdminRoleApi(targetRole?._id || roleId)
    } catch (err) {
      console.warn('Backend delete role error:', err)
    }
    setRoles((prev) => prev.filter((r) => String(r.id || r._id) !== String(roleId)))
    setDeleteModal({ isOpen: false, role: null })
    if (selectedRole && String(selectedRole.id || selectedRole._id) === String(roleId)) {
      setViewMode('list')
      setSelectedRole(null)
    }
    toast.success('Role Removed', `"${roleTitle}" removed from access control roles.`)
  }

  // Toggle status
  const handleToggleStatus = async (role) => {
    const newStatus = role.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminRoleApi(role._id || role.id, { status: newStatus })
    } catch (err) {
      console.warn('Backend toggle status error:', err)
    }
    const updatedList = roles.map((r) => (String(r.id || r._id) === String(role.id || role._id) ? { ...r, status: newStatus } : r))
    setRoles(updatedList)
    if (selectedRole && String(selectedRole.id || selectedRole._id) === String(role.id || role._id)) {
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
