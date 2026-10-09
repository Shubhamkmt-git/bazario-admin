import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faClock,
  faSort,
  faCompass,
  faDoorOpen,
  faDoorClosed,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'
import InputField from '../ui/InputField'
import ToggleButton from '../ui/ToggleButton'
import ImageUploadFrame from '../ui/ImageUploadFrame'
import { FormRow, FormActions } from '../ui/FormLayout'

export default function EditStoreView({ store, onBack, onSave }) {
  const toast = useToast()

  const [formData, setFormData] = useState({
    title: store?.title || '',
    subtitle: store?.subtitle || '',
    sortingOrder: store?.sortingOrder ?? 1,
    image: store?.image || '/supermart-bg.jpg',
    coordinates: store?.coordinates || '',
    googleUrl: store?.googleUrl || '',
    status: store?.status || 'Open',
    phone: store?.phone || '',
    operatingHours: store?.operatingHours || '7:00 AM - 11:00 PM',
  })

  // Sync if store changes
  useEffect(() => {
    if (store) {
      setFormData({
        title: store.title || '',
        subtitle: store.subtitle || '',
        sortingOrder: store.sortingOrder ?? 1,
        image: store.image || '/supermart-bg.jpg',
        coordinates: store.coordinates || '',
        googleUrl: store.googleUrl || '',
        status: store.status || 'Open',
        phone: store.phone || '',
        operatingHours: store.operatingHours || '7:00 AM - 11:00 PM',
      })
    }
  }, [store])

  // Safe Google Maps link opener
  const handleOpenGoogleMaps = () => {
    let targetUrl = formData.googleUrl ? formData.googleUrl.trim() : ''
    if (!targetUrl && formData.coordinates) {
      targetUrl = `https://maps.google.com/?q=${encodeURIComponent(formData.coordinates.trim())}`
    } else if (!targetUrl && formData.title) {
      targetUrl = `https://maps.google.com/?q=${encodeURIComponent(formData.title.trim())}`
    }

    if (!targetUrl) {
      toast.warning('No Location', 'Please enter GPS coordinates or a Google Maps URL first.')
      return
    }

    const finalUrl = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
      ? targetUrl
      : `https://${targetUrl}`
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Please enter a store title / name.')
      return
    }

    const updatedStore = {
      ...store,
      ...formData,
      sortingOrder: Number(formData.sortingOrder) || 1,
    }

    onSave(updatedStore)
  }

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton
            label="Back to Stores"
            onClick={onBack}
            variant="bordered"
          />
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
              Store Editor
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Edit: {store?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button
            variant="cancel"
            size="sm"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Minimal Clean Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Store Branding & Sorting */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Basic Store Identity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <InputField
                  label="Store Title / Name"
                  required
                  placeholder="e.g. Bazario Central Superstore #01"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  helperText="Primary brand and branch identifier"
                />
              </div>

              <div className="md:col-span-1">
                <InputField
                  label="Sorting Order"
                  type="number"
                  min="1"
                  icon={<FontAwesomeIcon icon={faSort} className="text-xs text-slate-400" />}
                  placeholder="1"
                  value={formData.sortingOrder}
                  onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                  helperText="Display priority (1 = Top)"
                />
              </div>
            </div>

            <InputField
              label="Store Subtitle / Area Description"
              placeholder="e.g. Flagship Mega Mart & Fresh Produce Hub, Sector 18"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              helperText="Branch location or shopping complex landmark"
            />
          </div>

          {/* Section 2: Location & Mapping */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Geo Coordinates & Navigation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                label="GPS Coordinates (Lat, Long)"
                icon={<FontAwesomeIcon icon={faLocationDot} className="text-xs text-[#064C23]" />}
                placeholder="e.g. 28.5708, 77.3261"
                value={formData.coordinates}
                onChange={(e) => {
                  const coords = e.target.value
                  setFormData((prev) => ({
                    ...prev,
                    coordinates: coords,
                    googleUrl:
                      !prev.googleUrl || prev.googleUrl.startsWith('https://maps.google.com/?q=')
                        ? coords
                          ? `https://maps.google.com/?q=${encodeURIComponent(coords.trim())}`
                          : ''
                        : prev.googleUrl,
                  }))
                }}
                helperText="Latitude, Longitude coordinates (e.g. 28.5708, 77.3261)"
              />

              {/* Google Maps URL Field with Working Action Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Google Maps Location URL
                  </label>
                  {(formData.googleUrl || formData.coordinates) && (
                    <button
                      type="button"
                      onClick={handleOpenGoogleMaps}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#064C23] hover:text-[#096330] hover:underline cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faCompass} className="text-[11px]" />
                      <span>Test Link</span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A44F37]">
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. https://maps.google.com/?q=28.5708,77.3261"
                    value={formData.googleUrl}
                    onChange={(e) => setFormData({ ...formData, googleUrl: e.target.value })}
                    className="w-full pl-9 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleOpenGoogleMaps}
                    className="absolute right-1.5 px-3 py-1.5 bg-[#064C23] hover:bg-[#095f2d] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Open in Google Maps"
                  >
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-[11px]" />
                    <span>Maps</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Google Maps URL for customer directions & driver dispatch
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Hours */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Store Contact & Operating Hours
              </span>
            </div>

            <FormRow cols={2}>
              <InputField
                label="Contact Helpline Phone"
                icon={<FontAwesomeIcon icon={faPhone} className="text-xs text-slate-400" />}
                placeholder="e.g. +91 98111 22334"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                helperText="Branch phone or customer support number"
              />

              <InputField
                label="Operating Hours"
                icon={<FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />}
                placeholder="e.g. 7:00 AM - 11:00 PM"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                helperText="Daily opening and closing schedule"
              />
            </FormRow>
          </div>

          {/* Section 4: Store Photo */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Store Facade Photo
              </span>
            </div>

            <ImageUploadFrame
              label="Store Front Photo / Banner"
              aspectRatio="banner"
              value={formData.image}
              onChange={(img) => setFormData({ ...formData, image: img })}
            />
          </div>

          {/* Section 5: Operating Status Toggle Card */}
          <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                status: prev.status === 'Open' ? 'Closed' : 'Open',
              }))
            }
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              formData.status === 'Open'
                ? 'bg-[#f0f9f3] border-[#bae2cb] hover:border-[#064C23]'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-900">Store Live Operating Status</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                    formData.status === 'Open'
                      ? 'bg-[#064C23] text-white shadow-2xs'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={formData.status === 'Open' ? faDoorOpen : faDoorClosed}
                    className="mr-1 text-[10px]"
                  />
                  {formData.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {formData.status === 'Open' ? (
                  <span>
                    Store is <strong className="text-[#064C23]">Open</strong>: Customers can place online delivery orders and visit this branch.
                  </span>
                ) : (
                  <span>
                    Store is <strong className="text-rose-600">Closed</strong>: Outlet is currently offline or under maintenance.
                  </span>
                )}
              </p>
            </div>
            <ToggleButton
              checked={formData.status === 'Open'}
              onChange={(isChecked) =>
                setFormData((prev) => ({
                  ...prev,
                  status: isChecked ? 'Open' : 'Closed',
                }))
              }
              activeColor="#064C23"
            />
          </div>

          {/* Bottom Form Actions */}
          <FormActions align="right">
            <Button
              type="button"
              variant="cancel"
              size="md"
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </FormActions>
        </form>
      </div>
    </div>
  )
}
