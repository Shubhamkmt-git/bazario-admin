import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faFloppyDisk,
  faRotateLeft,
  faArrowRight,
  faArrowLeft,
  faPlus,
  faTrashCan,
  faCheck,
  faMagnifyingGlass,
  faLeaf,
  faTruckFast,
  faShieldHalved,
  faTags,
  faStore,
  faAward,
  faHeart,
  faCheckDouble,
  faHandHoldingHeart,
  faBagShopping,
  faCartShopping,
  faStar,
  faPercent,
  faClock,
  faBoxOpen,
  faTruck,
  faThumbsUp,
  faFaceSmile,
  faUsers,
  faLocationDot,
  faPhone,
  faReceipt,
  faCoins,
  faBasketShopping,
  faCarrot,
  faAppleWhole,
  faEgg,
  faFish,
  faGem,
  faCrown,
  faBolt,
  faFire,
  faGift,
  faHeadset,
  faQrcode,
  faRecycle,
  faBuilding,
  faGlobe,
  faShieldHeart,
  faHandshake,
  faCircleCheck,
  faCreditCard,
  faMoneyBillWave,
  faBullhorn,
  faUtensils,
  faScaleBalanced,
  faSeedling,
  faPepperHot,
  faLemon,
  faWheatAwn,
  faBreadSlice,
  faJar
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  ToggleButton,
  Modal
} from '../../components'
import { useToast } from '../../context/ToastContext'

