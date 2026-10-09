import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import UserListView from './users/UserListView'
import AddUserView from './users/AddUserView'
import EditUserView from './users/EditUserView'
import UserDetailsView from './users/UserDetailsView'

const USERS_STORAGE_KEY = 'bazario_admin_users_data'

const INITIAL_ADMIN_USERS = [
  {
    id: 1,
    name: 'Shubham Kumar',
    fathersName: 'Rajesh Kumar',
    email: 'shubham@bazario.com',
    phone: '+91 98111 00221',
    password: 'password123',
    role: 'Super Admin',
    status: 'Active',
    avatar: null,
    lastLogin: '10 mins ago',
  },
  {
    id: 2,
    name: 'Aakash Verma',
    fathersName: 'Mahesh Verma',
    email: 'aakash.v@bazario.com',
    phone: '+91 98222 33441',
    password: 'password123',
    role: 'Store Manager',
    status: 'Active',
    avatar: null,
    lastLogin: '2 hours ago',
  },
  {
    id: 3,
    name: 'Sneha Patel',
    fathersName: 'Kirit Patel',
    email: 'sneha.p@bazario.com',
    phone: '+91 98333 44552',
    password: 'password123',
    role: 'Inventory Lead',
    status: 'Active',
    avatar: null,
    lastLogin: 'Yesterday',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    fathersName: 'Suresh Mehta',
    email: 'rohan.m@bazario.com',
    phone: '+91 98444 55663',
    password: 'password123',
    role: 'Customer Support Agent',
    status: 'Inactive',
    avatar: null,
    lastLogin: '3 days ago',
  },
]

export default function AdminUsersView() {
  const toast = useToast()

  // Storage state
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS
    } catch {
      return INITIAL_ADMIN_USERS
    }
  })

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
  const handleSaveNew = (newUser) => {
    setUsers([newUser, ...users])
    toast.success('Admin Created', `"${newUser.name}" has been registered as ${newUser.role}!`)
    setViewMode('list')
  }

  // Save edited user
  const handleSaveEdited = (updatedUser) => {
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    setUsers(updatedList)
    setSelectedUser(updatedUser)
    toast.success('Admin Updated', `"${updatedUser.name}" profile saved successfully!`)
    setViewMode('list')
  }

  // Delete user
  const handleDelete = (userId, userName) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    setDeleteModal({ isOpen: false, user: null })
    if (selectedUser && selectedUser.id === userId) {
      setViewMode('list')
      setSelectedUser(null)
    }
    toast.success('Admin Removed', `"${userName}" has been removed from system administrators.`)
  }

  // Toggle status
  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    setUsers(updatedList)
    if (selectedUser && selectedUser.id === user.id) {
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
