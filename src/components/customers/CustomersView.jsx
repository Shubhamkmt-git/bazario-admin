import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import CustomerListView from './CustomerListView'
import AddCustomerView from './AddCustomerView'
import EditCustomerView from './EditCustomerView'
import CustomerDetailsView from './CustomerDetailsView'
import { getAdminCustomersApi } from '../../utils/adminApi'

const CUSTOMERS_STORAGE_KEY = 'bazario_customers_data'

export default function CustomersView() {
  const toast = useToast()

  // Storage State
  const [customers, setCustomers] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, customer: null })

  const fetchCustomers = async () => {
    try {
      const res = await getAdminCustomersApi()
      const list = res.customers || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((c, idx) => ({
        id: c._id || c.id || idx + 1,
        _id: c._id,
        name: c.name || 'Bazario Customer',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        status: c.status || (c.isBlocked ? 'Restricted' : 'Active'),
        joined: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : 'Recently',
      }))
      setCustomers(formatted)
    } catch (err) {
      console.warn('Failed to fetch customers:', err)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Navigation handlers
  const handleGoToList = () => {
    setViewMode('list')
    setSelectedCustomer(null)
  }

  const handleOpenAdd = () => {
    setSelectedCustomer(null)
    setViewMode('add')
  }

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer)
    setViewMode('edit')
  }

  const handleOpenView = (customer) => {
    setSelectedCustomer(customer)
    setViewMode('view')
  }

  // Save new customer
  const handleSaveNew = (newCustomer) => {
    setCustomers([newCustomer, ...customers])
    toast.success('Customer Registered', `"${newCustomer.name}" has been registered successfully!`)
    setViewMode('list')
  }

  // Save edited customer
  const handleSaveEdited = (updatedCustomer) => {
    const updatedList = customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    setCustomers(updatedList)
    setSelectedCustomer(updatedCustomer)
    toast.success('Customer Updated', `"${updatedCustomer.name}" profile saved successfully!`)
    setViewMode('list')
  }

  // Delete customer
  const handleDelete = (customerId, customerName) => {
    setCustomers((prev) => prev.filter((c) => String(c.id || c._id) !== String(customerId)))
    setDeleteModal({ isOpen: false, customer: null })
    if (selectedCustomer && String(selectedCustomer.id || selectedCustomer._id) === String(customerId)) {
      setViewMode('list')
      setSelectedCustomer(null)
    }
    toast.success('Customer Removed', `"${customerName}" removed from records.`)
  }

  // Toggle status
  const handleToggleStatus = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Restricted' : 'Active'
    const updatedList = customers.map((c) =>
      String(c.id || c._id) === String(customer.id || customer._id) ? { ...c, status: newStatus } : c
    )
    setCustomers(updatedList)
    if (selectedCustomer && String(selectedCustomer.id || selectedCustomer._id) === String(customer.id || customer._id)) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus })
    }
    toast.info('Status Changed', `"${customer.name}" is now ${newStatus}.`)
  }

  return (
    <>
      {/* 1. Add Customer Full-width Page */}
      {viewMode === 'add' && (
        <AddCustomerView
          onBack={handleGoToList}
          onSave={handleSaveNew}
        />
      )}

      {/* 2. Edit Customer Full-width Page */}
      {viewMode === 'edit' && selectedCustomer && (
        <EditCustomerView
          customer={selectedCustomer}
          onBack={handleGoToList}
          onSave={handleSaveEdited}
        />
      )}

      {/* 3. View Customer Details Full-width Page */}
      {viewMode === 'view' && selectedCustomer && (
        <CustomerDetailsView
          customer={selectedCustomer}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
          onDelete={(customer) => setDeleteModal({ isOpen: true, customer })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 0. Default Customers Index List Table */}
      {viewMode === 'list' && (
        <CustomerListView
          customers={customers}
          onAddNew={handleOpenAdd}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={(customer) => setDeleteModal({ isOpen: true, customer })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customer: null })}
        onConfirm={() => handleDelete(deleteModal.customer?.id, deleteModal.customer?.name)}
        type="danger"
        title="Delete Customer Account"
        description={`Are you sure you want to delete customer "${deleteModal.customer?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete Customer"
        cancelText="Cancel"
      />
    </>
  )
}
