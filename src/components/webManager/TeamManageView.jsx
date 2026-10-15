import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faFloppyDisk,
  faRotateLeft,
  faPlus,
  faTrashCan,
  faArrowRight,
  faArrowLeft,
  faUserTie,
  faBriefcase,
  faImages,
  faBullhorn,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  ToggleButton
} from '../../components'
import { useToast } from '../../context/ToastContext'
import { getAdminTeamApi, updateAdminTeamApi } from '../../utils/adminApi'

const INITIAL_TEAM_FORM = {
  hero: {
    status: true,
    badge: 'People of Bazario',
    title: 'Our Team',
    subtitle: 'Meet the thinkers, builders, and frontline heroes driving 10-minute grocery delivery across Noida with dedication and care.',
    bgImage: '/store_bg_wide.jpg'
  },
  executives: {
    status: true,
    badge: 'Founders & Executive Team',
    title: 'Meet the CEOs Behind the Vision',
    subtitle: 'Shaping high-velocity hyperlocal retail with engineering precision and deep customer obsession.',
    members: [
      {
        id: 'aryan',
        name: 'Aryan Sharma',
        designation: 'Chief Executive Officer & Co-Founder',
        focus: 'Company Vision • Capital & Strategy',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'vikram',
        name: 'Vikramaditya Verma',
        designation: 'Chief Technology Officer & Co-Founder',
        focus: 'Real-time AI • Ultra-low Latency Systems',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'neha',
        name: 'Neha Singhania',
        designation: 'Chief Operating Officer & Co-Founder',
        focus: '90s Dark Store Fulfillment • Fleet Operations',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=750&q=80'
      }
    ]
  },
  managers: {
    status: true,
    badge: 'Department Leadership',
    title: 'Department Managers',
    subtitle: 'Managing supply chain, warehouse speed, marketing growth, and customer satisfaction.',
    members: [
      {
        id: 'rajesh',
        name: 'Rajesh Malhotra',
        designation: 'Head of Supply Chain & Farm Sourcing',
        department: 'Supply Chain',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'ananya',
        name: 'Ananya Deshmukh',
        designation: 'Dark Store Operations Manager',
        department: 'Store Operations',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'kunal',
        name: 'Kunal Kapoor',
        designation: 'Growth & Brand Marketing Manager',
        department: 'Growth Marketing',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'priya',
        name: 'Priya Sundaram',
        designation: 'Customer Experience & Quality Head',
        department: 'Customer Delight',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&h=750&q=80'
      }
    ]
  },
  teamLeaders: {
    status: true,
    badge: 'On-Ground Execution',
    title: 'Team Leaders',
    subtitle: 'Guiding on-ground squads across store hubs, dispatch lanes, and tech systems.',
    members: [
      {
        id: 'amit',
        name: 'Amit Kumar Yadav',
        designation: 'Lead Dark Store Dispatch Supervisor',
        squad: 'Central Hubs',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'rohan',
        name: 'Rohan Mehra',
        designation: 'Last-Mile Delivery Fleet Leader',
        squad: 'EV Fleet',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'shreya',
        name: 'Shreya Chatterjee',
        designation: 'Frontend & Mobile Engineering Lead',
        squad: 'Mobile Apps',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=750&q=80'
      },
      {
        id: 'manish',
        name: 'Manish Rawat',
        designation: 'Cold-Chain & Fresh Farm Inwarding Lead',
        squad: 'Quality Audit',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&h=750&q=80'
      }
    ]
  },
  gallery: {
    status: true,
    badge: 'Culture & Daily Life',
    title: 'Meet Our Dedicated Teams',
    subtitle: 'A glimpse into daily store operations, packing speed, and our 350+ on-ground heroes.',
    items: [
      {
        id: 'g-1',
        title: 'Dark Store Frontline Crew',
        category: 'operations',
        location: 'Sector 62 Hub',
        image: '/team/bazario_team_storefront.jpg'
      },
      {
        id: 'g-2',
        title: 'Morning Quality Audit',
        category: 'quality',
        location: 'Central Distribution Center',
        image: '/team/bazario_team_members.jpg'
      },
      {
        id: 'g-3',
        title: 'Aisle Inventory Curators',
        category: 'operations',
        location: 'Sector 50 Dark Store',
        image: '/team/bazario_team_wide.jpg'
      },
      {
        id: 'g-4',
        title: 'Sub-90s Rapid Dispatch Squad',
        category: 'operations',
        location: 'Sector 76 Hub',
        image: '/team/bazario_supermarket_team.jpg'
      },
      {
        id: 'g-5',
        title: 'Tech & Algorithm War Room',
        category: 'tech',
        location: 'Noida HQ',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'g-6',
        title: 'Customer Delight Huddle',
        category: 'culture',
        location: 'Support Operations',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'g-7',
        title: 'Delivery Fleet Heroes',
        category: 'fleet',
        location: 'Fleet Dispatch Station',
        image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'g-8',
        title: '1M Orders Celebration',
        category: 'culture',
        location: 'Annual Gathering',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  cta: {
    status: true,
    title: 'Want to join our growing team in Noida?',
    subtitle: 'Explore 31+ open positions with competitive, negotiable compensation.',
    buttonLabel: 'Explore Careers',
    buttonUrl: '/careers'
  }
}

const STEPS = [
  { id: 1, name: 'Hero Banner', icon: faLayerGroup },
  { id: 2, name: 'Leadership & CEOs', icon: faUserTie },
  { id: 3, name: 'Department Managers', icon: faBriefcase },
  { id: 4, name: 'Team Leaders', icon: faUsers },
  { id: 5, name: 'Culture & Gallery', icon: faImages },
  { id: 6, name: 'Careers CTA', icon: faBullhorn }
]

export default function TeamManageView() {
  const toast = useToast()
  const [activeStep, setActiveStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_team_form')
      return saved ? JSON.parse(saved) : INITIAL_TEAM_FORM
    } catch {
      return INITIAL_TEAM_FORM
    }
  })

  // Load from live API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getAdminTeamApi()
        const data = res.data
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setFormData((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.warn('API error, using cached team data:', err)
      }
    }
    fetchTeam()
  }, [])

  const updateSection = (sectionKey, field, val) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: val
      }
    }))
  }

  const handleSave = async (e) => {
    e?.preventDefault?.()
    setSaving(true)
    try {
      localStorage.setItem('bazario_web_team_form', JSON.stringify(formData))
      await updateAdminTeamApi(formData)
      setSaving(false)
      toast.success('Our Team Saved', 'All team member profiles & settings updated successfully.')
    } catch (err) {
      setSaving(false)
      toast.error('Save Failed', err?.message || 'Failed to save to database.')
    }
  }

  const handleReset = () => {
    setFormData(INITIAL_TEAM_FORM)
    localStorage.setItem('bazario_web_team_form', JSON.stringify(INITIAL_TEAM_FORM))
    toast.info('Form Reset', 'Restored default Our Team values.')
  }

  // Member CRUD helpers
  const addExecutive = () => {
    const newMember = {
      id: `exec-${Date.now()}`,
      name: '',
      designation: '',
      focus: '',
      image: ''
    }
    updateSection('executives', 'members', [...formData.executives.members, newMember])
    toast.success('Executive Added', 'New leadership slot created.')
  }

  const removeExecutive = (index) => {
    const updated = formData.executives.members.filter((_, idx) => idx !== index)
    updateSection('executives', 'members', updated)
    toast.info('Removed', 'Executive card removed.')
  }

  const updateExecutive = (index, field, val) => {
    const updated = [...formData.executives.members]
    updated[index] = { ...updated[index], [field]: val }
    updateSection('executives', 'members', updated)
  }

  const addManager = () => {
    const newMember = {
      id: `mgr-${Date.now()}`,
      name: '',
      designation: '',
      department: '',
      image: ''
    }
    updateSection('managers', 'members', [...formData.managers.members, newMember])
    toast.success('Manager Added', 'New department manager slot created.')
  }

  const removeManager = (index) => {
    const updated = formData.managers.members.filter((_, idx) => idx !== index)
    updateSection('managers', 'members', updated)
    toast.info('Removed', 'Manager card removed.')
  }

  const updateManager = (index, field, val) => {
    const updated = [...formData.managers.members]
    updated[index] = { ...updated[index], [field]: val }
    updateSection('managers', 'members', updated)
  }

  const addLeader = () => {
    const newMember = {
      id: `lead-${Date.now()}`,
      name: '',
      designation: '',
      squad: '',
      image: ''
    }
    updateSection('teamLeaders', 'members', [...formData.teamLeaders.members, newMember])
    toast.success('Leader Added', 'New team leader slot created.')
  }

  const removeLeader = (index) => {
    const updated = formData.teamLeaders.members.filter((_, idx) => idx !== index)
    updateSection('teamLeaders', 'members', updated)
    toast.info('Removed', 'Leader card removed.')
  }

  const updateLeader = (index, field, val) => {
    const updated = [...formData.teamLeaders.members]
    updated[index] = { ...updated[index], [field]: val }
    updateSection('teamLeaders', 'members', updated)
  }

  const addGalleryItem = () => {
    const newItem = {
      id: `g-${Date.now()}`,
      title: '',
      category: 'operations',
      location: '',
      image: ''
    }
    updateSection('gallery', 'items', [...formData.gallery.items, newItem])
    toast.success('Photo Added', 'New gallery photo slot created.')
  }

  const removeGalleryItem = (index) => {
    const updated = formData.gallery.items.filter((_, idx) => idx !== index)
    updateSection('gallery', 'items', updated)
    toast.info('Removed', 'Gallery photo removed.')
  }

  const updateGalleryItem = (index, field, val) => {
    const updated = [...formData.gallery.items]
    updated[index] = { ...updated[index], [field]: val }
    updateSection('gallery', 'items', updated)
  }

  return (
    <div className="space-y-6">
      
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#064C23] uppercase tracking-wider mb-1">
            <FontAwesomeIcon icon={faUsers} />
            <span>Web Content Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our Team Page Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic executive leadership, department managers, team leaders, and daily culture photo gallery.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center space-x-2 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
            <span>Reset</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-[#064C23] hover:bg-[#053d1c] text-white shadow-xs cursor-pointer"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
              className={`flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2 ${
                isCurrent
                  ? 'bg-[#064C23] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <FontAwesomeIcon icon={step.icon} className={isCurrent ? 'text-white' : 'text-slate-400'} />
              <span>{step.name}</span>
            </button>
          )
        })}
      </div>

      {/* Form Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        
        {/* ==========================================================
            STEP 1: HERO BANNER
            ========================================================== */}
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 1 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Hero Banner</h2>
                <p className="text-xs text-slate-500">Configure top hero badge, title, subtitle, and ambient background cover photo.</p>
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
                  label="HERO BADGE"
                  placeholder="e.g. People of Bazario"
                  value={formData.hero.badge}
                  onChange={(e) => updateSection('hero', 'badge', e.target.value)}
                />

                <InputField
                  label="MAIN TITLE"
                  placeholder="e.g. Our Team"
                  value={formData.hero.title}
                  onChange={(e) => updateSection('hero', 'title', e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    SUBTITLE / INTRO DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter intro summary..."
                    value={formData.hero.subtitle}
                    onChange={(e) => updateSection('hero', 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <ImageUploadFrame
                  label="BACKGROUND BANNER IMAGE"
                  aspectRatio="video"
                  value={formData.hero.bgImage}
                  onChange={(url) => updateSection('hero', 'bgImage', url)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 2: LEADERSHIP & CEOS (EXECUTIVE TEAM)
            ========================================================== */}
        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 2 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Founders & Executive Team</h2>
                <p className="text-xs text-slate-500">Manage CEOs, CTOs, and top company founders.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.executives.status}
                  onChange={(val) => updateSection('executives', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION BADGE"
                placeholder="e.g. Founders & Executive Team"
                value={formData.executives.badge}
                onChange={(e) => updateSection('executives', 'badge', e.target.value)}
              />
              <InputField
                label="SECTION TITLE"
                placeholder="e.g. Meet the CEOs Behind the Vision"
                value={formData.executives.title}
                onChange={(e) => updateSection('executives', 'title', e.target.value)}
                required
              />
            </div>

            <InputField
              label="SECTION SUBTITLE"
              placeholder="e.g. Shaping high-velocity hyperlocal retail with engineering precision..."
              value={formData.executives.subtitle}
              onChange={(e) => updateSection('executives', 'subtitle', e.target.value)}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Executive Members ({formData.executives.members.length})
                </h3>
                <Button
                  size="sm"
                  onClick={addExecutive}
                  className="flex items-center space-x-2 bg-[#edf7ee] hover:bg-[#d6eed9] text-[#064C23] border border-[#d6eed9] text-xs font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Executive</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {formData.executives.members.map((member, idx) => (
                  <div key={member.id || idx} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-6 h-6 rounded-lg bg-[#064C23] text-white text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExecutive(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Member"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    </div>

                    <ImageUploadFrame
                      label="MEMBER PHOTO"
                      aspectRatio="square"
                      value={member.image}
                      onChange={(url) => updateExecutive(idx, 'image', url)}
                    />

                    <InputField
                      label="FULL NAME"
                      placeholder="e.g. Aryan Sharma"
                      value={member.name}
                      onChange={(e) => updateExecutive(idx, 'name', e.target.value)}
                      required
                    />

                    <InputField
                      label="DESIGNATION / ROLE"
                      placeholder="e.g. Chief Executive Officer & Co-Founder"
                      value={member.designation}
                      onChange={(e) => updateExecutive(idx, 'designation', e.target.value)}
                    />

                    <InputField
                      label="FOCUS AREA / BIO LINE"
                      placeholder="e.g. Company Vision • Capital & Strategy"
                      value={member.focus}
                      onChange={(e) => updateExecutive(idx, 'focus', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 3: DEPARTMENT MANAGERS
            ========================================================== */}
        {activeStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 3 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Department Managers</h2>
                <p className="text-xs text-slate-500">Manage department heads for supply chain, operations, marketing, and customer delight.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.managers.status}
                  onChange={(val) => updateSection('managers', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION BADGE"
                placeholder="e.g. Department Leadership"
                value={formData.managers.badge}
                onChange={(e) => updateSection('managers', 'badge', e.target.value)}
              />
              <InputField
                label="SECTION TITLE"
                placeholder="e.g. Department Managers"
                value={formData.managers.title}
                onChange={(e) => updateSection('managers', 'title', e.target.value)}
                required
              />
            </div>

            <InputField
              label="SECTION SUBTITLE"
              placeholder="e.g. Managing supply chain, warehouse speed, marketing growth..."
              value={formData.managers.subtitle}
              onChange={(e) => updateSection('managers', 'subtitle', e.target.value)}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Department Managers ({formData.managers.members.length})
                </h3>
                <Button
                  size="sm"
                  onClick={addManager}
                  className="flex items-center space-x-2 bg-[#edf7ee] hover:bg-[#d6eed9] text-[#064C23] border border-[#d6eed9] text-xs font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Manager</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.managers.members.map((member, idx) => (
                  <div key={member.id || idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-5 h-5 rounded-md bg-[#064C23] text-white text-[10px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeManager(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Manager"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    </div>

                    <ImageUploadFrame
                      label="PHOTO"
                      aspectRatio="square"
                      value={member.image}
                      onChange={(url) => updateManager(idx, 'image', url)}
                    />

                    <InputField
                      label="NAME"
                      placeholder="e.g. Rajesh Malhotra"
                      value={member.name}
                      onChange={(e) => updateManager(idx, 'name', e.target.value)}
                      required
                    />

                    <InputField
                      label="DESIGNATION"
                      placeholder="e.g. Head of Supply Chain"
                      value={member.designation}
                      onChange={(e) => updateManager(idx, 'designation', e.target.value)}
                    />

                    <InputField
                      label="DEPARTMENT TAG"
                      placeholder="e.g. Supply Chain"
                      value={member.department}
                      onChange={(e) => updateManager(idx, 'department', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 4: TEAM LEADERS
            ========================================================== */}
        {activeStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 4 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Team Leaders</h2>
                <p className="text-xs text-slate-500">Manage dispatch supervisors, EV fleet squad leaders, and engineering leads.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.teamLeaders.status}
                  onChange={(val) => updateSection('teamLeaders', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION BADGE"
                placeholder="e.g. On-Ground Execution"
                value={formData.teamLeaders.badge}
                onChange={(e) => updateSection('teamLeaders', 'badge', e.target.value)}
              />
              <InputField
                label="SECTION TITLE"
                placeholder="e.g. Team Leaders"
                value={formData.teamLeaders.title}
                onChange={(e) => updateSection('teamLeaders', 'title', e.target.value)}
                required
              />
            </div>

            <InputField
              label="SECTION SUBTITLE"
              placeholder="e.g. Guiding on-ground squads across store hubs, dispatch lanes..."
              value={formData.teamLeaders.subtitle}
              onChange={(e) => updateSection('teamLeaders', 'subtitle', e.target.value)}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Team Leaders ({formData.teamLeaders.members.length})
                </h3>
                <Button
                  size="sm"
                  onClick={addLeader}
                  className="flex items-center space-x-2 bg-[#edf7ee] hover:bg-[#d6eed9] text-[#064C23] border border-[#d6eed9] text-xs font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Leader</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.teamLeaders.members.map((member, idx) => (
                  <div key={member.id || idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-5 h-5 rounded-md bg-[#064C23] text-white text-[10px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLeader(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Leader"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    </div>

                    <ImageUploadFrame
                      label="PHOTO"
                      aspectRatio="square"
                      value={member.image}
                      onChange={(url) => updateLeader(idx, 'image', url)}
                    />

                    <InputField
                      label="NAME"
                      placeholder="e.g. Amit Kumar Yadav"
                      value={member.name}
                      onChange={(e) => updateLeader(idx, 'name', e.target.value)}
                      required
                    />

                    <InputField
                      label="DESIGNATION"
                      placeholder="e.g. Lead Dispatch Supervisor"
                      value={member.designation}
                      onChange={(e) => updateLeader(idx, 'designation', e.target.value)}
                    />

                    <InputField
                      label="SQUAD / UNIT TAG"
                      placeholder="e.g. Central Hubs"
                      value={member.squad}
                      onChange={(e) => updateLeader(idx, 'squad', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 5: CULTURE & DAILY LIFE GALLERY
            ========================================================== */}
        {activeStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 5 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Culture & Dedicated Teams Gallery</h2>
                <p className="text-xs text-slate-500">Configure behind-the-scenes store operations, warehouse speed, and fleet celebration photos.</p>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-700">Section Status:</span>
                <ToggleButton
                  size="sm"
                  checked={formData.gallery.status}
                  onChange={(val) => updateSection('gallery', 'status', val)}
                  activeColor="#064C23"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="SECTION BADGE"
                placeholder="e.g. Culture & Daily Life"
                value={formData.gallery.badge}
                onChange={(e) => updateSection('gallery', 'badge', e.target.value)}
              />
              <InputField
                label="SECTION TITLE"
                placeholder="e.g. Meet Our Dedicated Teams"
                value={formData.gallery.title}
                onChange={(e) => updateSection('gallery', 'title', e.target.value)}
                required
              />
            </div>

            <InputField
              label="SECTION SUBTITLE"
              placeholder="e.g. A glimpse into daily store operations, packing speed..."
              value={formData.gallery.subtitle}
              onChange={(e) => updateSection('gallery', 'subtitle', e.target.value)}
            />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Gallery Photos ({formData.gallery.items.length})
                </h3>
                <Button
                  size="sm"
                  onClick={addGalleryItem}
                  className="flex items-center space-x-2 bg-[#edf7ee] hover:bg-[#d6eed9] text-[#064C23] border border-[#d6eed9] text-xs font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Photo</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.gallery.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="w-5 h-5 rounded-md bg-[#064C23] text-white text-[10px] font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Photo"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                      </button>
                    </div>

                    <ImageUploadFrame
                      label="PHOTO"
                      aspectRatio="video"
                      value={item.image}
                      onChange={(url) => updateGalleryItem(idx, 'image', url)}
                    />

                    <InputField
                      label="PHOTO TITLE"
                      placeholder="e.g. Dark Store Frontline Crew"
                      value={item.title}
                      onChange={(e) => updateGalleryItem(idx, 'title', e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        label="CATEGORY"
                        placeholder="e.g. operations"
                        value={item.category}
                        onChange={(e) => updateGalleryItem(idx, 'category', e.target.value)}
                      />
                      <InputField
                        label="LOCATION"
                        placeholder="e.g. Sector 62 Hub"
                        value={item.location}
                        onChange={(e) => updateGalleryItem(idx, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            STEP 6: CAREERS CTA STRIP
            ========================================================== */}
        {activeStep === 6 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#064C23] uppercase tracking-wider">Step 6 of 6</span>
                <h2 className="text-lg font-black text-slate-900">Careers Call to Action Strip</h2>
                <p className="text-xs text-slate-500">Configure the bottom recruitment banner inviting users to join Bazario.</p>
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
                label="HEADING TITLE"
                placeholder="e.g. Want to join our growing team in Noida?"
                value={formData.cta.title}
                onChange={(e) => updateSection('cta', 'title', e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  SUBTITLE / INVITATION TEXT
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Explore 31+ open positions with competitive, negotiable compensation."
                  value={formData.cta.subtitle}
                  onChange={(e) => updateSection('cta', 'subtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="BUTTON LABEL"
                  placeholder="e.g. Explore Careers"
                  value={formData.cta.buttonLabel}
                  onChange={(e) => updateSection('cta', 'buttonLabel', e.target.value)}
                />
                <InputField
                  label="BUTTON URL / REDIRECT"
                  placeholder="e.g. /careers"
                  value={formData.cta.buttonUrl}
                  onChange={(e) => updateSection('cta', 'buttonUrl', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={activeStep === 1}
          onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
          className="flex items-center space-x-2 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          <span>Previous Step</span>
        </Button>

        <div className="text-xs font-bold text-slate-500">
          Step {activeStep} of {STEPS.length}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={activeStep === STEPS.length}
          onClick={() => setActiveStep((prev) => Math.min(STEPS.length, prev + 1))}
          className="flex items-center space-x-2 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          <span>Next Step</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </Button>
      </div>

    </div>
  )
}
