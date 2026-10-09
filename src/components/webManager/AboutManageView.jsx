import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleInfo,
  faFloppyDisk,
  faRotateLeft,
  faEye,
  faBullseye,
  faLightbulb,
  faStore,
  faUsers,
  faAward,
  faTruckFast
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  InputField,
  ImageUploadFrame,
  FormLayout,
  FormSection,
  FormRow,
  FormActions,
  ToggleButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_ABOUT_DATA = {
  heroTag: 'About Bazario Supermarket',
  heroTitle: 'Delivering Quality Groceries & Fresh Everyday Essentials Since 2018',
  heroSubtitle:
    'Bazario is your trusted neighbourhood supermarket dedicated to farm-fresh produce, premium pantry staples, and unmatched customer service.',
  heroImage: '/logo.png',
  isSectionActive: true,
  mission:
    'To make premium fresh groceries, daily staples, and organic produce accessible, affordable, and conveniently available to every household.',
  vision:
    'To become India’s most reliable, community-first omnichannel supermarket brand empowering local farmers and happy shoppers.',
  stat1Label: 'Happy Shoppers',
  stat1Value: '50,000+',
  stat2Label: 'Fresh Products',
  stat2Value: '15,000+',
  stat3Label: 'Physical Outlets',
  stat3Value: '4 Branches',
  stat4Label: 'On-Time Express',
  stat4Value: '99.8%',
  leadershipName: 'Rajesh Kumar Mehta',
  leadershipRole: 'Founder & Managing Director',
  leadershipMessage:
    'Our commitment is straightforward: freshness without compromise and fair pricing every single day.'
}

