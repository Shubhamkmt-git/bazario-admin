import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faFloppyDisk,
  faRotateLeft,
  faEye,
  faArrowRight,
  faArrowLeft,
  faPlus,
  faTrashCan,
  faImage,
  faCheck,
  faBullseye,
  faLightbulb,
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
  faClock,
  faPhone,
  faArrowsUpDown
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  InputField,
  ImageUploadFrame,
  ToggleButton,
  Modal,
  AlertModal
} from '../../components'
import { useToast } from '../../context/ToastContext'

const ICON_OPTIONS = [
  { id: 'leaf', name: 'Fresh Leaf', icon: faLeaf },
  { id: 'truck', name: 'Fast Delivery', icon: faTruckFast },
  { id: 'shield', name: 'Quality Shield', icon: faShieldHalved },
  { id: 'tags', name: 'Best Price', icon: faTags },
  { id: 'store', name: 'Superstore', icon: faStore },
  { id: 'award', name: 'Award / Trust', icon: faAward },
  { id: 'heart', name: 'Care / Organic', icon: faHeart },
  { id: 'check', name: 'Verified', icon: faCheckDouble },
  { id: 'care', name: 'Community', icon: faHandHoldingHeart },
  { id: 'bag', name: 'Shopping Bag', icon: faBagShopping }
]

const getIconByName = (name) => {
  const found = ICON_OPTIONS.find((i) => i.id === name)
  return found ? found.icon : faLeaf
}

