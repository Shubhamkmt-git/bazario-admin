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
  faLeaf,
  faTruckFast,
  faShieldHalved,
  faTags,
  faStore,
  faAward,
  faHeart,
  faCheckDouble,
  faHandHoldingHeart,
  faBagShopping
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  ToggleButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const ICONS = [
  { id: 'leaf', name: 'Leaf / Organic' },
  { id: 'truck', name: 'Fast Delivery' },
  { id: 'shield', name: 'Quality Shield' },
  { id: 'tags', name: 'Best Price' },
  { id: 'store', name: 'Retail Store' },
  { id: 'award', name: 'Trust Award' },
  { id: 'heart', name: 'Customer Care' },
  { id: 'check', name: 'Quality Check' },
  { id: 'care', name: 'Community' },
  { id: 'bag', name: 'Shopping Bag' }
]

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
      { icon: 'leaf', label: 'VALUE 1', title: '100% Farm Fresh', subtitle: 'Directly sourced from verified farmers daily', baseline: 'Fresh produce promise' },
      { icon: 'tags', label: 'VALUE 2', title: 'Honest Pricing', subtitle: 'Lowest prices without middlemen margins', baseline: 'Save up to 20% on bills' },
      { icon: 'shield', label: 'VALUE 3', title: 'Quality Assurance', subtitle: 'Strict grading and multi-point freshness inspection', baseline: 'FSSAI compliant handling' },
      { icon: 'truck', label: 'VALUE 4', title: 'Express Delivery', subtitle: 'Fast doorstep delivery from your nearest outlet', baseline: '20-minute delivery' }
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
      { icon: 'heart', label: 'PILLAR 1', title: 'Sanitized Facilities', subtitle: 'Regular sanitization of shopping carts, racks and billing stations', baseline: 'Hygienic touchpoints' },
      { icon: 'care', label: 'PILLAR 2', title: 'Farmer First', subtitle: 'Supporting 500+ local agricultural families with fair wages', baseline: '100% local procurement' },
      { icon: 'award', label: 'PILLAR 3', title: 'Instant Replacements', subtitle: 'No-questions-asked item replacement or refund policy', baseline: 'Satisfaction guaranteed' }
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
  { id: 1, name: 'Hero Banner' },
  { id: 2, name: 'States (4)' },
  { id: 3, name: 'Section 1' },
  { id: 4, name: 'Section 2' },
  { id: 5, name: 'Section 3' },
  { id: 6, name: 'Section 4' },
  { id: 7, name: 'About CTA' }
]

export default function AboutManageView() {
  const toast = useToast()
  const [activeStep, setActiveStep] = useState(1)
  const [saving, setSaving] = useState(false)

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
        toast.success('About Form Saved', 'All section inputs saved successfully.')
      }, 300)
    } catch {
      setSaving(false)
      toast.error('Save Failed', 'Could not save settings.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    localStorage.setItem('bazario_web_about_form', JSON.stringify(INITIAL_FORM))
    toast.info('Form Reset', 'Restored initial clean form values.')
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
  }

  const removeGalleryItem = (id) => {
    const updated = formData.section3.gallery.filter((g) => g.id !== id)
    updateSection('section3', 'gallery', updated)
  }

  const updateGalleryItem = (id, field, val) => {
    const updated = formData.section3.gallery.map((g) =>
      g.id === id ? { ...g, [field]: val } : g
    )
    updateSection('section3', 'gallery', updated)
  }

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-lg shrink-0">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">About Page Manage</h1>
            <p className="text-xs text-slate-500">
              Configure hero banner, states, mission/vision, value cards, gallery, and CTA.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="sm" onClick={handleReset} icon={<FontAwesomeIcon icon={faRotateLeft} />}>
            Reset
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<FontAwesomeIcon icon={faFloppyDisk} />}>
            Save All
          </Button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex items-center overflow-x-auto no-scrollbar gap-1.5">
        {STEPS.map((step) => {
          const isCurrent = activeStep === step.id
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                isCurrent
                  ? 'bg-[#064C23] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* ==========================================================
            STEP 1: HERO BANNER
            ========================================================== */}
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Hero Banner</h2>
                <p className="text-xs text-slate-500">Banner image, titles line 1 & 2, and subtitle</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.hero.status}
                  onChange={(val) => updateSection('hero', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <InputField
                  label="BANNER TITLE LINE 1"
                  placeholder="Enter banner title line 1"
                  value={formData.hero.titleLine1}
                  onChange={(e) => updateSection('hero', 'titleLine1', e.target.value)}
                  required
                />

                <InputField
                  label="TITLE LINE 2"
                  placeholder="Enter title line 2"
                  value={formData.hero.titleLine2}
                  onChange={(e) => updateSection('hero', 'titleLine2', e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SUBTITLE
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter hero subtitle"
                    value={formData.hero.subtitle}
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
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
            STEP 2: STATES (4)
            ========================================================== */}
        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">States (4 Cards)</h2>
                <p className="text-xs text-slate-500">Prefix, suffix, label and description for 4 state cards</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-[#064C23]">Card #{idx + 1}</div>
                    
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
                        placeholder="Description text"
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Section One</h2>
                <p className="text-xs text-slate-500">Label, title, mission card, and vision card</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#064C23]">Mission Card</h3>
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
                <div className="space-y-1">
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
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#A44F37]">Vission Card</h3>
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
                <div className="space-y-1">
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Section 2</h2>
                <p className="text-xs text-slate-500">Label, title, and 4 cards (icon select, lable, title, subtitle, base line)</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#064C23]">Card #{idx + 1}</span>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-500">ICON:</span>
                        <select
                          value={card.icon}
                          onChange={(e) => updateCard('icon', e.target.value)}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                        >
                          {ICONS.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Section 3</h2>
                <p className="text-xs text-slate-500">Lable, title, description, and gallery images (multiple can add/remove)</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
                rows={2}
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
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative">
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">Section 4</h2>
                <p className="text-xs text-slate-500">Lable, title, and 3 cards manage (title, subtitle, icon, lable, baseline)</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#064C23]">Card #{idx + 1}</span>
                      <select
                        value={card.icon}
                        onChange={(e) => updateCard('icon', e.target.value)}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                      >
                        {ICONS.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name}
                          </option>
                        ))}
                      </select>
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
                        rows={2}
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900">About CTA Manage</h2>
                <p className="text-xs text-slate-500">Lable, title, subtitle, primary button label & url, secondary button label & url</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-600">Status:</span>
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
                  rows={2}
                  placeholder="Enter subtitle..."
                  value={formData.cta.subtitle}
                  onChange={(e) => updateSection('cta', 'subtitle', e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-[#064C23] uppercase">Primary Button</span>
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

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-[#A44F37] uppercase">Secondary Button</span>
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
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {activeStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveStep((prev) => prev - 1)}
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
            >
              Previous
            </Button>
          ) : (
            <span className="text-xs font-bold text-slate-400">Step 1 of 7</span>
          )}

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSave}
              loading={saving}
              icon={<FontAwesomeIcon icon={faFloppyDisk} />}
            >
              Save Form
            </Button>

            {activeStep < 7 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                Next Step →
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={saving}
                icon={<FontAwesomeIcon icon={faCheck} />}
              >
                Save All
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
