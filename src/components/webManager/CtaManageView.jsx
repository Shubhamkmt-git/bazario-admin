import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBullhorn,
  faPlus,
  faPenToSquare,
  faTrashCan,
  faEye,
  faFloppyDisk,
  faArrowRight,
  faMobileScreenButton,
  faEnvelopeOpenText,
  faPercent,
  faHandshake
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  ImageUploadFrame,
  Modal,
  AlertModal,
  FormLayout,
  FormSection,
  FormRow,
  FormActions
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_CTA_LIST = [
  {
    id: 1,
    title: 'Download the Bazario Mobile App',
    subtitle: 'Get 20-minute grocery deliveries, app-exclusive coupons, and instant order tracking.',
    badge: 'Mobile App Launch',
    buttonText: 'Get on Google Play & App Store',
    buttonLink: 'https://bazario.com/download',
    theme: 'green',
    status: 'Active',
    icon: 'mobile',
    image: '/logo.png'
  },
  {
    id: 2,
    title: 'Subscribe to Weekly Fresh Savings Newsletter',
    subtitle: 'Join over 35,000+ smart shoppers receiving weekly vegetable price cuts and recipe guides.',
    badge: 'Weekly VIP Deals',
    buttonText: 'Subscribe Now for Free',
    buttonLink: '/newsletter',
    theme: 'terracotta',
    status: 'Active',
    icon: 'mail',
    image: '/logo.png'
  },
  {
    id: 3,
    title: 'Partner with Bazario - Open a Franchise Outlet',
    subtitle: 'Become a supermarket franchise partner in your district with guaranteed supply chain and POS support.',
    badge: 'Business Opportunity',
    buttonText: 'Submit Franchise Inquiry',
    buttonLink: '/franchise',
    theme: 'emerald',
    status: 'Active',
    icon: 'handshake',
    image: '/logo.png'
  }
]

export default function CtaManageView() {
  const toast = useToast()
  const [ctaList, setCtaList] = useState(() => {
    const saved = localStorage.getItem('bazario_web_cta_list')
    return saved ? JSON.parse(saved) : INITIAL_CTA_LIST
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCta, setEditingCta] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ctaToDelete, setCtaToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    buttonText: '',
    buttonLink: '',
    theme: 'green',
    status: 'Active',
    image: '/logo.png'
  })

  const saveToStorage = (updated) => {
    setCtaList(updated)
    localStorage.setItem('bazario_web_cta_list', JSON.stringify(updated))
  }

  const handleOpenAdd = () => {
    setEditingCta(null)
    setFormData({
      title: '',
      subtitle: '',
      badge: 'Special Announcement',
      buttonText: 'Learn More',
      buttonLink: '/',
      theme: 'green',
      status: 'Active',
      image: '/logo.png'
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (cta) => {
    setEditingCta(cta)
    setFormData({ ...cta })
    setModalOpen(true)
  }

  const handleToggleStatus = (cta) => {
    const newStatus = cta.status === 'Active' ? 'Inactive' : 'Active'
    const updated = ctaList.map((item) =>
      item.id === cta.id ? { ...item, status: newStatus } : item
    )
    saveToStorage(updated)
    toast.info('CTA Status', `"${cta.title}" is now ${newStatus}.`)
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title || !formData.buttonText) {
      toast.error('Validation Error', 'Please fill in headline title and button label.')
      return
    }

    if (editingCta) {
      const updated = ctaList.map((item) =>
        item.id === editingCta.id ? { ...item, ...formData } : item
      )
      saveToStorage(updated)
      toast.success('CTA Updated', `"${formData.title}" was successfully updated.`)
    } else {
      const newCta = {
        id: Date.now(),
        ...formData
      }
      saveToStorage([...ctaList, newCta])
      toast.success('CTA Created', 'New Call-To-Action banner added to website.')
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!ctaToDelete) return
    const updated = ctaList.filter((c) => c.id !== ctaToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setCtaToDelete(null)
    toast.success('CTA Deleted', 'The CTA banner has been removed.')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faBullhorn} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">CTA Manage</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {ctaList.length} Banners Configured
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage website Call-To-Action blocks, promotional lead magnets, and app download banners.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add New CTA
        </Button>
      </div>

      {/* CTA Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ctaList.map((cta) => {
          const isGreen = cta.theme === 'green'
          const isTerracotta = cta.theme === 'terracotta'
          const isEmerald = cta.theme === 'emerald'

          const bgClass = isGreen
            ? 'from-[#042813] to-[#064C23]'
            : isTerracotta
            ? 'from-[#5e2718] to-[#A44F37]'
            : 'from-[#064e3b] to-[#047857]'

          return (
            <div
              key={cta.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
            >
              {/* Visual Banner Preview */}
              <div
                className={`p-6 bg-gradient-to-br ${bgClass} text-white relative overflow-hidden flex flex-col justify-between min-h-[190px]`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
                    {cta.badge || 'PROMO BANNER'}
                  </span>
                  <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-xs px-2 py-1 rounded-xl">
                    <span className="text-[10px] font-bold">Live:</span>
                    <ToggleButton
                      size="sm"
                      checked={cta.status === 'Active'}
                      onChange={() => handleToggleStatus(cta)}
                      activeColor="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mt-4">
                  <h3 className="font-extrabold text-lg sm:text-xl leading-tight text-white drop-shadow-xs">
                    {cta.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">{cta.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="inline-flex items-center text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-xl shadow-xs">
                    {cta.buttonText}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1.5 text-[10px]" />
                  </span>
                </div>
              </div>

              {/* Controls Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Link: </span>
                  <span className="font-mono text-[11px] truncate inline-block max-w-[140px] align-bottom">
                    {cta.buttonLink}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <ActionButton
                    variant="edit"
                    tooltip="Edit CTA"
                    onClick={() => handleOpenEdit(cta)}
                  />
                  <ActionButton
                    variant="delete"
                    tooltip="Delete CTA"
                    onClick={() => {
                      setCtaToDelete(cta)
                      setDeleteModalOpen(true)
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add / Edit CTA Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCta ? 'Edit Call-To-Action Banner' : 'Create New CTA Banner'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="CTA HEADLINE TITLE"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Download the Bazario Mobile App"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              SUBTITLE DESCRIPTION
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
              placeholder="Explaining the value proposition..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="PILL BADGE TEXT"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Mobile App Launch"
            />
            <InputField
              label="BUTTON LABEL"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              placeholder="e.g. Download Now / Subscribe"
              required
            />
          </div>

          <InputField
            label="TARGET REDIRECT LINK (URL)"
            value={formData.buttonLink}
            onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            placeholder="https://... or /download"
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              COLOR THEME
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'green', name: 'Forest Green', bg: 'bg-[#064C23]' },
                { id: 'terracotta', name: 'Warm Terracotta', bg: 'bg-[#A44F37]' },
                { id: 'emerald', name: 'Clean Emerald', bg: 'bg-[#047857]' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: theme.id })}
                  className={`p-3 rounded-2xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                    formData.theme === theme.id
                      ? 'border-[#064C23] ring-2 ring-[#064C23]/20 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${theme.bg}`} />
                  <span className="text-xs font-bold text-slate-800">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Publish Immediately on Website</span>
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
              {editingCta ? 'Save Changes' : 'Create CTA'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Alert */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete CTA Banner?"
        message={`Are you sure you want to remove the CTA banner "${ctaToDelete?.title}"? This banner will no longer be visible to visitors.`}
        confirmText="Delete CTA"
        type="danger"
      />
    </div>
  )
}