const INITIAL_ABOUT_FORM = {
  // Step 1: Hero Banner
  hero: {
    isActive: true,
    bannerImage: '/logo.png',
    titleLine1: 'Bill Halka, Dil Halka',
    titleLine2: 'Fresh Grocery & Daily Essentials For Every Home',
    subtitle:
      'Bazario is your trusted neighbourhood supermarket offering farm-fresh produce, authentic staples, and honest pricing with smile-first service.'
  },

  // Step 2: Stats (4 Cards)
  stats: {
    isActive: true,
    items: [
      {
        prefix: '',
        value: '50',
        suffix: 'K+',
        label: 'Happy Shoppers',
        description: 'Trusted by households across Delhi NCR daily'
      },
      {
        prefix: '',
        value: '15',
        suffix: 'K+',
        label: 'Quality Products',
        description: 'From organic greens to pantry staples'
      },
      {
        prefix: '',
        value: '4',
        suffix: ' Branches',
        label: 'Retail Outlets',
        description: 'Modern, air-conditioned physical superstores'
      },
      {
        prefix: '',
        value: '99.8',
        suffix: '%',
        label: 'On-Time Express',
        description: 'Fast fulfillment and friendly home delivery'
      }
    ]
  },

  // Step 3: Section 1 (Mission & Vision)
  section1: {
    isActive: true,
    label: 'WHO WE ARE',
    title: 'Our Purpose, Core Mission & Long-Term Vision',
    mission: {
      label: 'OUR MISSION',
      title: 'Farm-Fresh Groceries for Every Indian Household',
      subtitle:
        'To make fresh produce, daily dairy, and essential staples accessible, hygienic, and affordable without compromising on farmer dignity or customer trust.',
      image: '/logo.png'
    },
    vision: {
      label: 'OUR VISION',
      title: 'Building India’s Most Loved Supermarket Network',
      subtitle:
        'To become the gold standard of omnichannel grocery shopping with sustainable local sourcing, zero-waste supply chains, and seamless customer joy.',
      image: '/logo.png'
    }
  },

  // Step 4: Section 2 (4 Feature / Value Cards)
  section2: {
    isActive: true,
    label: 'OUR CORE VALUES',
    title: 'The Four Pillars That Define The Bazario Promise',
    cards: [
      {
        icon: 'leaf',
        label: 'FRESHNESS FIRST',
        title: '100% Farm-Fresh Daily',
        subtitle: 'Harvested at dawn and delivered to branch shelves within hours of picking.',
        baseline: 'Direct farm-to-shelf traceability'
      },
      {
        icon: 'tags',
        label: 'HONEST PRICING',
        title: 'Guaranteed Everyday Savings',
        subtitle: 'Zero middlemen margins mean higher savings for your monthly grocery budget.',
        baseline: 'Wholesale rates on daily staples'
      },
      {
        icon: 'shield',
        label: 'QUALITY ASSURANCE',
        title: 'Strict Multi-Point Quality Checks',
        subtitle: 'Every batch undergoes rigorous freshness and hygienic grading before shelf placement.',
        baseline: 'FSSAI compliant handling'
      },
      {
        icon: 'truck',
        label: 'SPEED & CONVENIENCE',
        title: '20-Minute Neighborhood Delivery',
        subtitle: 'Enjoy instant doorstep delivery or quick curbside pick-up at your local outlet.',
        baseline: 'Free delivery on orders over ₹499'
      }
    ]
  },

  // Step 5: Section 3 (Gallery Images Multi-Item)
  section3: {
    isActive: true,
    label: 'OUR STORES & AISLES',
    title: 'Experience The Joy of Supermarket Shopping',
    description:
      'Spacious aisles, sparkling clean display counters, organized category zones, and friendly assistance make every shopping trip seamless.',
    gallery: [
      {
        id: 1,
        image: '/logo.png',
        title: 'Central Superstore Flagship Branch',
        subtitle: '15,000+ sq.ft of organized aisles and live bakery'
      },
      {
        id: 2,
        image: '/logo.png',
        title: 'Farm-Fresh Produce Section',
        subtitle: 'Temperature-controlled misting bins for leafy greens'
      },
      {
        id: 3,
        image: '/logo.png',
        title: 'Express POS Checkout Counters',
        subtitle: 'Zero queue barcode billing with all UPI and card options'
      }
    ]
  },

  // Step 6: Section 4 (3 Cards Manage)
  section4: {
    isActive: true,
    label: 'CUSTOMER COMMITMENT',
    title: 'Built on Trust, Hygiene & Unmatched Convenience',
    cards: [
      {
        icon: 'heart',
        label: 'HYGIENE GUARANTEE',
        title: 'Sanitized & Clean Touchpoints',
        subtitle: 'Every shelf, shopping trolley, and billing station is sanitized regularly throughout the day.',
        baseline: 'Certified clean retail environment'
      },
      {
        icon: 'care',
        label: 'COMMUNITY IMPACT',
        title: 'Supporting 500+ Local Farmers',
        subtitle: 'Direct fair-trade procurement directly supports local agricultural families in our region.',
        baseline: '100% locally sourced produce'
      },
      {
        icon: 'award',
        label: 'HASSLE-FREE RETURNS',
        title: 'No-Questions-Asked Replacements',
        subtitle: 'Not satisfied with freshness? Instant replacement or full wallet refund guaranteed on the spot.',
        baseline: '100% customer satisfaction promise'
      }
    ]
  },

  // Step 7: About CTA Manage
  cta: {
    isActive: true,
    label: 'START SAVING TODAY',
    title: 'Step Into Your Nearest Bazario Supermarket',
    subtitle:
      'Discover huge weekly discounts on fresh vegetables, dairy, and household essentials. Visit our stores or order online!',
    primaryButtonLabel: 'Find Nearest Outlet',
    primaryButtonUrl: '/stores',
    secondaryButtonLabel: 'Download Mobile App',
    secondaryButtonUrl: '/download',
    ctaBgImage: '/logo.png'
  }
}

const STEPS = [
  { id: 1, name: 'Hero Banner', tag: 'Banner & Headlines' },
  { id: 2, name: 'Stats (4)', tag: 'Counters & Milestones' },
  { id: 3, name: 'Section 1', tag: 'Mission & Vision' },
  { id: 4, name: 'Section 2', tag: '4 Value Cards' },
  { id: 5, name: 'Section 3', tag: 'Gallery (Multiple)' },
  { id: 6, name: 'Section 4', tag: '3 Commitments' },
  { id: 7, name: 'About CTA', tag: 'Call-To-Action Block' }
]

