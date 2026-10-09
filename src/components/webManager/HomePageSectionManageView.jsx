import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTableCellsLarge,
  faPlus,
  faArrowUp,
  faArrowDown,
  faPenToSquare,
  faTrashCan,
  faFloppyDisk,
  faEye,
  faBoxesStacked,
  faTags,
  faAppleWhole,
  faStar,
  faLocationDot,
  faSliders
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  Modal,
  AlertModal
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
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('bazario_web_homepage_sections')
    return saved ? JSON.parse(saved) : INITIAL_SECTIONS
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    itemCount: '',
    layout: 'Product Grid',
    status: 'Active'
  })

  const saveToStorage = (updated) => {
    setSections(updated)
    localStorage.setItem('bazario_web_homepage_sections', JSON.stringify(updated))
  }

  const handleToggleStatus = (section) => {
    const newStatus = section.status === 'Active' ? 'Inactive' : 'Active'
    const updated = sections.map((s) =>
      s.id === section.id ? { ...s, status: newStatus } : s
    )
    saveToStorage(updated)
    toast.info('Section Visibility', `"${section.name}" is now ${newStatus}.`)
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    saveToStorage(updated)
    toast.info('Order Updated', `Moved "${temp.name}" upwards.`)
  }

  const handleMoveDown = (index) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    saveToStorage(updated)
    toast.info('Order Updated', `Moved "${temp.name}" downwards.`)
  }

  const handleOpenAdd = () => {
    setEditingSection(null)
    setFormData({
      name: '',
      subtitle: '',
      itemCount: '8 Products',
      layout: 'Product Grid',
      status: 'Active'
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (section) => {
    setEditingSection(section)
    setFormData({ ...section })
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.name) {
      toast.error('Validation Error', 'Please specify a section name.')
      return
    }

    if (editingSection) {
      const updated = sections.map((s) =>
        s.id === editingSection.id ? { ...s, ...formData } : s
      )
      saveToStorage(updated)
      toast.success('Section Updated', `"${formData.name}" configuration saved.`)
    } else {
      const newSection = {
        id: Date.now(),
        order: sections.length + 1,
        ...formData
      }
      saveToStorage([...sections, newSection])
      toast.success('Section Added', `"${formData.name}" added to homepage.`)
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!sectionToDelete) return
    const updated = sections.filter((s) => s.id !== sectionToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setSectionToDelete(null)
    toast.success('Section Deleted', 'The home page section was deleted.')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Home Page Section Manage</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {sections.filter((s) => s.status === 'Active').length} Active Blocks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Reorder, configure layouts, enable/disable widgets, and customize titles for the website homepage.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add Custom Section
        </Button>
      </div>

      {/* Sections Table & Reorder Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Layout Hierarchy (Top to Bottom of Homepage)
          </span>
          <span className="text-xs font-semibold text-[#064C23]">
            Use arrows to reorder sections instantly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-20 text-center">Order</th>
                <th className="px-6 py-4">Section Name & Subtitle</th>
                <th className="px-6 py-4">Layout Style</th>
                <th className="px-6 py-4">Display Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Move</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sections.map((section, index) => (
                <tr key={section.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="px-6 py-4 text-center">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs inline-flex items-center justify-center border border-slate-200">
                      #{index + 1}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {section.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {section.subtitle}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#064C23]/10 text-[#064C23] border border-[#064C23]/15">
                      {section.layout}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs font-bold text-slate-700">
                    {section.itemCount}
                  </td>

                  <td className="px-6 py-4">
                    <ToggleButton
                      size="sm"
                      checked={section.status === 'Active'}
                      onChange={() => handleToggleStatus(section)}
                      activeColor="#064C23"
                    />
                  </td>

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

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <ActionButton
                        variant="edit"
                        tooltip="Edit Section"
                        onClick={() => handleOpenEdit(section)}
                      />
                      <ActionButton
                        variant="delete"
                        tooltip="Delete Section"
                        onClick={() => {
                          setSectionToDelete(section)
                          setDeleteModalOpen(true)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSection ? 'Edit Home Page Section' : 'Add New Home Page Section'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="SECTION DISPLAY TITLE"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Fresh Fruits & Vegetables"
            required
          />

          <InputField
            label="SUBTITLE / TAGLINE"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. 100% Direct from local farms with morning freshness check"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                LAYOUT STYLE
              </label>
              <select
                value={formData.layout}
                onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#064C23]"
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

            <InputField
              label="ITEMS CAPACITY"
              value={formData.itemCount}
              onChange={(e) => setFormData({ ...formData, itemCount: e.target.value })}
              placeholder="e.g. 12 Products or 4 Outlets"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Enable on Website Home Page</span>
            <ToggleButton
              size="sm"
              checked={formData.status === 'Active'}
              onChange={(val) => setFormData({ ...formData, status: val ? 'Active' : 'Inactive' })}
              activeColor="#064C23"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<FontAwesomeIcon icon={faFloppyDisk} />}>
              {editingSection ? 'Save Changes' : 'Add Section'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Homepage Section?"
        message={`Are you sure you want to delete "${sectionToDelete?.name}"? It will be removed from the homepage layout.`}
        confirmText="Delete Section"
        type="danger"
      />
    </div>
  )
}