// Comprehensive catalog of FontAwesome Free Solid icons
const FONTAWESOME_ICONS = [
  { id: 'faLeaf', name: 'Fresh Leaf', icon: faLeaf, category: 'Food & Freshness' },
  { id: 'faCarrot', name: 'Carrot / Veggies', icon: faCarrot, category: 'Food & Freshness' },
  { id: 'faAppleWhole', name: 'Apple / Fruits', icon: faAppleWhole, category: 'Food & Freshness' },
  { id: 'faSeedling', name: 'Plant Seedling', icon: faSeedling, category: 'Food & Freshness' },
  { id: 'faPepperHot', name: 'Pepper / Spices', icon: faPepperHot, category: 'Food & Freshness' },
  { id: 'faLemon', name: 'Lemon / Citrus', icon: faLemon, category: 'Food & Freshness' },
  { id: 'faWheatAwn', name: 'Wheat / Grains', icon: faWheatAwn, category: 'Food & Freshness' },
  { id: 'faBreadSlice', name: 'Bakery / Bread', icon: faBreadSlice, category: 'Food & Freshness' },
  { id: 'faEgg', name: 'Dairy & Eggs', icon: faEgg, category: 'Food & Freshness' },
  { id: 'faFish', name: 'Fish & Seafood', icon: faFish, category: 'Food & Freshness' },
  { id: 'faJar', name: 'Pantry / Jar', icon: faJar, category: 'Food & Freshness' },
  { id: 'faUtensils', name: 'Kitchen & Dining', icon: faUtensils, category: 'Food & Freshness' },

  { id: 'faStore', name: 'Supermarket Store', icon: faStore, category: 'Shopping & Retail' },
  { id: 'faBasketShopping', name: 'Shopping Basket', icon: faBasketShopping, category: 'Shopping & Retail' },
  { id: 'faCartShopping', name: 'Shopping Cart', icon: faCartShopping, category: 'Shopping & Retail' },
  { id: 'faBagShopping', name: 'Shopping Bag', icon: faBagShopping, category: 'Shopping & Retail' },
  { id: 'faTags', name: 'Price Tags', icon: faTags, category: 'Shopping & Retail' },
  { id: 'faPercent', name: 'Discount / Offers', icon: faPercent, category: 'Shopping & Retail' },
  { id: 'faCoins', name: 'Savings & Coins', icon: faCoins, category: 'Shopping & Retail' },
  { id: 'faMoneyBillWave', name: 'Cash / Bill', icon: faMoneyBillWave, category: 'Shopping & Retail' },
  { id: 'faCreditCard', name: 'POS Card Payment', icon: faCreditCard, category: 'Shopping & Retail' },
  { id: 'faReceipt', name: 'Billing Receipt', icon: faReceipt, category: 'Shopping & Retail' },
  { id: 'faGift', name: 'Gift Rewards', icon: faGift, category: 'Shopping & Retail' },
  { id: 'faQrcode', name: 'UPI & QR Code', icon: faQrcode, category: 'Shopping & Retail' },

  { id: 'faTruckFast', name: 'Express Delivery', icon: faTruckFast, category: 'Logistics & Speed' },
  { id: 'faTruck', name: 'Delivery Truck', icon: faTruck, category: 'Logistics & Speed' },
  { id: 'faBoxOpen', name: 'Parcel Package', icon: faBoxOpen, category: 'Logistics & Speed' },
  { id: 'faClock', name: 'Fast Timings', icon: faClock, category: 'Logistics & Speed' },
  { id: 'faBolt', name: 'Lightning Fast', icon: faBolt, category: 'Logistics & Speed' },
  { id: 'faFire', name: 'Hot Trending', icon: faFire, category: 'Logistics & Speed' },

  { id: 'faShieldHalved', name: 'Quality Shield', icon: faShieldHalved, category: 'Trust & Quality' },
  { id: 'faShieldHeart', name: 'Safety & Hygiene', icon: faShieldHeart, category: 'Trust & Quality' },
  { id: 'faAward', name: 'Gold Award', icon: faAward, category: 'Trust & Quality' },
  { id: 'faStar', name: '5-Star Rating', icon: faStar, category: 'Trust & Quality' },
  { id: 'faCrown', name: 'Premium Brand', icon: faCrown, category: 'Trust & Quality' },
  { id: 'faGem', name: 'Top Grade', icon: faGem, category: 'Trust & Quality' },
  { id: 'faCheckDouble', name: 'Quality Verified', icon: faCheckDouble, category: 'Trust & Quality' },
  { id: 'faCircleCheck', name: 'FSSAI Approved', icon: faCircleCheck, category: 'Trust & Quality' },
  { id: 'faScaleBalanced', name: 'Accurate Weighing', icon: faScaleBalanced, category: 'Trust & Quality' },

  { id: 'faHeart', name: 'Customer Love', icon: faHeart, category: 'Care & Community' },
  { id: 'faHandHoldingHeart', name: 'Care & Empathy', icon: faHandHoldingHeart, category: 'Care & Community' },
  { id: 'faHandshake', name: 'Farmer Partnership', icon: faHandshake, category: 'Care & Community' },
  { id: 'faThumbsUp', name: 'Satisfaction', icon: faThumbsUp, category: 'Care & Community' },
  { id: 'faFaceSmile', name: 'Friendly Service', icon: faFaceSmile, category: 'Care & Community' },
  { id: 'faUsers', name: 'Family & Shoppers', icon: faUsers, category: 'Care & Community' },
  { id: 'faHeadset', name: '24x7 Support', icon: faHeadset, category: 'Care & Community' },
  { id: 'faRecycle', name: 'Eco-Friendly', icon: faRecycle, category: 'Care & Community' },
  { id: 'faLocationDot', name: 'Store Branch', icon: faLocationDot, category: 'Care & Community' },
  { id: 'faBuilding', name: 'Warehouse Hub', icon: faBuilding, category: 'Care & Community' },
  { id: 'faGlobe', name: 'Regional Reach', icon: faGlobe, category: 'Care & Community' }
]

const getFontAwesomeIcon = (iconId) => {
  const match = FONTAWESOME_ICONS.find(
    (item) => item.id === iconId || item.id === `fa${iconId?.replace?.(/^fa/, '')}`
  )
  return match ? match.icon : faLeaf
}

