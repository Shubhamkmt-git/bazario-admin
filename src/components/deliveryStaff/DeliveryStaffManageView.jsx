import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import DeliveryStaffListView from './DeliveryStaffListView'
import AddDeliveryStaffView from './AddDeliveryStaffView'
import EditDeliveryStaffView from './EditDeliveryStaffView'
import DeliveryStaffDetailsView from './DeliveryStaffDetailsView'

const DELIVERY_STAFF_STORAGE_KEY = 'bazario_delivery_staff'

const INITIAL_DELIVERY_STAFF = [
  {
    id: 1,
    riderId: 'BAZ-DRV-1001',
    name: 'Ramesh Kumar Sharma',
    mobileNumber: '+91 98765 43210',
    email: 'ramesh.sharma@bazario.in',
    belongToStore: 'Bazario Central Superstore #01',
    image: '',
    status: 'Active'
  },
  {
    id: 2,
    riderId: 'BAZ-DRV-1002',
    name: 'Mohammad Imran Khan',
    mobileNumber: '+91 98111 22334',
    email: 'imran.khan@bazario.in',
    belongToStore: 'Bazario Express Store - Cyber City',
    image: '',
    status: 'Active'
  },
  {
    id: 3,
    riderId: 'BAZ-DRV-1003',
    name: 'Sunil Gurjar',
    mobileNumber: '+91 97222 33445',
    email: 'sunil.gurjar@bazario.in',
    belongToStore: 'Bazario Supermarket - Green Park',
    image: '',
    status: 'Active'
  },
  {
    id: 4,
    riderId: 'BAZ-DRV-1004',
    name: 'Vikas Deep Singh',
    mobileNumber: '+91 99888 77665',
    email: 'vikas.singh@bazario.in',
    belongToStore: 'Bazario Daily Outlet - Indirapuram',
    image: '',
    status: 'Inactive'
  }
]

export default function DeliveryStaffManageView() {
  const toast = useToast()

  // Storage State
  const [staffMembers, setStaffMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_STAFF_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_DELIVERY_STAFF
    } catch {
      return INITIAL_DELIVERY_STAFF
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedStaff, setSelectedStaff] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, staff: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_STAFF_STORAGE_KEY, JSON.stringify(staffMembers))
    } catch (e) {
      console.error('Failed to persist delivery staff', e)
    }
  }, [staffMembers])

  // Hash Route Parser & Listener
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
      if (
        hash.startsWith('delivery-staff') ||
        hash.startsWith('delivery-staffs') ||
        hash.startsWith('delivery-team')
      ) {
        const parts = hash.split('/')
        const action = parts[1] // 'add' | 'edit' | 'view'
        const id = parts[2] ? parts[2] : null

        if (action === 'add') {
          setSelectedStaff(null)
          setViewMode('add')
        } else if (action === 'edit' && id) {
          const found = staffMembers.find((s) => String(s.id) === String(id))
          if (found) {
            setSelectedStaff(found)
            setViewMode('edit')
          } else {
            setViewMode('list')
          }
        } else if (action === 'view' && id) {
          const found = staffMembers.find((s) => String(s.id) === String(id))
          if (found) {
            setSelectedStaff(found)
            setViewMode('view')
          } else {
            setViewMode('list')
          }
        } else if (!action) {
          setViewMode('list')
        }
      }
    }

    parseRoute()
    window.addEventListener('hashchange', parseRoute)
    return () => window.removeEventListener('hashchange', parseRoute)
  }, [staffMembers])

  // Navigation handlers with route update
  const handleGoToList = () => {
    window.location.hash = '#/delivery-staff'
    setViewMode('list')
    setSelectedStaff(null)
  }

  const handleOpenAdd = () => {
    window.location.hash = '#/delivery-staff/add'
    setSelectedStaff(null)
    setViewMode('add')
  }

  const handleOpenEdit = (staff) => {
    window.location.hash = `#/delivery-staff/edit/${staff.id}`
    setSelectedStaff(staff)
    setViewMode('edit')
  }

  const handleOpenView = (staff) => {
    window.location.hash = `#/delivery-staff/view/${staff.id}`
    setSelectedStaff(staff)
    setViewMode('view')
  }

  // Save new delivery staff
  const handleSaveNewStaff = (newStaff) => {
    const updatedList = [newStaff, ...staffMembers]
    setStaffMembers(updatedList)
    toast.success('Staff Added', `"${newStaff.name}" has been added to delivery fleet!`)
    handleGoToList()
  }

  // Save edited delivery staff
  const handleSaveEditedStaff = (updatedStaff) => {
    const updatedList = staffMembers.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    setStaffMembers(updatedList)
    setSelectedStaff(updatedStaff)
    toast.success('Staff Updated', `"${updatedStaff.name}" updated successfully!`)
    handleGoToList()
  }

  // Delete delivery staff
  const handleDeleteStaff = (staffId, staffName) => {
    setStaffMembers((prev) => prev.filter((s) => s.id !== staffId))
    setDeleteModal({ isOpen: false, staff: null })
    if (selectedStaff && selectedStaff.id === staffId) {
      handleGoToList()
    }
    toast.success('Staff Removed', `"${staffName}" removed from delivery fleet.`)
  }

  // Toggle status
  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = staffMembers.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s))
    setStaffMembers(updatedList)
    if (selectedStaff && selectedStaff.id === staff.id) {
      setSelectedStaff({ ...selectedStaff, status: newStatus })
    }
    toast.info('Status Changed', `"${staff.name}" is now ${newStatus === 'Active' ? 'Active / On Duty' : 'Inactive / Off Duty'}.`)
  }

  return (
    <div className="space-y-6">
      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <DeliveryStaffListView
          staffMembers={staffMembers}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onOpenView={handleOpenView}
          onOpenDelete={(staff) => setDeleteModal({ isOpen: true, staff })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 2. ADD VIEW */}
      {viewMode === 'add' && (
        <AddDeliveryStaffView
          onBack={handleGoToList}
          onSave={handleSaveNewStaff}
        />
      )}

      {/* 3. EDIT VIEW */}
      {viewMode === 'edit' && selectedStaff && (
        <EditDeliveryStaffView
          staff={selectedStaff}
          onBack={handleGoToList}
          onSave={handleSaveEditedStaff}
        />
      )}

      {/* 4. DETAILS VIEW */}
      {viewMode === 'view' && selectedStaff && (
        <DeliveryStaffDetailsView
          staff={selectedStaff}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
        />
      )}

      {/* Reusable AlertModal for Delete Confirmation */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, staff: null })}
        onConfirm={() =>
          handleDeleteStaff(deleteModal.staff?.id, deleteModal.staff?.name)
        }
        title="Remove Delivery Staff?"
        message={`Are you sure you want to remove "${deleteModal.staff?.name}" from the active delivery fleet?`}
        confirmText="Remove Staff"
        cancelText="Keep Staff"
        type="danger"
      />
    </div>
  )
}
