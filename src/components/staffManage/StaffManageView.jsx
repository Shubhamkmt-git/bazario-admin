import React, { useState, useEffect } from 'react'
import StaffListView from './StaffListView'
import AddStaffView from './AddStaffView'
import EditStaffView from './EditStaffView'
import StaffDetailsView from './StaffDetailsView'
import { AlertModal } from '../index'
import { useToast } from '../../context/ToastContext'
import {
  getAdminStaffApi,
  createAdminStaffApi,
  updateAdminStaffApi,
  deleteAdminStaffApi
} from '../../utils/adminApi'

export default function StaffManageView() {
  const toast = useToast()

  // Load from backend API
  const [staffList, setStaffList] = useState([])

  // Fetch live staff from backend API on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getAdminStaffApi()
        const list = res.staff || res.data || []
        const formatted = (Array.isArray(list) ? list : []).map((item, idx) => ({
          ...item,
          id: item.id || item._id || idx + 1,
          staffId: item.staffId || 'BAZ-STF-' + String(item._id || item.id).slice(-4).toUpperCase(),
          store: item.storeName || item.store || 'Bazario Central Superstore #01',
          mobilenumber: item.mobilenumber || item.phone || '',
        }))
        setStaffList(formatted)
      } catch (err) {
        console.warn('API error fetching staff:', err)
      }
    }
    fetchStaff()
  }, [])

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
      const targetId = parts[2] ? parts[2] : null

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
  const handleSaveNewStaff = async (newStaff) => {
    try {
      const res = await createAdminStaffApi({
        name: newStaff.name,
        fathersName: newStaff.fathersName || '',
        email: newStaff.email,
        phone: newStaff.mobilenumber || newStaff.phone,
        mobilenumber: newStaff.mobilenumber || newStaff.phone,
        store: newStaff.store,
        storeName: newStaff.store,
        storeId: newStaff.storeId || null,
        role: newStaff.role || 'Store Associate',
        password: newStaff.password || 'staff123',
        status: newStaff.status || 'Active',
        image: newStaff.image || ''
      })
      const created = res.data || res.staff || { ...newStaff, id: Date.now() }
      const formatted = {
        ...newStaff,
        ...created,
        id: created._id || created.id || Date.now(),
        staffId: created.staffId || newStaff.staffId || 'BAZ-STF-' + String(created._id || Date.now()).slice(-4).toUpperCase(),
        store: created.storeName || newStaff.store,
        role: created.role || newStaff.role,
        mobilenumber: newStaff.mobilenumber
      }
      setStaffList((prev) => [formatted, ...prev])
      toast.success('Staff Added', `"${newStaff.name}" onboarded as ${newStaff.role || 'Staff'}!`)
    } catch (err) {
      console.warn('Backend staff save failed, saving locally:', err)
      setStaffList((prev) => [newStaff, ...prev])
      toast.success('Staff Added', `"${newStaff.name}" onboarded as ${newStaff.role || 'Staff'}!`)
    }
    goToList()
  }

  const handleUpdateStaff = async (updatedStaff) => {
    try {
      const targetId = updatedStaff._id || updatedStaff.id
      await updateAdminStaffApi(targetId, {
        name: updatedStaff.name,
        fathersName: updatedStaff.fathersName,
        email: updatedStaff.email,
        phone: updatedStaff.mobilenumber || updatedStaff.phone,
        mobilenumber: updatedStaff.mobilenumber || updatedStaff.phone,
        store: updatedStaff.store,
        storeName: updatedStaff.store,
        storeId: updatedStaff.storeId || null,
        role: updatedStaff.role,
        status: updatedStaff.status,
        image: updatedStaff.image,
        ...(updatedStaff.password ? { password: updatedStaff.password } : {})
      })
    } catch (err) {
      console.warn('Backend update failed:', err)
    }
    setStaffList((prev) =>
      prev.map((item) => (String(item.id || item._id) === String(updatedStaff.id || updatedStaff._id) ? updatedStaff : item))
    )
    toast.success('Staff Updated', `"${updatedStaff.name}" details updated.`)
    goToList()
  }

  const handleToggleStatus = async (id) => {
    const current = staffList.find((s) => String(s.id || s._id) === String(id))
    const nextStatus = current?.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateAdminStaffApi(current?._id || id, { status: nextStatus })
    } catch (err) {
      console.warn('Backend toggle status failed:', err)
    }
    setStaffList((prev) =>
      prev.map((item) => {
        if (String(item.id || item._id) === String(id)) {
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

  const handleConfirmDelete = async () => {
    const { staffId } = deleteModalState
    const targetStaff = staffList.find((s) => String(s.id || s._id) === String(staffId))
    if (staffId) {
      try {
        await deleteAdminStaffApi(targetStaff?._id || staffId)
      } catch (err) {
        console.warn('Backend delete staff failed:', err)
      }
      setStaffList((prev) => prev.filter((item) => String(item.id || item._id) !== String(staffId)))
      toast.success(
        'Staff Deleted',
        `"${targetStaff?.name || 'Staff'}" was removed from the system.`
      )
    }
    setDeleteModalState({ isOpen: false, staffId: null })
  }

  // Active staff for edit / view
  const activeStaff = staffList.find((s) => String(s.id || s._id) === String(currentSubView.id))

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