export default function AboutManageView() {
  const toast = useToast()
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('bazario_web_about')
    return saved ? JSON.parse(saved) : INITIAL_ABOUT_DATA
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e?.preventDefault?.()
    setSaving(true)
    localStorage.setItem('bazario_web_about', JSON.stringify(formData))
    setTimeout(() => {
      setSaving(false)
      toast.success('About Page Updated', 'Website About Us content has been successfully published.')
    }, 400)
  }

  const handleReset = () => {
    setFormData(INITIAL_ABOUT_DATA)
    localStorage.setItem('bazario_web_about', JSON.stringify(INITIAL_ABOUT_DATA))
    toast.info('Reset Default', 'About Us content restored to factory defaults.')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">About Manage</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Public Page
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Customize website hero storyline, mission, vision, statistics counters, and leadership notes.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <span>Status:</span>
            <ToggleButton
              size="sm"
              checked={formData.isSectionActive}
              onChange={(val) => {
                handleChange('isSectionActive', val)
                toast.info('Section Status', `About section is now ${val ? 'Visible' : 'Hidden'}`)
              }}
              activeColor="#064C23"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <FormLayout onSubmit={handleSave}>
        {/* Section 1: Hero Banner */}
        <FormSection
          stepNumber="1"
          title="Hero Banner & Primary Headline"
          description="The first narrative shoppers encounter on the website about section."
        >
          <FormRow columns={2}>
            <InputField
              label="SECTION BADGE TAG"
              value={formData.heroTag}
              onChange={(e) => handleChange('heroTag', e.target.value)}
              placeholder="e.g. About Bazario Supermarket"
              helperText="Small pill tag above main headline"
            />
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ABOUT BANNER IMAGE / LOGO
              </label>
              <ImageUploadFrame
                label="Banner / Store Image"
                aspectRatio="square"
                previewUrl={formData.heroImage}
                onImageSelect={(file, url) => handleChange('heroImage', url)}
              />
            </div>
          </FormRow>

          <FormRow columns={1}>
            <InputField
              label="MAIN HERO TITLE"
              value={formData.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              placeholder="Enter inspiring headline"
              required
            />
          </FormRow>

          <FormRow columns={1}>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                HERO SUBTITLE STORY
              </label>
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
                placeholder="Brief introduction of Bazario's core promise..."
              />
            </div>
          </FormRow>
        </FormSection>

        {/* Section 2: Mission & Vision */}
        <FormSection
          stepNumber="2"
          title="Mission & Vision Pillars"
          description="Define the corporate purpose and long-term vision of Bazario Retail."
        >
          <FormRow columns={2}>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faBullseye} className="text-[#064C23] text-sm" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  OUR MISSION
                </label>
              </div>
              <textarea
                value={formData.mission}
                onChange={(e) => handleChange('mission', e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
                placeholder="What Bazario strives to deliver daily..."
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faLightbulb} className="text-[#A44F37] text-sm" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  OUR VISION
                </label>
              </div>
              <textarea
                value={formData.vision}
                onChange={(e) => handleChange('vision', e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
                placeholder="Where Bazario aims to be in the future..."
              />
            </div>
          </FormRow>
        </FormSection>

        {/* Section 3: Live Statistics Counters */}
        <FormSection
          stepNumber="3"
          title="Key Milestones & Live Statistics"
          description="Four impactful statistics highlighted on the about page."
        >
          <FormRow columns={4}>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-[#064C23] font-bold text-xs">
                <FontAwesomeIcon icon={faUsers} />
                <span>Stat 1</span>
              </div>
              <InputField
                label="VALUE"
                value={formData.stat1Value}
                onChange={(e) => handleChange('stat1Value', e.target.value)}
              />
              <InputField
                label="LABEL"
                value={formData.stat1Label}
                onChange={(e) => handleChange('stat1Label', e.target.value)}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-[#A44F37] font-bold text-xs">
                <FontAwesomeIcon icon={faAward} />
                <span>Stat 2</span>
              </div>
              <InputField
                label="VALUE"
                value={formData.stat2Value}
                onChange={(e) => handleChange('stat2Value', e.target.value)}
              />
              <InputField
                label="LABEL"
                value={formData.stat2Label}
                onChange={(e) => handleChange('stat2Label', e.target.value)}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                <FontAwesomeIcon icon={faStore} />
                <span>Stat 3</span>
              </div>
              <InputField
                label="VALUE"
                value={formData.stat3Value}
                onChange={(e) => handleChange('stat3Value', e.target.value)}
              />
              <InputField
                label="LABEL"
                value={formData.stat3Label}
                onChange={(e) => handleChange('stat3Label', e.target.value)}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
                <FontAwesomeIcon icon={faTruckFast} />
                <span>Stat 4</span>
              </div>
              <InputField
                label="VALUE"
                value={formData.stat4Value}
                onChange={(e) => handleChange('stat4Value', e.target.value)}
              />
              <InputField
                label="LABEL"
                value={formData.stat4Label}
                onChange={(e) => handleChange('stat4Label', e.target.value)}
              />
            </div>
          </FormRow>
        </FormSection>

        {/* Section 4: Leadership Note */}
        <FormSection
          stepNumber="4"
          title="Leadership Quote & Founder's Desk"
          description="Personal message from the management to customers."
        >
          <FormRow columns={2}>
            <InputField
              label="LEADERSHIP NAME"
              value={formData.leadershipName}
              onChange={(e) => handleChange('leadershipName', e.target.value)}
              placeholder="e.g. Rajesh Kumar Mehta"
            />
            <InputField
              label="DESIGNATION / ROLE"
              value={formData.leadershipRole}
              onChange={(e) => handleChange('leadershipRole', e.target.value)}
              placeholder="e.g. Founder & Managing Director"
            />
          </FormRow>

          <FormRow columns={1}>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                FOUNDER'S NOTE
              </label>
              <textarea
                value={formData.leadershipMessage}
                onChange={(e) => handleChange('leadershipMessage', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
                placeholder="Personal message regarding Bazario quality..."
              />
            </div>
          </FormRow>
        </FormSection>

        {/* Actions Footer */}
        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            icon={<FontAwesomeIcon icon={faRotateLeft} />}
          >
            Reset Defaults
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={<FontAwesomeIcon icon={faFloppyDisk} />}
          >
            Publish About Page
          </Button>
        </FormActions>
      </FormLayout>
    </div>
  )
}
