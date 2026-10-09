import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableCellsLarge,
  faArrowUp,
  faArrowDown,
  faFloppyDisk,
  faRotateLeft,
  faCircleCheck,
  faLayerGroup,
  faSliders,
  faEye,
  faPenToSquare,
  faTrashCan,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  AlertModal,
  BackButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_SECTIONS = [
  {
    id: 1,
    key: 'hero_slider',
    name: 'Hero Carousel Banner Slider',
    subtitle: 'High-impact full-width seasonal sale promotions',
    itemCount: '4 Slides',
    layout: 'Carousel Banner',
    status: 'Active',
    order: 1
  },
  {
    id: 2,
    key: 'categories_grid',
    name: 'Featured Grocery Categories',
    subtitle: 'Browse Fresh Veggies, Dairy, Snacks, Staples',
    itemCount: '8 Categories',
    layout: 'Circular Grid',
    status: 'Active',
    order: 2
  },
  {
    id: 3,
    key: 'flash_deals',
    name: 'Today’s Hot Deals & Discounts',
    subtitle: 'Limited-time daily price drops and bundle offers',
    itemCount: '12 Products',
    layout: 'Product Grid',
    status: 'Active',
    order: 3
  },
  {
    id: 4,
    key: 'fresh_produce',
    name: 'Farm-Fresh Fruits & Vegetables',
    subtitle: '100% Direct from local farms with morning freshness check',
    itemCount: '16 Products',
    layout: 'Horizontal Scroll',
    status: 'Active',
    order: 4
  },
  {
    id: 5,
    key: 'app_cta',
    name: 'Mobile App Download Banner',
    subtitle: 'Interactive QR Code & app store direct download banner',
    itemCount: '1 Banner Block',
    layout: 'Full-Width CTA',
    status: 'Active',
    order: 5
  },
  {
    id: 6,
    key: 'best_sellers',
    name: 'Pantry Essentials & Best-Sellers',
    subtitle: 'Atta, Rice, Cooking Oils, Ghee, and Daily Staples',
    itemCount: '10 Products',
    layout: 'Product Grid',
    status: 'Active',
    order: 6
  },
  {
    id: 7,
    key: 'store_locator',
    name: 'Find Your Nearest Bazario Store',
    subtitle: 'Interactive map and contact directory for physical outlets',
    itemCount: '4 Outlets',
    layout: 'Interactive Map',
    status: 'Active',
    order: 7
  },
  {
    id: 8,
    key: 'reviews_trust',
    name: 'Customer Reviews & Trust Badges',
    subtitle: 'Verified buyer testimonials, hygienic packaging seals',
    itemCount: '6 Reviews',
    layout: 'Card Grid',
    status: 'Inactive',
    order: 8
  }
]

