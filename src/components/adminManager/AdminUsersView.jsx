import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserTie,
  faPlus,
  faMagnifyingGlass,
  faShieldHalved,
  faEnvelope,
  faPhone,
  faCircleCheck,
  faClock,
  faKey,
  faTrashCan,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'
import AlertModal from '../ui/AlertModal'
import ToggleButton from '../ui/ToggleButton'

const INITIAL_ADMIN_USERS = [
  {
    id: 1,
    name: 'Shubham Kumar',
    email: 'shubham@bazario.com',
    phone: '+91 98111 00221',
    role: 'Super Admin',
    roleColor: 'bg-[#064C23] text-white',
    status: 'Active',
    lastLogin: '10 mins ago',
  },
  {
    id: 2,
    name: 'Aakash Verma',
    email: 'aakash.v@bazario.com',
    phone: '+91 98222 33441',
    role: 'Store Manager',
    roleColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    status: 'Active',
    lastLogin: '2 hours ago',
  },
  {
    id: 3,
    name: 'Sneha Patel',
    email: 'sneha.p@bazario.com',
    phone: '+91 98333 44552',
    role: 'Inventory Lead',
    roleColor: 'bg-amber-100 text-amber-800 border border-amber-300',
    status: 'Active',
    lastLogin: 'Yesterday',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    email: 'rohan.m@bazario.com',
    phone: '+91 98444 55663',
    role: 'Support Agent',
    roleColor: 'bg-blue-100 text-blue-800 border border-blue-300',
    status: 'Inactive',
    lastLogin: '3 days ago',
  },
]

export default function AdminUsersView() {
  const toast = useToast()
  const [users, setUsers] = useState(INITIAL_ADMIN_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
    toast.info('Status Updated', `${user.name} is now ${newStatus}.`)
  }

  const handleDelete = (userId, userName) => {
    setUsers(users.filter((u) => u.id !== userId))
    setDeleteModal({ isOpen: false, user: null })
    toast.success('Admin Removed', `${userName} has been removed from system admins.`)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faUserTie} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Users
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage system administrator accounts, security credentials, and department assignments.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => toast.info('New Admin', 'Opening Add Admin User form...')}
            icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
          >
            Add Admin User
          </Button>
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search admin name, email, role..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-3.5 py-1.5 rounded-xl border border-[#bae2cb]">
            {filteredUsers.length} Admin Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4">Admin Profile</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#064C23] to-[#A44F37] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{user.name}</span>
                          <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                      {user.phone}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${user.roleColor}`}>
                        <FontAwesomeIcon icon={faShieldHalved} className="mr-1.5 text-[10px]" />
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <ToggleButton
                        size="sm"
                        checked={user.status === 'Active'}
                        onChange={() => handleToggleStatus(user)}
                        activeColor="#064C23"
                      />
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {user.lastLogin}
                    </td>

                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <ActionButton
                        action="edit"
                        onClick={() => toast.info('Edit User', `Editing ${user.name}...`)}
                      />
                      <ActionButton
                        action="delete"
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No admin users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={() => handleDelete(deleteModal.user?.id, deleteModal.user?.name)}
        type="danger"
        title="Remove Admin User"
        description={`Are you sure you want to revoke admin access for "${deleteModal.user?.name}"?`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
      />
    </div>
  )
}