export default function AboutManageView() {
  const toast = useToast()
  const [activeStep, setActiveStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_about_form')
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_FORM
    } catch {
      return INITIAL_ABOUT_FORM
    }
  })

  // Deep update helper
  const handleUpdate = (sectionKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value
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
        toast.success('About Page Saved', 'All 7 about sections and layouts saved successfully.')
      }, 400)
    } catch (err) {
      setSaving(false)
      toast.error('Save Failed', 'Could not save About Page content.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_ABOUT_FORM)
    localStorage.setItem('bazario_web_about_form', JSON.stringify(INITIAL_ABOUT_FORM))
    toast.info('Restored Defaults', 'About Us form data reset to factory template.')
  }

  // Gallery dynamic functions
  const handleAddGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      image: '/logo.png',
      title: 'New Store Section',
      subtitle: 'Description of this section or aisle display'
    }
    const updated = [...formData.section3.gallery, newItem]
    handleUpdate('section3', 'gallery', updated)
    toast.success('Gallery Item Added', 'New image slot ready for configuration.')
  }

  const handleRemoveGalleryItem = (id) => {
    const updated = formData.section3.gallery.filter((g) => g.id !== id)
    handleUpdate('section3', 'gallery', updated)
    toast.info('Item Removed', 'Gallery item deleted.')
  }

  const handleUpdateGalleryItem = (id, field, val) => {
    const updated = formData.section3.gallery.map((g) =>
      g.id === id ? { ...g, [field]: val } : g
    )
    handleUpdate('section3', 'gallery', updated)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">About Page Manager</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                7 Sections Form
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Stepped hierarchical form to manage hero banners, stats, mission/vision, cards, galleries, and CTA blocks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={handleReset}
            icon={<FontAwesomeIcon icon={faRotateLeft} />}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          >
            Save About Page
          </Button>
        </div>
      </div>

      {/* STEPPER NAVIGATION TABS */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {STEPS.map((step) => {
            const isCurrent = activeStep === step.id
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isCurrent
                    ? 'bg-[#064C23] text-white shadow-md shadow-[#064C23]/20 ring-2 ring-[#064C23]/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                      isCurrent
                        ? 'bg-white text-[#064C23]'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {step.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    Step {step.id}
                  </span>
                </div>
                <div>
                  <p
                    className={`text-xs font-black truncate ${
                      isCurrent ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-[10px] truncate ${
                      isCurrent ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {step.tag}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* ==========================================================
            STEP 1: HERO BANNER
            ========================================================== */}
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Step Header with Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 1 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Hero Banner & Primary Headline
                </h2>
                <p className="text-xs text-slate-500">
                  Configure top hero banner image, title lines, and opening story subtitle.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.hero.isActive}
                  onChange={(val) => {
                    handleUpdate('hero', 'isActive', val)
                    toast.info('Hero Status', `Hero section is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Titles */}
              <div className="lg:col-span-2 space-y-4">
                <InputField
                  label="BANNER TITLE LINE 1"
                  value={formData.hero.titleLine1}
                  onChange={(e) => handleUpdate('hero', 'titleLine1', e.target.value)}
                  placeholder="e.g. Bill Halka, Dil Halka"
                  helperText="First prominent line of the main hero header"
                  required
                />

                <InputField
                  label="BANNER TITLE LINE 2"
                  value={formData.hero.titleLine2}
                  onChange={(e) => handleUpdate('hero', 'titleLine2', e.target.value)}
                  placeholder="e.g. Fresh Grocery & Daily Essentials"
                  helperText="Second accent line displayed directly beneath Line 1"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    HERO SUBTITLE / PARAGRAPH STORY
                  </label>
                  <textarea
                    rows={4}
                    value={formData.hero.subtitle}
                    onChange={(e) => handleUpdate('hero', 'subtitle', e.target.value)}
                    placeholder="Provide an overview of Bazario's supermarket promise..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Right 1 Col: Hero Banner Image Upload in Frame */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  HERO BANNER IMAGE (FRAME UPLOAD)
                </label>
                <ImageUploadFrame
                  label="Hero Banner Image"
                  aspectRatio="video"
                  previewUrl={formData.hero.bannerImage}
                  onImageSelect={(file, url) => handleUpdate('hero', 'bannerImage', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 2: STATS (4 CARDS)
            ========================================================== */}
        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 2 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Milestones & Statistics (4 Cards)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage numerical counters, prefixes, suffixes, labels, and descriptions.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.stats.isActive}
                  onChange={(val) => {
                    handleUpdate('stats', 'isActive', val)
                    toast.info('Stats Status', `Stats section is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {formData.stats.items.map((stat, idx) => {
                const handleStatChange = (field, val) => {
                  const updated = [...formData.stats.items]
                  updated[idx] = { ...updated[idx], [field]: val }
                  handleUpdate('stats', 'items', updated)
                }

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-6 h-6 rounded-lg bg-[#064C23] text-white text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-500">Stat Card {idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <InputField
                        label="PREFIX"
                        placeholder="e.g. +"
                        value={stat.prefix}
                        onChange={(e) => handleStatChange('prefix', e.target.value)}
                      />
                      <InputField
                        label="VALUE"
                        placeholder="50"
                        value={stat.value}
                        onChange={(e) => handleStatChange('value', e.target.value)}
                        required
                      />
                      <InputField
                        label="SUFFIX"
                        placeholder="K+"
                        value={stat.suffix}
                        onChange={(e) => handleStatChange('suffix', e.target.value)}
                      />
                    </div>

                    <InputField
                      label="STAT LABEL"
                      placeholder="e.g. Happy Shoppers"
                      value={stat.label}
                      onChange={(e) => handleStatChange('label', e.target.value)}
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={2}
                        value={stat.description}
                        onChange={(e) => handleStatChange('description', e.target.value)}
                        placeholder="Short summary..."
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
            STEP 3: SECTION 1 (MISSION & VISION)
            ========================================================== */}
        {activeStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 3 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Section 1: Mission & Vision Cards
                </h2>
                <p className="text-xs text-slate-500">
                  Manage section header label, main title, and dual Mission / Vision cards.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section1.isActive}
                  onChange={(val) => {
                    handleUpdate('section1', 'isActive', val)
                    toast.info('Section 1 Status', `Section 1 is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION 1 LABEL"
                value={formData.section1.label}
                onChange={(e) => handleUpdate('section1', 'label', e.target.value)}
                placeholder="e.g. WHO WE ARE"
              />
              <InputField
                label="SECTION 1 MAIN TITLE"
                value={formData.section1.title}
                onChange={(e) => handleUpdate('section1', 'title', e.target.value)}
                placeholder="e.g. Our Purpose, Core Mission & Long-Term Vision"
                required
              />
            </div>

            {/* Mission Card & Vision Card Dual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Mission Card */}
              <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-[#064C23] text-white flex items-center justify-center text-sm">
                    <FontAwesomeIcon icon={faBullseye} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Mission Card</h3>
                </div>

                <InputField
                  label="MISSION CARD LABEL"
                  value={formData.section1.mission.label}
                  onChange={(e) => {
                    const updated = { ...formData.section1.mission, label: e.target.value }
                    handleUpdate('section1', 'mission', updated)
                  }}
                  placeholder="e.g. OUR MISSION"
                />

                <InputField
                  label="MISSION TITLE"
                  value={formData.section1.mission.title}
                  onChange={(e) => {
                    const updated = { ...formData.section1.mission, title: e.target.value }
                    handleUpdate('section1', 'mission', updated)
                  }}
                  placeholder="e.g. Farm-Fresh Groceries for Every Home"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    MISSION SUBTITLE / DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={formData.section1.mission.subtitle}
                    onChange={(e) => {
                      const updated = { ...formData.section1.mission, subtitle: e.target.value }
                      handleUpdate('section1', 'mission', updated)
                    }}
                    placeholder="Describe mission commitment..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#064C23]"
                  />
                </div>

                <ImageUploadFrame
                  label="Mission Card Image"
                  aspectRatio="video"
                  previewUrl={formData.section1.mission.image}
                  onImageSelect={(file, url) => {
                    const updated = { ...formData.section1.mission, image: url }
                    handleUpdate('section1', 'mission', updated)
                  }}
                />
              </div>

              {/* Vision Card */}
              <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-[#A44F37] text-white flex items-center justify-center text-sm">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Vision Card</h3>
                </div>

                <InputField
                  label="VISION CARD LABEL"
                  value={formData.section1.vision.label}
                  onChange={(e) => {
                    const updated = { ...formData.section1.vision, label: e.target.value }
                    handleUpdate('section1', 'vision', updated)
                  }}
                  placeholder="e.g. OUR VISION"
                />

                <InputField
                  label="VISION TITLE"
                  value={formData.section1.vision.title}
                  onChange={(e) => {
                    const updated = { ...formData.section1.vision, title: e.target.value }
                    handleUpdate('section1', 'vision', updated)
                  }}
                  placeholder="e.g. Building India's Most Loved Supermarket"
                  required
                />

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    VISION SUBTITLE / DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={formData.section1.vision.subtitle}
                    onChange={(e) => {
                      const updated = { ...formData.section1.vision, subtitle: e.target.value }
                      handleUpdate('section1', 'vision', updated)
                    }}
                    placeholder="Describe long-term vision..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-[#064C23]"
                  />
                </div>

                <ImageUploadFrame
                  label="Vision Card Image"
                  aspectRatio="video"
                  previewUrl={formData.section1.vision.image}
                  onImageSelect={(file, url) => {
                    const updated = { ...formData.section1.vision, image: url }
                    handleUpdate('section1', 'vision', updated)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 4: SECTION 2 (4 CARDS: ICON, LABEL, TITLE, SUBTITLE, BASELINE)
            ========================================================== */}
        {activeStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 4 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Section 2: Core Value Cards (4 Cards)
                </h2>
                <p className="text-xs text-slate-500">
                  Configure section label, title, and 4 feature cards with icon selector, label, title, subtitle, and baseline.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section2.isActive}
                  onChange={(val) => {
                    handleUpdate('section2', 'isActive', val)
                    toast.info('Section 2 Status', `Section 2 is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            {/* Section Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION 2 LABEL"
                value={formData.section2.label}
                onChange={(e) => handleUpdate('section2', 'label', e.target.value)}
                placeholder="e.g. OUR CORE VALUES"
              />
              <InputField
                label="SECTION 2 TITLE"
                value={formData.section2.title}
                onChange={(e) => handleUpdate('section2', 'title', e.target.value)}
                placeholder="e.g. The Four Pillars That Define The Bazario Promise"
                required
              />
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.section2.cards.map((card, idx) => {
                const handleCardChange = (field, val) => {
                  const updated = [...formData.section2.cards]
                  updated[idx] = { ...updated[idx], [field]: val }
                  handleUpdate('section2', 'cards', updated)
                }

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#064C23] text-white flex items-center justify-center text-sm">
                          <FontAwesomeIcon icon={getIconByName(card.icon)} />
                        </div>
                        <span className="text-sm font-black text-slate-900">Value Card #{idx + 1}</span>
                      </div>

                      {/* Icon Selector */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Icon:</span>
                        <select
                          value={card.icon}
                          onChange={(e) => handleCardChange('icon', e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <InputField
                      label="CARD LABEL"
                      value={card.label}
                      onChange={(e) => handleCardChange('label', e.target.value)}
                      placeholder="e.g. FRESHNESS FIRST"
                    />

                    <InputField
                      label="CARD TITLE"
                      value={card.title}
                      onChange={(e) => handleCardChange('title', e.target.value)}
                      placeholder="e.g. 100% Farm-Fresh Daily"
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        CARD SUBTITLE
                      </label>
                      <textarea
                        rows={2}
                        value={card.subtitle}
                        onChange={(e) => handleCardChange('subtitle', e.target.value)}
                        placeholder="Detailed explanation..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#064C23]"
                      />
                    </div>

                    <InputField
                      label="CARD BASELINE (KEY HIGHLIGHT)"
                      value={card.baseline}
                      onChange={(e) => handleCardChange('baseline', e.target.value)}
                      placeholder="e.g. Direct farm-to-shelf traceability"
                      helperText="Small bottom badge tag / baseline promise"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 5: SECTION 3 (GALLERY IMAGES MULTIPLE DYNAMIC)
            ========================================================== */}
        {activeStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 5 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Section 3: Gallery & Store Tour (Multiple Images)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage section label, title, description, and multiple gallery images with title & subtitle.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section3.isActive}
                  onChange={(val) => {
                    handleUpdate('section3', 'isActive', val)
                    toast.info('Section 3 Status', `Section 3 is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            {/* Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION 3 LABEL"
                value={formData.section3.label}
                onChange={(e) => handleUpdate('section3', 'label', e.target.value)}
                placeholder="e.g. OUR STORES & AISLES"
              />
              <InputField
                label="SECTION 3 TITLE"
                value={formData.section3.title}
                onChange={(e) => handleUpdate('section3', 'title', e.target.value)}
                placeholder="e.g. Experience The Joy of Supermarket Shopping"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                SECTION 3 DESCRIPTION
              </label>
              <textarea
                rows={2}
                value={formData.section3.description}
                onChange={(e) => handleUpdate('section3', 'description', e.target.value)}
                placeholder="Describe your retail stores and customer experience..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
              />
            </div>

            {/* Gallery Dynamic Items */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Gallery Image Cards ({formData.section3.gallery.length} Items)
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGalleryItem}
                  icon={<FontAwesomeIcon icon={faPlus} />}
                >
                  Add Gallery Item
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.section3.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-3.5 relative flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-[#064C23]">
                        Gallery Card #{idx + 1}
                      </span>
                      {formData.section3.gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(item.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer transition-colors"
                          title="Delete image"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      )}
                    </div>

                    <ImageUploadFrame
                      label="Gallery Image"
                      aspectRatio="video"
                      previewUrl={item.image}
                      onImageSelect={(file, url) => handleUpdateGalleryItem(item.id, 'image', url)}
                    />

                    <InputField
                      label="IMAGE TITLE"
                      value={item.title}
                      onChange={(e) => handleUpdateGalleryItem(item.id, 'title', e.target.value)}
                      placeholder="e.g. Fresh Produce Section"
                      required
                    />

                    <InputField
                      label="IMAGE SUBTITLE"
                      value={item.subtitle}
                      onChange={(e) => handleUpdateGalleryItem(item.id, 'subtitle', e.target.value)}
                      placeholder="e.g. Temperature controlled display bins"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 6: SECTION 4 (3 CARDS: ICON, LABEL, TITLE, SUBTITLE, BASELINE)
            ========================================================== */}
        {activeStep === 6 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 6 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Section 4: Commitments & Pillars (3 Cards)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage section label, title, and 3 key customer commitment cards.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.section4.isActive}
                  onChange={(val) => {
                    handleUpdate('section4', 'isActive', val)
                    toast.info('Section 4 Status', `Section 4 is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            {/* Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION 4 LABEL"
                value={formData.section4.label}
                onChange={(e) => handleUpdate('section4', 'label', e.target.value)}
                placeholder="e.g. CUSTOMER COMMITMENT"
              />
              <InputField
                label="SECTION 4 TITLE"
                value={formData.section4.title}
                onChange={(e) => handleUpdate('section4', 'title', e.target.value)}
                placeholder="e.g. Built on Trust, Hygiene & Unmatched Convenience"
                required
              />
            </div>

            {/* 3 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.section4.cards.map((card, idx) => {
                const handleCardChange = (field, val) => {
                  const updated = [...formData.section4.cards]
                  updated[idx] = { ...updated[idx], [field]: val }
                  handleUpdate('section4', 'cards', updated)
                }

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-4 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#064C23] text-white flex items-center justify-center text-sm">
                          <FontAwesomeIcon icon={getIconByName(card.icon)} />
                        </div>
                        <span className="text-sm font-black text-slate-900">Pillar #{idx + 1}</span>
                      </div>

                      {/* Icon Selector */}
                      <select
                        value={card.icon}
                        onChange={(e) => handleCardChange('icon', e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <InputField
                      label="CARD LABEL"
                      value={card.label}
                      onChange={(e) => handleCardChange('label', e.target.value)}
                      placeholder="e.g. HYGIENE GUARANTEE"
                    />

                    <InputField
                      label="CARD TITLE"
                      value={card.title}
                      onChange={(e) => handleCardChange('title', e.target.value)}
                      placeholder="e.g. Sanitized & Clean Touchpoints"
                      required
                    />

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        CARD SUBTITLE
                      </label>
                      <textarea
                        rows={3}
                        value={card.subtitle}
                        onChange={(e) => handleCardChange('subtitle', e.target.value)}
                        placeholder="Detailed pillar guarantee..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#064C23]"
                      />
                    </div>

                    <InputField
                      label="CARD BASELINE"
                      value={card.baseline}
                      onChange={(e) => handleCardChange('baseline', e.target.value)}
                      placeholder="e.g. Certified clean retail environment"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 7: ABOUT CTA MANAGE (LABEL, TITLE, SUBTITLE, BUTTONS, BG)
            ========================================================== */}
        {activeStep === 7 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#064C23] uppercase tracking-wider">
                  Step 7 of 7
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  About CTA Block (Call-To-Action)
                </h2>
                <p className="text-xs text-slate-500">
                  Configure bottom call-to-action banner, primary and secondary redirect buttons.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 self-start sm:self-auto">
                <span>Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.cta.isActive}
                  onChange={(val) => {
                    handleUpdate('cta', 'isActive', val)
                    toast.info('CTA Status', `About CTA block is now ${val ? 'Active' : 'Inactive'}`)
                  }}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Content & Button links */}
              <div className="lg:col-span-2 space-y-4">
                <InputField
                  label="CTA BADGE / LABEL"
                  value={formData.cta.label}
                  onChange={(e) => handleUpdate('cta', 'label', e.target.value)}
                  placeholder="e.g. START SAVING TODAY"
                />

                <InputField
                  label="CTA MAIN TITLE"
                  value={formData.cta.title}
                  onChange={(e) => handleUpdate('cta', 'title', e.target.value)}
                  placeholder="e.g. Step Into Your Nearest Bazario Supermarket"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    CTA SUBTITLE
                  </label>
                  <textarea
                    rows={3}
                    value={formData.cta.subtitle}
                    onChange={(e) => handleUpdate('cta', 'subtitle', e.target.value)}
                    placeholder="Invitation text..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                  />
                </div>

                {/* Primary and Secondary Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <span className="text-xs font-black text-[#064C23] uppercase block">
                      Primary Action Button
                    </span>
                    <InputField
                      label="BUTTON LABEL"
                      value={formData.cta.primaryButtonLabel}
                      onChange={(e) => handleUpdate('cta', 'primaryButtonLabel', e.target.value)}
                      placeholder="e.g. Find Nearest Outlet"
                      required
                    />
                    <InputField
                      label="REDIRECT TARGET URL"
                      value={formData.cta.primaryButtonUrl}
                      onChange={(e) => handleUpdate('cta', 'primaryButtonUrl', e.target.value)}
                      placeholder="/stores"
                      required
                    />
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                    <span className="text-xs font-black text-[#A44F37] uppercase block">
                      Secondary Action Button
                    </span>
                    <InputField
                      label="BUTTON LABEL"
                      value={formData.cta.secondaryButtonLabel}
                      onChange={(e) => handleUpdate('cta', 'secondaryButtonLabel', e.target.value)}
                      placeholder="e.g. Download Mobile App"
                    />
                    <InputField
                      label="REDIRECT TARGET URL"
                      value={formData.cta.secondaryButtonUrl}
                      onChange={(e) => handleUpdate('cta', 'secondaryButtonUrl', e.target.value)}
                      placeholder="/download"
                    />
                  </div>
                </div>
              </div>

              {/* Right 1 Col: CTA Background Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  CTA BANNER BACKGROUND IMAGE
                </label>
                <ImageUploadFrame
                  label="CTA Background Image"
                  aspectRatio="video"
                  previewUrl={formData.cta.ctaBgImage}
                  onImageSelect={(file, url) => handleUpdate('cta', 'ctaBgImage', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEPPER BOTTOM NAVIGATION FOOTER */}
        <div className="p-5 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {activeStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveStep((prev) => prev - 1)}
                icon={<FontAwesomeIcon icon={faArrowLeft} />}
              >
                Previous Step
              </Button>
            ) : (
              <span className="text-xs font-bold text-slate-400">Step 1 of 7</span>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              loading={saving}
              icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            >
              Save Progress
            </Button>

            {activeStep < 7 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                Next Step ({STEPS[activeStep]?.name}) →
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                loading={saving}
                icon={<FontAwesomeIcon icon={faCheck} />}
              >
                Save & Publish Complete About Page
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