const INITIAL_FORM = {
  // 1. Hero Banner
  hero: {
    status: true,
    bannerImage: '/logo.png',
    titleLine1: 'Bill Halka, Dil Halka',
    titleLine2: 'Fresh Grocery & Daily Essentials',
    subtitle: 'Bazario is your trusted neighbourhood supermarket for fresh produce and staples.'
  },

  // 2. States (4)
  states: {
    status: true,
    cards: [
      { prefix: '', suffix: 'K+', label: 'Happy Shoppers', description: 'Trusted by households across city branches' },
      { prefix: '', suffix: 'K+', label: 'Fresh Products', description: 'From farm produce to daily staples' },
      { prefix: '', suffix: ' Stores', label: 'Retail Outlets', description: 'Modern physical retail supermarkets' },
      { prefix: '', suffix: '%', label: 'On-Time Delivery', description: 'Express delivery and friendly service' }
    ]
  },

  // 3. Section One
  section1: {
    status: true,
    label: 'WHO WE ARE',
    title: 'Our Purpose, Mission & Vision',
    mission: {
      label: 'OUR MISSION',
      title: 'Farm-Fresh Groceries for Every Home',
      subtitle: 'To provide high-quality fresh produce and daily essentials at affordable prices.'
    },
    vision: {
      label: 'OUR VISION',
      title: 'India’s Most Loved Supermarket Network',
      subtitle: 'To build a trusted, reliable, and farmer-connected retail grocery chain.'
    }
  },

  // 4. Section 2
  section2: {
    status: true,
    label: 'WHY CHOOSE US',
    title: 'The Bazario Quality Promise',
    cards: [
      { icon: 'faLeaf', label: 'VALUE 1', title: '100% Farm Fresh', subtitle: 'Directly sourced from verified farmers daily', baseline: 'Fresh produce promise' },
      { icon: 'faTags', label: 'VALUE 2', title: 'Honest Pricing', subtitle: 'Lowest prices without middlemen margins', baseline: 'Save up to 20% on bills' },
      { icon: 'faShieldHalved', label: 'VALUE 3', title: 'Quality Assurance', subtitle: 'Strict grading and multi-point freshness inspection', baseline: 'FSSAI compliant handling' },
      { icon: 'faTruckFast', label: 'VALUE 4', title: 'Express Delivery', subtitle: 'Fast doorstep delivery from your nearest outlet', baseline: '20-minute delivery' }
    ]
  },

  // 5. Section 3
  section3: {
    status: true,
    label: 'STORE TOUR',
    title: 'Inside Our Modern Supermarkets',
    description: 'Clean aisles, well-organized display racks, and hygienic temperature-controlled grocery sections.',
    gallery: [
      { id: 1, image: '/logo.png', title: 'Flagship Central Store', subtitle: 'Spacious aisles with 15,000+ products' },
      { id: 2, image: '/logo.png', title: 'Fresh Produce Bins', subtitle: 'Temperature controlled fresh greens section' }
    ]
  },

  // 6. Section 4
  section4: {
    status: true,
    label: 'OUR COMMITMENT',
    title: 'Built on Trust & Hygiene',
    cards: [
      { icon: 'faHeart', label: 'PILLAR 1', title: 'Sanitized Facilities', subtitle: 'Regular sanitization of shopping carts, racks and billing stations', baseline: 'Hygienic touchpoints' },
      { icon: 'faHandHoldingHeart', label: 'PILLAR 2', title: 'Farmer First', subtitle: 'Supporting 500+ local agricultural families with fair wages', baseline: '100% local procurement' },
      { icon: 'faAward', label: 'PILLAR 3', title: 'Instant Replacements', subtitle: 'No-questions-asked item replacement or refund policy', baseline: 'Satisfaction guaranteed' }
    ]
  },

  // 7. About CTA Manage
  cta: {
    status: true,
    label: 'VISIT US TODAY',
    title: 'Ready to Experience Fresh Grocery Shopping?',
    subtitle: 'Walk into your nearest Bazario branch or order through our online app.',
    primaryButtonLabel: 'Find Nearest Store',
    primaryButtonUrl: '/stores',
    secondaryButtonLabel: 'Download App',
    secondaryButtonUrl: '/download'
  }
}

