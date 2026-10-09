import React, { useState } from 'react'
import {
  Header,
  Sidebar,
  Footer,
  Button,
  BackButton,
  ActionButton,
  ToggleButton,
  InputField,
  ImageUploadFrame,
  FormLayout,
  FormSection,
  FormRow,
  FormActions,
  AlertModal
} from '../components'
import { useToast } from '../context/ToastContext'
import {
  faChartLine,
  faBoxesStacked,
  faCartShopping,
  faUsers,
  faGear,
  faFloppyDisk,
  faXmark,
  faPlus,
  faTriangleExclamation,
  faCircleCheck,
  faShieldHalved,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function DashboardPage({ onLogout }) {
  const toast = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('components')

  // Component Demo States
  const [toggleState1, setToggleState1] = useState(true)
  const [toggleState2, setToggleState2] = useState(false)
  const [toggleState3, setToggleState3] = useState(true)

  // Form States
  const [productName, setProductName] = useState('Organic Premium Green Apples')
  const [productSku, setProductSku] = useState('BZ-APL-001')
  const [productPrice, setProductPrice] = useState('4.99')
  const [productStock, setProductStock] = useState('140')
  const [productImage, setProductImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Modal Demo States
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  const navItems = [
    { id: 'components', name: 'UI Components', icon: faBoxesStacked, badge: 'NEW' },
    { id: 'dashboard', name: 'Dashboard', icon: faChartLine },
    { id: 'orders', name: 'Orders', icon: faCartShopping, badge: '12' },
    { id: 'customers', name: 'Customers', icon: faUsers },
    { id: 'settings', name: 'Settings', icon: faGear },
  ]

  const openModal = (type) => {
    const configs = {
      warning: {
        type: 'warning',
        title: 'Unsaved Changes',
        description: 'You have unsaved product changes. Leaving this page will discard all edits.',
        confirmText: 'Discard & Leave',
        cancelText: 'Keep Editing',
      },
      success: {
        type: 'success',
        title: 'Product Published!',
        description: 'Your item is now live and discoverable in the Bazario inventory system.',
        confirmText: 'View in Store',
        cancelText: 'Close',
      },
      permission: {
        type: 'permission',
        title: 'Grant Admin Permission',
        description: 'Are you sure you want to promote this user to Store Operations Manager?',
        confirmText: 'Authorize Access',
        cancelText: 'Cancel',
      },
      danger: {
        type: 'danger',
        title: 'Delete Product',
        description: 'This action is permanent and cannot be undone. All transaction history for this item will be archived.',
        confirmText: 'Yes, Delete Item',
        cancelText: 'Cancel',
      },
    }
    setModalState({ isOpen: true, ...configs[type] })
  }

  const handleSaveProduct = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Product Saved', 'Product details and inventory updated successfully!')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-roboto text-slate-800 antialiased">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          onLogout={onLogout}
          actions={
            <Button
              size="sm"
              variant="primary"
              icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
              onClick={() => toast.info('Quick Action', 'Create new order initiated.')}
            >
              Add Item
            </Button>
          }
        />

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Top Bar with BackButton & Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <BackButton
                variant="bordered"
                onClick={() => toast.info('Navigation', 'Navigated back')}
              />
              <div>
                <h1 className="text-2xl font-extrabold text-[#064C23] tracking-tight">
                  Reusable UI Component Library
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Production-ready modular components styled with Bazario Brand colors
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Documentation', 'Component docs exported')}
              >
                Docs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toast.success('Live Sync', 'Connected to real-time sync stream')}
              >
                Sync Data
              </Button>
            </div>
          </div>

          {/* SECTION 1: Buttons & Interactive Action Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Buttons & Action Controls</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard buttons, back buttons, toggle switches, and table icon actions
              </p>
            </div>

            {/* Standard Button Variants */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Button Variants
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => toast.success('Primary Button Clicked', 'Triggered primary brand action')}>
                  Primary Button
                </Button>
                <Button variant="secondary" onClick={() => toast.warning('Secondary Button', 'Triggered secondary action')}>
                  Secondary Button
                </Button>
                <Button variant="cancel" onClick={() => toast.info('Cancel', 'Action cancelled')}>
                  Cancel Button
                </Button>
                <Button variant="danger" onClick={() => openModal('danger')}>
                  Delete / Danger
                </Button>
                <Button variant="outline" onClick={() => toast.info('Outline', 'Outline button clicked')}>
                  Outline Button
                </Button>
                <Button variant="ghost" onClick={() => toast.info('Ghost', 'Ghost button clicked')}>
                  Ghost Button
                </Button>
                <Button variant="primary" loading={true}>
                  Saving...
                </Button>
                <Button variant="primary" disabled={true}>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Back Button Variants & Toggle Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Back Buttons */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Back Button Styles
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <BackButton variant="simple" onClick={() => toast.info('Back', 'Simple back clicked')} />
                  <BackButton variant="pill" onClick={() => toast.info('Back', 'Pill back clicked')} />
                  <BackButton variant="bordered" onClick={() => toast.info('Back', 'Bordered back clicked')} />
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Toggle Switch Controls
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  <ToggleButton
                    checked={toggleState1}
                    onChange={setToggleState1}
                    label="Auto Sync"
                    description="Realtime sync enabled"
                    color="primary"
                  />
                  <ToggleButton
                    checked={toggleState2}
                    onChange={setToggleState2}
                    label="Discount Mode"
                    color="secondary"
                  />
                  <ToggleButton
                    checked={toggleState3}
                    onChange={setToggleState3}
                    size="sm"
                    label="Compact"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: View, Edit, Delete, Copy, Download */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Action Button Icons (View, Edit, Delete, Copy, Download, More)
              </h3>
              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 w-fit">
                <ActionButton action="view" onClick={() => toast.info('View Item', 'Opening item preview...')} />
                <ActionButton action="edit" onClick={() => toast.info('Edit Item', 'Loading edit mode...')} />
                <ActionButton action="delete" onClick={() => openModal('danger')} />
                <ActionButton action="copy" onClick={() => toast.success('Copied', 'Item ID copied to clipboard!')} />
                <ActionButton action="download" onClick={() => toast.success('Downloaded', 'Report downloaded')} />
                <ActionButton action="more" onClick={() => toast.info('More Options', 'Options menu opened')} />
              </div>
            </div>
          </div>

          {/* SECTION 2: Form Layouts & Image Upload Frame */}
          <div className="space-y-6">
            <FormLayout onSubmit={handleSaveProduct}>
              <FormSection
                title="Product Information Form"
                subtitle="Complete standard form layout using InputField and ImageUploadFrame components"
              >
                <FormRow cols={2}>
                  <InputField
                    label="Product Name"
                    id="productName"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product title"
                  />
                  <InputField
                    label="SKU Code"
                    id="productSku"
                    required
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    placeholder="e.g. BZ-PROD-001"
                  />
                </FormRow>

                <FormRow cols={2}>
                  <InputField
                    label="Price ($)"
                    id="productPrice"
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.00"
                  />
                  <InputField
                    label="Stock Quantity"
                    id="productStock"
                    type="number"
                    required
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="0"
                  />
                </FormRow>

                {/* Image Upload Frame */}
                <div className="pt-2">
                  <ImageUploadFrame
                    label="Product Cover Image"
                    description="Upload high-res PNG or JPG (up to 5MB)"
                    aspectRatio="square"
                    value={productImage}
                    onChange={(val) => {
                      setProductImage(val)
                      toast.success('Image Updated', 'Cover image updated successfully!')
                    }}
                  />
                </div>

                {/* Form Action Bar */}
                <FormActions align="right">
                  <Button
                    type="button"
                    variant="cancel"
                    onClick={() => toast.info('Cancelled', 'Form edits reset')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                  >
                    Save Changes
                  </Button>
                </FormActions>
              </FormSection>
            </FormLayout>
          </div>

          {/* SECTION 3: Bottom-Right Toasts & Custom Popups */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Toast Notifications & Custom Popups</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Trigger bottom-right toast messages and interactive dialog modals
              </p>
            </div>

            {/* Toast Triggers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bottom-Right Toast Messages
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                  onClick={() => toast.success('Operation Successful', 'The product record was saved to the cloud.')}
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-rose-700 border-rose-300 hover:bg-rose-50"
                  onClick={() => toast.error('Connection Failed', 'Unable to reach the server. Please check your network.')}
                >
                  Trigger Error Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                  onClick={() => toast.warning('Low Inventory Warning', 'Stock level for Item #8812 is below 5 units.')}
                >
                  Trigger Warning Toast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-700 border-blue-300 hover:bg-blue-50"
                  onClick={() => toast.info('System Update', 'Database backup completed in 1.2 seconds.')}
                >
                  Trigger Info Toast
                </Button>
              </div>
            </div>

            {/* Custom Modals */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Custom Modals & Permission Popups
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => openModal('warning')}>
                  Open Warning Popup
                </Button>
                <Button variant="primary" size="sm" onClick={() => openModal('success')}>
                  Open Successful Popup
                </Button>
                <Button variant="outline" size="sm" onClick={() => openModal('permission')}>
                  Open Permission / Alert Popup
                </Button>
                <Button variant="danger" size="sm" onClick={() => openModal('danger')}>
                  Open Delete Confirmation
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Reusable Alert / Modal Dialog */}
      <AlertModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          setModalState((prev) => ({ ...prev, isOpen: false }))
          toast.success('Confirmed', `${modalState.title} action confirmed!`)
        }}
        type={modalState.type}
        title={modalState.title}
        description={modalState.description}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
      />
    </div>
  )
}
