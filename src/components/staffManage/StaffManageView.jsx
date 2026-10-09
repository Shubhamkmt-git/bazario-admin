import React, { useState, useEffect } from 'react'
import StaffListView from './StaffListView'
import AddStaffView from './AddStaffView'
import EditStaffView from './EditStaffView'
import StaffDetailsView from './StaffDetailsView'
import { AlertModal } from '../index'
import { useToast } from '../../context/ToastContext'

const INITIAL_STAFF = [
  {
    id: 1,
    staffId: 'BAZ-STF-1001',
    name: 'Priya Sharma',
    store: 'Bazario Central Superstore #01',
    email: 'priya.sharma@bazario.in',
    mobilenumber: '+91 98765 11223',
    image: '',
    status: 'Active',
    createdAt: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 2,
    staffId: 'BAZ-STF-1002',
    name: 'Amit Patel',
    store: 'Bazario Express Store - Cyber City',
    email: 'amit.patel@bazario.in',
    mobilenumber: '+91 98111 44556',
    image: '',
    status: 'Active',
    createdAt: '2026-10-02T10:30:00.000Z'
  },
  {
    id: 3,
    staffId: 'BAZ-STF-1003',
    name: 'Neha Verma',
    store: 'Bazario Supermarket - Green Park',
    email: 'neha.verma@bazario.in',
    mobilenumber: '+91 97222 66778',
    image: '',
    status: 'Active',
    createdAt: '2026-10-03T11:15:00.000Z'
  },
  {
    id: 4,
    staffId: 'BAZ-STF-1004',
    name: 'Rajesh Kumar',
    store: 'Bazario Daily Outlet - Indirapuram',
    email: 'rajesh.kumar@bazario.in',
    mobilenumber: '+91 99888 33221',
    image: '',
    status: 'Inactive',
    createdAt: '2026-10-04T14:00:00.000Z'
  }
]

export default function StaffManageView() {
  const toast = useToast()

  // Load from localStorage or use initial seed
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_staff_manage')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Error loading staff from storage:', e)
    }
    return INITIAL_STAFF
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bazario_staff_manage', JSON.stringify(staffList))
    } catch (e) {
      console.error('Error saving staff to storage:', e)
    }
  }, [staffList])

  // Subrouting via window hash
  const [currentSubView, setCurrentSubView] = useState({ type: 'list', id: null })
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, staffId: null })

  // Parse URL Hash
  const syncSubViewFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
    const parts = hash.split('/')
    const base = parts[0]?.toLowerCase()

    if (base === 'staff-manage' || base === 'staffs' || base === 'staff') {
      const subAction = parts[1]?.toLowerCase()
      const targetId = parts[2] ? parseInt(parts[2], 10) : null

      if (subAction === 'add') {
        setCurrentSubView({ type: 'add', id: null })
      } else if (subAction === 'edit' && targetId) {
        setCurrentSubView({ type: 'edit', id: targetId })
      } else if (subAction === 'view' && targetId) {
        setCurrentSubView({ type: 'view', id: targetId })
      } else {
        setCurrentSubView({ type: 'list', id: null })
      }
    }
  }

  useEffect(() => {
    syncSubViewFromHash()
    const handleHash = () => syncSubViewFromHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Navigation helpers
  const goToList = () => {
    window.location.hash = '#/staff-manage'
    setCurrentSubView({ type: 'list', id: null })
  }

  const goToAddNew = () => {
    window.location.hash = '#/staff-manage/add'
    setCurrentSubView({ type: 'add', id: null })
  }

  const goToEdit = (id) => {
    window.location.hash = `#/staff-manage/edit/${id}`
    setCurrentSubView({ type: 'edit', id })
  }

  const goToView = (id) => {
    window.location.hash = `#/staff-manage/view/${id}`
    setCurrentSubView({ type: 'view', id })
  }

  // CRUD Operations
  const handleSaveNewStaff = (newStaff) => {
    setStaffList((prev) => [newStaff, ...prev])
    toast.success('Staff Added', `"${newStaff.name}" has been onboarded successfully.`)
    goToList()
  }

  const handleUpdateStaff = (updatedStaff) => {
    setStaffList((prev) =>
      prev.map((item) => (item.id === updatedStaff.id ? updatedStaff : item))
    )
    toast.success('Staff Updated', `"${updatedStaff.name}" details updated.`)
    goToList()
  }

  const handleToggleStatus = (id) => {
    setStaffList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active'
          toast.info(
            'Status Changed',
            `"${item.name}" is now ${nextStatus}.`
          )
          return { ...item, status: nextStatus }
        }
        return item
      })
    )
  }

  const handlePromptDelete = (id) => {
    setDeleteModalState({ isOpen: true, staffId: id })
  }

  const handleConfirmDelete = () => {
    const { staffId } = deleteModalState
    const targetStaff = staffList.find((s) => s.id === staffId)
    if (staffId) {
      setStaffList((prev) => prev.filter((item) => item.id !== staffId))
      toast.success(
        'Staff Deleted',
        `"${targetStaff?.name || 'Staff'}" was removed from the system.`
      )
    }
    setDeleteModalState({ isOpen: false, staffId: null })
  }

  // Active staff for edit / view
  const activeStaff = staffList.find((s) => s.id === currentSubView.id)

  return (
    <div className="w-full">
      {currentSubView.type === 'list' && (
        <StaffListView
          staffList={staffList}
          onAddNew={goToAddNew}
          onView={goToView}
          onEdit={goToEdit}
          onDelete={handlePromptDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {currentSubView.type === 'add' && (
        <AddStaffView onBack={goToList} onSave={handleSaveNewStaff} />
      )}

      {currentSubView.type === 'edit' && activeStaff && (
        <EditStaffView
          staff={activeStaff}
          onBack={goToList}
          onSave={handleUpdateStaff}
        />
      )}

      {currentSubView.type === 'view' && activeStaff && (
        <StaffDetailsView
          staff={activeStaff}
          onBack={goToList}
          onEdit={goToEdit}
        />
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, staffId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member from the supermarket records? All assigned credentials and branch access will be revoked."
        confirmText="Yes, Delete Staff"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