const STEPS = [
  { id: 1, name: 'Hero Banner', short: 'Hero' },
  { id: 2, name: 'States (4)', short: 'States' },
  { id: 3, name: 'Section One', short: 'Sec 1' },
  { id: 4, name: 'Section 2', short: 'Sec 2' },
  { id: 5, name: 'Section 3', short: 'Sec 3' },
  { id: 6, name: 'Section 4', short: 'Sec 4' },
  { id: 7, name: 'About CTA', short: 'CTA' }
]

export default function AboutManageView() {
  const toast = useToast()
  const [activeStep, setActiveStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Icon Picker Modal State
  const [iconModalOpen, setIconModalOpen] = useState(false)
  const [iconSearchQuery, setIconSearchQuery] = useState('')
  const [iconTarget, setIconTarget] = useState(null) // { section: 'section2' | 'section4', index: number }

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_about_form')
      return saved ? JSON.parse(saved) : INITIAL_FORM
    } catch {
      return INITIAL_FORM
    }
  })

  const updateSection = (sectionKey, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: val
      }
    }))
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem('bazario_web_about_form', JSON.stringify(formData))
      setTimeout(() => {
        setSaving(false)
        toast.success('About Form Saved', 'All 7 section configurations updated successfully.')
      }, 300)
    } catch {
      setSaving(false)
      toast.error('Save Failed', 'Could not save form settings.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    localStorage.setItem('bazario_web_about_form', JSON.stringify(INITIAL_FORM))
    toast.info('Form Reset', 'Restored default form values.')
  }

  // Gallery dynamic add/remove
  const addGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      image: '/logo.png',
      title: '',
      subtitle: ''
    }
    updateSection('section3', 'gallery', [...formData.section3.gallery, newItem])
    toast.success('Gallery Item Added', 'New image slot added.')
  }

  const removeGalleryItem = (id) => {
    const updated = formData.section3.gallery.filter((g) => g.id !== id)
    updateSection('section3', 'gallery', updated)
    toast.info('Item Removed', 'Gallery item deleted.')
  }

  const updateGalleryItem = (id, field, val) => {
    const updated = formData.section3.gallery.map((g) =>
      g.id === id ? { ...g, [field]: val } : g
    )
    updateSection('section3', 'gallery', updated)
  }

  // Icon Selection Handlers
  const handleOpenIconPicker = (sectionKey, index) => {
    setIconTarget({ section: sectionKey, index })
    setIconSearchQuery('')
    setIconModalOpen(true)
  }

  const handleSelectIcon = (iconId) => {
    if (!iconTarget) return
    const { section, index } = iconTarget
    const updated = [...formData[section].cards]
    updated[index] = { ...updated[index], icon: iconId }
    updateSection(section, 'cards', updated)
    setIconModalOpen(false)
    toast.success('Icon Updated', `Selected FontAwesome icon.`)
  }

  const filteredIcons = FONTAWESOME_ICONS.filter((item) =>
    item.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(iconSearchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">About Page Manager</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Storefront
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Stepped form to manage hero banner, states, mission/vision, values, gallery, commitments, and CTA.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={handleReset} icon={<FontAwesomeIcon icon={faRotateLeft} className="text-xs" />}>
            Reset
          </Button>
          <Button type="button" variant="primary" size="md" onClick={handleSave} loading={saving} icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}>
            Save All
          </Button>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center overflow-x-auto no-scrollbar gap-1.5">
        {STEPS.map((step) => {
          const isCurrent = activeStep === step.id
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2 ${
                isCurrent
                  ? 'bg-[#064C23] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black ${
                isCurrent ? 'bg-white text-[#064C23]' : 'bg-slate-200 text-slate-700'
              }`}>
                {step.id}
              </span>
              <span>{step.name}</span>
            </button>
          )
        })}
      </div>

      {/* Form Card Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        
        {/* ==========================================================
            STEP 1: HERO BANNER
            ========================================================== */}
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 1 of 7</span>
                <h2 className="text-lg font-black text-slate-900">Hero Banner</h2>
                <p className="text-xs text-slate-500">Configure top hero banner image, title lines, and opening story subtitle.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.hero.status}
                  onChange={(val) => updateSection('hero', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <InputField
                  label="BANNER TITLE LINE 1"
                  placeholder="e.g. Bill Halka, Dil Halka"
                  value={formData.hero.titleLine1}
                  onChange={(e) => updateSection('hero', 'titleLine1', e.target.value)}
                  required
                />

                <InputField
                  label="TITLE LINE 2"
                  placeholder="e.g. Fresh Grocery & Daily Essentials"
                  value={formData.hero.titleLine2}
                  onChange={(e) => updateSection('hero', 'titleLine2', e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SUBTITLE
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter hero subtitle..."
                    value={formData.hero.subtitle}
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  HERO BANNER IMAGE
                </label>
                <ImageUploadFrame
                  label="Hero Banner Image"
                  aspectRatio="video"
                  previewUrl={formData.hero.bannerImage}
                  onImageSelect={(file, url) => updateSection('hero', 'bannerImage', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 2: STATES (4 CARDS)
            ========================================================== */}
        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 2 of 7</span>
                <h2 className="text-lg font-black text-slate-900">States (4 Cards)</h2>
                <p className="text-xs text-slate-500">Configure numerical highlights, prefixes, suffixes, labels, and descriptions.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.states.status}
                  onChange={(val) => updateSection('states', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {formData.states.cards.map((card, idx) => {
                const updateCard = (field, val) => {
                  const updated = [...formData.states.cards]
                  updated[idx] = { ...updated[idx], [field]: val }
                  updateSection('states', 'cards', updated)
                }

                return (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-6 h-6 rounded-lg bg-[#064C23] text-white text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500">Card {idx + 1}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="PREFIX"
                        placeholder="e.g. +"
                        value={card.prefix}
                        onChange={(e) => updateCard('prefix', e.target.value)}
                      />
                      <InputField
                        label="SUFFIX"
                        placeholder="e.g. K+"
                        value={card.suffix}
                        onChange={(e) => updateCard('suffix', e.target.value)}
                      />
                    </div>

                    <InputField
                      label="LABLE"
                      placeholder="e.g. Happy Shoppers"
                      value={card.label}
                      onChange={(e) => updateCard('label', e.target.value)}
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Description summary..."
                        value={card.description}
                        onChange={(e) => updateCard('description', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#064C23]"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 3: SECTION ONE (MISSION & VISSION CARDS)
            ========================================================== */}
        {activeStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 3 of 7</span>
                <h2 className="text-lg font-black text-slate-900">Section One</h2>
                <p className="text-xs text-slate-500">Label, title, mission card, and vision card.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section1.status}
                  onChange={(val) => updateSection('section1', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="LABLE"
                placeholder="e.g. WHO WE ARE"
                value={formData.section1.label}
                onChange={(e) => updateSection('section1', 'label', e.target.value)}
              />
              <InputField
                label="TITLE"
                placeholder="e.g. Our Purpose, Mission & Vision"
                value={formData.section1.title}
                onChange={(e) => updateSection('section1', 'title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Mission Card */}
              <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#064C23] text-white flex items-center justify-center text-xs font-bold">
                    M
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Mission Card</h3>
                </div>

                <InputField
                  label="LABLE"
                  placeholder="e.g. OUR MISSION"
                  value={formData.section1.mission.label}
                  onChange={(e) => {
                    const mission = { ...formData.section1.mission, label: e.target.value }
                    updateSection('section1', 'mission', mission)
                  }}
                />
                <InputField
                  label="TITLE"
                  placeholder="e.g. Farm-Fresh Groceries for Every Home"
                  value={formData.section1.mission.title}
                  onChange={(e) => {
                    const mission = { ...formData.section1.mission, title: e.target.value }
                    updateSection('section1', 'mission', mission)
                  }}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SUUBTITLE
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter mission subtitle..."
                    value={formData.section1.mission.subtitle}
                    onChange={(e) => {
                      const mission = { ...formData.section1.mission, subtitle: e.target.value }
                      updateSection('section1', 'mission', mission)
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#064C23]"
                  />
                </div>
              </div>

              {/* Vission Card */}
              <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-[#A44F37] text-white flex items-center justify-center text-xs font-bold">
                    V
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Vission Card</h3>
                </div>

                <InputField
                  label="LABLE"
                  placeholder="e.g. OUR VISION"
                  value={formData.section1.vision.label}
                  onChange={(e) => {
                    const vision = { ...formData.section1.vision, label: e.target.value }
                    updateSection('section1', 'vision', vision)
                  }}
                />
                <InputField
                  label="TITLE"
                  placeholder="e.g. India's Most Loved Supermarket"
                  value={formData.section1.vision.title}
                  onChange={(e) => {
                    const vision = { ...formData.section1.vision, title: e.target.value }
                    updateSection('section1', 'vision', vision)
                  }}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SUUBTITLE
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter vision subtitle..."
                    value={formData.section1.vision.subtitle}
                    onChange={(e) => {
                      const vision = { ...formData.section1.vision, subtitle: e.target.value }
                      updateSection('section1', 'vision', vision)
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#064C23]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 4: SECTION 2 (4 CARDS: ICON, LABLE, TITLE, SUBTITLE, BASE LINE)
            ========================================================== */}
        {activeStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 4 of 7</span>
                <h2 className="text-lg font-black text-slate-900">Section 2</h2>
                <p className="text-xs text-slate-500">Lable, title, and 4 cards with visual FontAwesome icon selection.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section2.status}
                  onChange={(val) => updateSection('section2', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="LABLE"
                placeholder="e.g. WHY CHOOSE US"
                value={formData.section2.label}
                onChange={(e) => updateSection('section2', 'label', e.target.value)}
              />
              <InputField
                label="TITLE"
                placeholder="e.g. The Bazario Quality Promise"
                value={formData.section2.title}
                onChange={(e) => updateSection('section2', 'title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {formData.section2.cards.map((card, idx) => {
                const updateCard = (field, val) => {
                  const updated = [...formData.section2.cards]
                  updated[idx] = { ...updated[idx], [field]: val }
                  updateSection('section2', 'cards', updated)
                }

                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-[#064C23]">Card #{idx + 1}</span>
                      
                      {/* Visual FontAwesome Icon Picker Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenIconPicker('section2', idx)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-[#f0f9f3] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#064C23]/10 text-[#064C23] group-hover:bg-[#064C23] group-hover:text-white flex items-center justify-center text-xs transition-colors">
                          <FontAwesomeIcon icon={getFontAwesomeIcon(card.icon)} />
                        </div>
                        <span className="text-slate-700 group-hover:text-[#064C23]">Choose Icon ▾</span>
                      </button>
                    </div>

                    <InputField
                      label="LABLE"
                      placeholder="e.g. VALUE 1"
                      value={card.label}
                      onChange={(e) => updateCard('label', e.target.value)}
                    />

                    <InputField
                      label="TITLE"
                      placeholder="e.g. 100% Farm Fresh"
                      value={card.title}
                      onChange={(e) => updateCard('title', e.target.value)}
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        SUBTITLE
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Enter card subtitle..."
                        value={card.subtitle}
                        onChange={(e) => updateCard('subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#064C23]"
                      />
                    </div>

                    <InputField
                      label="BASE LINE"
                      placeholder="e.g. Fresh produce guarantee"
                      value={card.baseline}
                      onChange={(e) => updateCard('baseline', e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 5: SECTION 3 (GALLERY IMAGES MULTIPLE)
            ========================================================== */}
        {activeStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 5 of 7</span>
                <h2 className="text-lg font-black text-slate-900">Section 3</h2>
                <p className="text-xs text-slate-500">Lable, title, description, and dynamic gallery images.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section3.status}
                  onChange={(val) => updateSection('section3', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="LABLE"
                placeholder="e.g. STORE TOUR"
                value={formData.section3.label}
                onChange={(e) => updateSection('section3', 'label', e.target.value)}
              />
              <InputField
                label="TITLE"
                placeholder="e.g. Inside Our Modern Supermarkets"
                value={formData.section3.title}
                onChange={(e) => updateSection('section3', 'title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                DESCRIPTION
              </label>
              <textarea
                rows={3}
                placeholder="Enter description..."
                value={formData.section3.description}
                onChange={(e) => updateSection('section3', 'description', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
              />
            </div>

            {/* Gallery Multi-Items */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  GALLERY IMAGES ({formData.section3.gallery.length})
                </span>
                <Button type="button" variant="outline" size="sm" onClick={addGalleryItem} icon={<FontAwesomeIcon icon={faPlus} />}>
                  Add Gallery Image
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {formData.section3.gallery.map((item, idx) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-black text-[#064C23]">Image #{idx + 1}</span>
                      {formData.section3.gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      )}
                    </div>

                    <ImageUploadFrame
                      label="Gallery Image"
                      aspectRatio="video"
                      previewUrl={item.image}
                      onImageSelect={(file, url) => updateGalleryItem(item.id, 'image', url)}
                    />

                    <InputField
                      label="TITLE"
                      placeholder="Image title"
                      value={item.title}
                      onChange={(e) => updateGalleryItem(item.id, 'title', e.target.value)}
                      required
                    />

                    <InputField
                      label="SUBTITLE"
                      placeholder="Image subtitle"
                      value={item.subtitle}
                      onChange={(e) => updateGalleryItem(item.id, 'subtitle', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 6: SECTION 4 (3 CARDS: ICON, LABLE, TITLE, SUBTITLE, BASELINE)
            ========================================================== */}
        {activeStep === 6 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 6 of 7</span>
                <h2 className="text-lg font-black text-slate-900">Section 4</h2>
                <p className="text-xs text-slate-500">Lable, title, and 3 cards manage (title, subtitle, icon, lable, baseline).</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section4.status}
                  onChange={(val) => updateSection('section4', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="LABLE"
                placeholder="e.g. OUR COMMITMENT"
                value={formData.section4.label}
                onChange={(e) => updateSection('section4', 'label', e.target.value)}
              />
              <InputField
                label="TITLE"
                placeholder="e.g. Built on Trust & Hygiene"
                value={formData.section4.title}
                onChange={(e) => updateSection('section4', 'title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {formData.section4.cards.map((card, idx) => {
                const updateCard = (field, val) => {
                  const updated = [...formData.section4.cards]
                  updated[idx] = { ...updated[idx], [field]: val }
                  updateSection('section4', 'cards', updated)
                }

                return (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-[#064C23]">Card #{idx + 1}</span>
                      
                      {/* Visual FontAwesome Icon Picker Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenIconPicker('section4', idx)}
                        className="flex items-center space-x-2 px-2.5 py-1 bg-white hover:bg-[#f0f9f3] border border-slate-200 hover:border-[#064C23] rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs group"
                      >
                        <div className="w-5 h-5 rounded-md bg-[#064C23]/10 text-[#064C23] group-hover:bg-[#064C23] group-hover:text-white flex items-center justify-center text-xs transition-colors">
                          <FontAwesomeIcon icon={getFontAwesomeIcon(card.icon)} />
                        </div>
                        <span className="text-[11px] text-slate-700 group-hover:text-[#064C23]">Icon ▾</span>
                      </button>
                    </div>

                    <InputField
                      label="LABLE"
                      placeholder="e.g. PILLAR 1"
                      value={card.label}
                      onChange={(e) => updateCard('label', e.target.value)}
                    />

                    <InputField
                      label="TITLE"
                      placeholder="e.g. Sanitized Facilities"
                      value={card.title}
                      onChange={(e) => updateCard('title', e.target.value)}
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        SUBTITLE
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter card subtitle..."
                        value={card.subtitle}
                        onChange={(e) => updateCard('subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#064C23]"
                      />
                    </div>

                    <InputField
                      label="BASELINE"
                      placeholder="e.g. Hygienic touchpoints"
                      value={card.baseline}
                      onChange={(e) => updateCard('baseline', e.target.value)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 7: ABOUT CTA MANAGE
            ========================================================== */}
        {activeStep === 7 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 7 of 7</span>
                <h2 className="text-lg font-black text-slate-900">About CTA Manage</h2>
                <p className="text-xs text-slate-500">Lable, title, subtitle, primary and secondary button links.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.cta.status}
                  onChange={(val) => updateSection('cta', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="LABLE"
                placeholder="e.g. VISIT US TODAY"
                value={formData.cta.label}
                onChange={(e) => updateSection('cta', 'label', e.target.value)}
              />

              <InputField
                label="TITLE"
                placeholder="e.g. Ready to Experience Fresh Grocery Shopping?"
                value={formData.cta.title}
                onChange={(e) => updateSection('cta', 'title', e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  SUBTITLE
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter subtitle..."
                  value={formData.cta.subtitle}
                  onChange={(e) => updateSection('cta', 'subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-[#064C23] uppercase block">Primary Button</span>
                  <InputField
                    label="PRIMAARY BUTTON LABLE"
                    placeholder="e.g. Find Nearest Store"
                    value={formData.cta.primaryButtonLabel}
                    onChange={(e) => updateSection('cta', 'primaryButtonLabel', e.target.value)}
                    required
                  />
                  <InputField
                    label="PRIMAARY BUTTON URL"
                    placeholder="e.g. /stores"
                    value={formData.cta.primaryButtonUrl}
                    onChange={(e) => updateSection('cta', 'primaryButtonUrl', e.target.value)}
                    required
                  />
                </div>

                <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-[#A44F37] uppercase block">Secondary Button</span>
                  <InputField
                    label="SECONDAARY BUTTON LABLE"
                    placeholder="e.g. Download App"
                    value={formData.cta.secondaryButtonLabel}
                    onChange={(e) => updateSection('cta', 'secondaryButtonLabel', e.target.value)}
                  />
                  <InputField
                    label="SECONDAARY BUTTON URL"
                    placeholder="e.g. /download"
                    value={formData.cta.secondaryButtonUrl}
                    onChange={(e) => updateSection('cta', 'secondaryButtonUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Footer Controls */}
        <div className="p-5 sm:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {activeStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setActiveStep((prev) => prev - 1)}
                icon={<FontAwesomeIcon icon={faArrowLeft} className="text-xs" />}
              >
                Previous
              </Button>
            ) : (
              <span className="text-xs font-bold text-slate-400">Step 1 of 7</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleSave}
              loading={saving}
              icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
            >
              Save Form
            </Button>

            {activeStep < 7 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setActiveStep((prev) => prev + 1)}
                icon={<FontAwesomeIcon icon={faArrowRight} className="text-xs ml-1" />}
              >
                Next Step ({STEPS[activeStep]?.name})
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSave}
                loading={saving}
                icon={<FontAwesomeIcon icon={faCheck} className="text-xs mr-1" />}
              >
                Save All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================================
          VISUAL FONTAWESOME ICON PICKER MODAL
          ========================================================== */}
      <Modal
        isOpen={iconModalOpen}
        onClose={() => setIconModalOpen(false)}
        title="Select FontAwesome Icon"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search icons (e.g. food, leaf, truck, star, store, price)..."
              value={iconSearchQuery}
              onChange={(e) => setIconSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10"
              autoFocus
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-3.5 text-slate-400 text-xs"
            />
          </div>

          {/* Visual Icon Grid */}
          <div className="max-h-96 overflow-y-auto pr-1 no-scrollbar">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {filteredIcons.map((item) => {
                const isSelected =
                  iconTarget &&
                  formData[iconTarget.section]?.cards[iconTarget.index]?.icon === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIcon(item.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#064C23] text-white border-[#064C23] shadow-sm'
                        : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200 hover:border-[#064C23] hover:shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-[#064C23] shadow-2xs'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full leading-tight">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-10 text-xs font-semibold text-slate-400">
                No matching FontAwesome icons found for "{iconSearchQuery}".
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
