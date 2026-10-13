import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import UserListView from './users/UserListView'
import AddUserView from './users/AddUserView'
import EditUserView from './users/EditUserView'
import UserDetailsView from './users/UserDetailsView'
import {
  getAdminUsersApi,
  createAdminUserApi,
  updateAdminUserApi,
  deleteAdminUserApi
} from '../../utils/adminApi'

const USERS_STORAGE_KEY = 'bazario_admin_users_data'

export default function AdminUsersView() {
  const toast = useToast()

  // Storage state
  const [users, setUsers] = useState([])

  // Fetch live admin users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAdminUsersApi()
        const list = res.users || res.data || []
        const formatted = (Array.isArray(list) ? list : []).map((u, idx) => ({
          ...u,
          id: u.id || u._id || idx + 1,
          _id: u._id || u.id,
          name: u.name || 'Admin',
          fathersName: u.fathersName || '',
          email: u.email || '',
          phone: u.phone || '',
          role: u.role || 'Admin',
          status: u.status || 'Active',
          lastLogin: u.lastLogin || 'Recently',
          avatar: u.avatar || null
        }))
        setUsers(formatted)
      } catch (err) {
        console.warn('API error fetching users:', err)
      }
    }
    fetchUsers()
  }, [])

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedUser, setSelectedUser] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (e) {
      console.error('Failed to persist admin users', e)
    }
  }, [users])

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedUser(null)
  }

  const handleOpenAdd = () => {
    setSelectedUser(null)
    setViewMode('add')
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setViewMode('edit')
  }

  const handleOpenView = (user) => {
    setSelectedUser(user)
    setViewMode('view')
  }

  // Save new user
  const handleSaveNew = async (newUser) => {
    try {
      const res = await createAdminUserApi({
        name: newUser.name,
        fathersName: newUser.fathersName || '',
        email: newUser.email,
        password: newUser.password || 'BazarioStore@2026',
        role: newUser.role || 'Admin',
        phone: newUser.phone || '',
        avatar: newUser.avatar || null,
        status: newUser.status || 'Active'
      })
      const created = res.data || res.user || newUser
      const formatted = {
        ...newUser,
        ...created,
        id: created._id || created.id || Date.now(),
        _id: created._id || created.id
      }
      setUsers([formatted, ...users])
      toast.success('Admin Created', `"${newUser.name}" has been registered as ${newUser.role}!`)
    } catch (err) {
      console.warn('Backend user save error:', err)
      setUsers([newUser, ...users])
      toast.success('Admin Created', `"${newUser.name}" has been registered as ${newUser.role}!`)
    }
    setViewMode('list')
  }

  // Save edited user
  const handleSaveEdited = async (updatedUser) => {
    const targetId = updatedUser._id || updatedUser.id
    try {
      const res = await updateAdminUserApi(targetId, {
        name: updatedUser.name,
        fathersName: updatedUser.fathersName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        status: updatedUser.status,
        ...(updatedUser.password ? { password: updatedUser.password } : {})
      })
      const saved = res.data || res.user || updatedUser
      const merged = { ...updatedUser, ...saved }
      const updatedList = users.map((u) => (String(u.id || u._id) === String(targetId) ? merged : u))
      setUsers(updatedList)
      setSelectedUser(merged)

      // Sync active session if the edited user is the logged in admin
      try {
        const storedAdmin = JSON.parse(localStorage.getItem('bazario_admin_user') || '{}')
        if (String(storedAdmin.id || storedAdmin._id) === String(targetId) || storedAdmin.email === updatedUser.email) {
          const updatedSession = { ...storedAdmin, ...merged }
          localStorage.setItem('bazario_admin_user', JSON.stringify(updatedSession))
          window.dispatchEvent(new Event('bazario_admin_profile_updated'))
        }
      } catch (e) {}

      toast.success('Admin Updated', `"${updatedUser.name}" profile saved successfully!`)
    } catch (err) {
      console.warn('Backend user update error:', err)
      const updatedList = users.map((u) => (String(u.id || u._id) === String(targetId) ? updatedUser : u))
      setUsers(updatedList)
      setSelectedUser(updatedUser)
      toast.success('Admin Updated', `"${updatedUser.name}" profile saved successfully!`)
    }
    setViewMode('list')
  }

  // Delete user
  const handleDelete = async (userId, userName) => {
    const targetUser = users.find((u) => String(u.id || u._id) === String(userId))
    try {
      await deleteAdminUserApi(targetUser?._id || userId)
    } catch (err) {
      console.warn('Backend delete error:', err)
    }
    setUsers((prev) => prev.filter((u) => String(u.id || u._id) !== String(userId)))
    setDeleteModal({ isOpen: false, user: null })
    if (selectedUser && String(selectedUser.id || selectedUser._id) === String(userId)) {
      setViewMode('list')
      setSelectedUser(null)
    }
    toast.success('Admin Removed', `"${userName}" has been removed from system administrators.`)
  }

  // Toggle status
  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminUserApi(user._id || user.id, { status: newStatus })
    } catch (err) {
      console.warn('Backend toggle status error:', err)
    }
    const updatedList = users.map((u) => (String(u.id || u._id) === String(user.id || user._id) ? { ...u, status: newStatus } : u))
    setUsers(updatedList)
    if (selectedUser && String(selectedUser.id || selectedUser._id) === String(user.id || user._id)) {
      setSelectedUser({ ...selectedUser, status: newStatus })
    }
    toast.info('Status Changed', `"${user.name}" is now ${newStatus}.`)
  }

  return (
    <>
      {/* 1. Add User Full-width Page */}
      {viewMode === 'add' && (
        <AddUserView
          onBack={handleGoToList}
          onSave={handleSaveNew}
        />
      )}

      {/* 2. Edit User Full-width Page */}
      {viewMode === 'edit' && selectedUser && (
        <EditUserView
          user={selectedUser}
          onBack={handleGoToList}
          onSave={handleSaveEdited}
        />
      )}

      {/* 3. View User Details Full-width Page */}
      {viewMode === 'view' && selectedUser && (
        <UserDetailsView
          user={selectedUser}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
          onDelete={(user) => setDeleteModal({ isOpen: true, user })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 0. Default Users Index List Table */}
      {viewMode === 'list' && (
        <UserListView
          users={users}
          onAddNew={handleOpenAdd}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(user) => setDeleteModal({ isOpen: true, user })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => handleDelete(deleteModal.user?.id, deleteModal.user?.name)}
        type="danger"
        title="Remove Admin Account"
        description={`Are you sure you want to permanently revoke system privileges for "${deleteModal.user?.name}"?`}
        confirmText="Yes, Remove Admin"
        cancelText="Cancel"
      />
    </>
  )
}