export default function HomePageSectionManageView() {
  const toast = useToast()

  // State: Sections List from LocalStorage or Defaults
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('bazario_web_homepage_sections')
    return saved ? JSON.parse(saved) : INITIAL_SECTIONS
  })

  // Page Subview Navigation: 'index' | 'edit' | 'view' (No Add subpage)
  const [pageMode, setPageMode] = useState('index')
  const [activeSection, setActiveSection] = useState(null)

  // Delete Alert Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState(null)

  // Edit Form Data
  const [formData, setFormData] = useState({
    id: null,
    key: '',
    name: '',
    subtitle: '',
    itemCount: '',
    layout: 'Product Grid',
    status: 'Active',
    order: 1
  })

  // Sync to LocalStorage
  const saveToStorage = (updated) => {
    setSections(updated)
    localStorage.setItem('bazario_web_homepage_sections', JSON.stringify(updated))
  }

  // Quick Toggle Status in List
  const handleToggleStatus = (section) => {
    const newStatus = section.status === 'Active' ? 'Inactive' : 'Active'
    const updated = sections.map((s) =>
      s.id === section.id ? { ...s, status: newStatus } : s
    )
    saveToStorage(updated)
    if (activeSection?.id === section.id) {
      setActiveSection({ ...activeSection, status: newStatus })
    }
    toast.info('Section Visibility', `"${section.name}" is now ${newStatus}.`)
  }

  // Move Section Up
  const handleMoveUp = (index) => {
    if (index === 0) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    saveToStorage(updated)
    toast.info('Order Updated', `Moved "${temp.name}" upwards.`)
  }

  // Move Section Down
  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    saveToStorage(updated)
    toast.info('Order Updated', `Moved "${temp.name}" downwards.`)
  }

  // Open Edit Subview
  const handleOpenEdit = (section) => {
    setActiveSection(section)
    setFormData({
      id: section.id,
      key: section.key || '',
      name: section.name || '',
      subtitle: section.subtitle || '',
      itemCount: section.itemCount || '',
      layout: section.layout || 'Product Grid',
      status: section.status || 'Active',
      order: section.order || 1
    })
    setPageMode('edit')
  }

  // Open View Subview
  const handleOpenView = (section) => {
    setActiveSection(section)
    setPageMode('view')
  }

  // Save Edit Form
  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Please enter a section display title.')
      return
    }

    const updated = sections.map((s) =>
      s.id === formData.id ? { ...s, ...formData } : s
    )
    saveToStorage(updated)
    setActiveSection({ ...formData })
    toast.success('Section Updated', `"${formData.name}" configuration saved successfully.`)
    setPageMode('index')
  }

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (!sectionToDelete) return
    const updated = sections.filter((s) => s.id !== sectionToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setSectionToDelete(null)
    if (activeSection?.id === sectionToDelete.id) {
      setActiveSection(null)
      setPageMode('index')
    }
    toast.success('Section Deleted', 'The home page section has been removed.')
  }

  return (
    <div className="space-y-6">
      {/* ==========================================================
          PAGE 1: INDEX LIST PAGE
          ========================================================== */}
      {pageMode === 'index' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faTableCellsLarge} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Home Page Section Heading Manage
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {sections.filter((s) => s.status === 'Active').length} / {sections.length} Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Reorder, configure titles, subtitles, layout styles, and display item limits for homepage blocks.
                </p>
              </div>
            </div>
          </div>

          {/* Sections Table & Reorder Interface */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Homepage Layout Sequence (Top to Bottom)
              </span>
              <span className="text-xs font-semibold text-[#064C23]">
                Use move arrows to reorder sections
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-20 text-center">Order</th>
                    <th className="px-6 py-4">Section Display Title & Subtitle</th>
                    <th className="px-6 py-4">Layout Style</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Sequence</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sections.length > 0 ? (
                    sections.map((section, index) => (
                      <tr key={section.id} className="hover:bg-slate-50/75 transition-colors">
                        {/* Order */}
                        <td className="px-6 py-4 text-center">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-200">
                            #{index + 1}
                          </span>
                        </td>

                        {/* Title & Subtitle */}
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <span className="font-bold text-slate-900 block text-sm">
                              {section.name}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1">
                              {section.subtitle || 'No subtitle configured'}
                            </span>
                          </div>
                        </td>

                        {/* Layout Style Badge */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/15 whitespace-nowrap">
                            {section.layout}
                          </span>
                        </td>

                        {/* Capacity */}
                        <td className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                          {section.itemCount || '—'}
                        </td>

                        {/* Status Toggle */}
                        <td className="px-6 py-4">
                          <ToggleButton
                            size="sm"
                            checked={section.status === 'Active'}
                            onChange={() => handleToggleStatus(section)}
                            activeColor="#064C23"
                          />
                        </td>

                        {/* Sequence Move Arrows */}
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center space-x-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveUp(index)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                                index === 0
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'bg-slate-100 hover:bg-[#064C23] hover:text-white text-slate-700'
                              }`}
                              title="Move Up"
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                            <button
                              type="button"
                              disabled={index === sections.length - 1}
                              onClick={() => handleMoveDown(index)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                                index === sections.length - 1
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'bg-slate-100 hover:bg-[#064C23] hover:text-white text-slate-700'
                              }`}
                              title="Move Down"
                            >
                              <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <ActionButton
                              action="view"
                              tooltip="View Section Details"
                              onClick={() => handleOpenView(section)}
                            />
                            <ActionButton
                              action="edit"
                              tooltip="Edit Heading & Settings"
                              onClick={() => handleOpenEdit(section)}
                            />
                            <ActionButton
                              action="delete"
                              tooltip="Delete Section"
                              onClick={() => {
                                setSectionToDelete(section)
                                setDeleteModalOpen(true)
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No homepage sections found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          PAGE 2: EDIT SECTION HEADING SUBPAGE
          ========================================================== */}
      {pageMode === 'edit' && activeSection && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Edit Section Heading & Configuration
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Update display title, subtitle, layout style, item capacity, and visibility status.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Edit Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Section Content & Layout Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Internal Key: <span className="font-mono font-bold text-[#064C23]">#{formData.key || 'custom_section'}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Visibility:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.status === 'Active'}
                  onChange={(val) => setFormData({ ...formData, status: val ? 'Active' : 'Inactive' })}
                  activeColor="#064C23"
                />
              </div>
            </div>

            {/* Row 1: Section Title */}
            <div className="space-y-1.5">
              <InputField
                label="SECTION DISPLAY TITLE"
                placeholder="e.g. Today’s Hot Deals & Discounts"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                helperText="Primary heading text rendered above this block on the website homepage"
                required
              />
            </div>

            {/* Row 2: Subtitle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                SUBTITLE
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Limited-time daily price drops and bundle offers..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
              />
            </div>

            {/* Row 3: Layout Style & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  LAYOUT STYLE
                </label>
                <select
                  value={formData.layout}
                  onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  <option value="Product Grid">Product Grid (4 Columns)</option>
                  <option value="Horizontal Scroll">Horizontal Scroll Carousel</option>
                  <option value="Circular Grid">Circular Category Grid</option>
                  <option value="Carousel Banner">Carousel Banner Slider</option>
                  <option value="Full-Width CTA">Full-Width Promotional CTA</option>
                  <option value="Interactive Map">Interactive Store Map</option>
                  <option value="Card Grid">Card Testimonials Grid</option>
                </select>
              </div>

              <div>
                <InputField
                  label="ITEMS CAPACITY"
                  placeholder="e.g. 12 Products or 4 Outlets"
                  value={formData.itemCount}
                  onChange={(e) => setFormData({ ...formData, itemCount: e.target.value })}
                  helperText="Display limit count or items specification"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================
          PAGE 3: VIEW SECTION DETAILS SUBPAGE
          ========================================================== */}
      {pageMode === 'view' && activeSection && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Section Heading Details
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeSection.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {activeSection.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Detailed breakdown of this homepage block heading and configuration parameters.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => handleOpenEdit(activeSection)}
                icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
              >
                Edit Section
              </Button>
            </div>
          </div>

          {/* Details Grid Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Layout Style</span>
                <p className="text-sm font-bold text-slate-900">{activeSection.layout}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Items Capacity</span>
                <p className="text-sm font-bold text-slate-900">{activeSection.itemCount || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Section Key</span>
                <p className="text-sm font-mono font-bold text-[#064C23]">#{activeSection.key || 'custom_section'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Current Status</span>
                <p className="text-sm font-bold text-slate-900">{activeSection.status}</p>
              </div>
            </div>

            {/* Display Title & Subtitle */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Configured Display Title
                </span>
                <p className="text-base font-bold text-slate-900">
                  {activeSection.name}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Configured Subtitle / Tagline
                </span>
                <p className="text-sm font-medium text-slate-700">
                  {activeSection.subtitle || 'No subtitle configured.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Homepage Section?"
        message={`Are you sure you want to delete "${sectionToDelete?.name}"? It will be removed from the homepage layout sequence.`}
        confirmText="Delete Section"
        type="danger"
      />
    </div>
  )
}
