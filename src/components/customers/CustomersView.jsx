import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import CustomerListView from './CustomerListView'
import AddCustomerView from './AddCustomerView'
import EditCustomerView from './EditCustomerView'
import CustomerDetailsView from './CustomerDetailsView'

const CUSTOMERS_STORAGE_KEY = 'bazario_customers_data'

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98234 11223',
    status: 'Active',
    joined: 'Jan 2025',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    email: 'rahul.v@techmail.com',
    phone: '+91 97123 44556',
    status: 'Active',
    joined: 'Mar 2025',
  },
  {
    id: 3,
    name: 'Ananya Roy',
    email: 'ananya.roy@web.in',
    phone: '+91 98450 67890',
    status: 'Active',
    joined: 'Nov 2024',
  },
  {
    id: 4,
    name: 'Amit Patel',
    email: 'amit.patel@corphub.com',
    phone: '+91 99012 33445',
    status: 'Restricted',
    joined: 'Aug 2025',
  },
  {
    id: 5,
    name: 'Kavita Joshi',
    email: 'kavita.j@mail.com',
    phone: '+91 98765 12340',
    status: 'Active',
    joined: 'Feb 2025',
  },
]

export default function CustomersView() {
  const toast = useToast()

  // Storage State
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMERS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS
    } catch {
      return INITIAL_CUSTOMERS
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, customer: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers))
    } catch (e) {
      console.error('Failed to persist customers', e)
    }
  }, [customers])

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
    setCustomers((prev) => prev.filter((c) => c.id !== customerId))
    setDeleteModal({ isOpen: false, customer: null })
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setViewMode('list')
      setSelectedCustomer(null)
    }
    toast.success('Customer Removed', `"${customerName}" removed from records.`)
  }

  // Toggle status
  const handleToggleStatus = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Restricted' : 'Active'
    const updatedList = customers.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c))
    setCustomers(updatedList)
    if (selectedCustomer && selectedCustomer.id === customer.id) {
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
