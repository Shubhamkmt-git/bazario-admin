import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore,
  faLocationDot,
  faMapLocationDot,
  faPhone,
  faClock,
  faSort,
  faCompass,
  faDoorOpen,
  faDoorClosed,
  faCopy,
  faPenToSquare,
  faTrashCan,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import BackButton from '../ui/BackButton'

// Utility to open Google Maps safely in new tab
const openGoogleMaps = (googleUrl, coordinates, title = '') => {
  let targetUrl = googleUrl ? googleUrl.trim() : ''
  if (!targetUrl && coordinates) {
    targetUrl = `https://maps.google.com/?q=${encodeURIComponent(coordinates.trim())}`
  } else if (!targetUrl && title) {
    targetUrl = `https://maps.google.com/?q=${encodeURIComponent(title.trim())}`
  }

  if (targetUrl) {
    const finalUrl = targetUrl.startsWith('http://') || targetUrl.startsWith('https://')
      ? targetUrl
      : `https://${targetUrl}`
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  }
}

export default function StoreDetailsView({
  store,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const toast = useToast()

  if (!store) return null

  const handleCopyCoordinates = (coords) => {
    if (!coords) return
    navigator.clipboard.writeText(coords)
    toast.success('Copied', `Coordinates "${coords}" copied to clipboard!`)
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
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064C23]">
                Store Details
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Order #{store.sortingOrder || 1}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  store.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={store.status === 'Open' ? faDoorOpen : faDoorClosed}
                  className="mr-1 text-[10px]"
                />
                {store.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {store.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(store)}
            icon={
              <FontAwesomeIcon
                icon={store.status === 'Open' ? faDoorClosed : faDoorOpen}
                className="text-xs"
              />
            }
          >
            Mark as {store.status === 'Open' ? 'Closed' : 'Open'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(store)}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Store
          </Button>
          <Button
            variant="cancel"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 border-rose-200"
            onClick={() => onDelete(store)}
            icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Full-width Details Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top Banner Image with Live Overlay */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={store.image || '/supermart-bg.jpg'}
            alt={store.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2 mb-1">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#A44F37] text-white shadow-xs">
                  <FontAwesomeIcon icon={faStore} className="mr-1.5 text-[11px]" />
                  Bazario Supermarket
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-white/20 text-white backdrop-blur-xs">
                  Priority #{store.sortingOrder || 1}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">{store.title}</h2>
              <p className="text-sm text-slate-200">{store.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => openGoogleMaps(store.googleUrl, store.coordinates, store.title)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-[#064C23] rounded-2xl text-xs font-extrabold transition-all shadow-lg self-start md:self-auto shrink-0 cursor-pointer group active:scale-95"
            >
              <FontAwesomeIcon icon={faMapLocationDot} className="text-sm text-[#A44F37]" />
              <span>Navigate via Google Maps</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Grid Overview of Store Metadata */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: GPS Coordinates */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">GPS Coordinates</span>
                <button
                  type="button"
                  onClick={() => handleCopyCoordinates(store.coordinates)}
                  className="text-xs text-[#064C23] hover:underline font-bold cursor-pointer inline-flex items-center space-x-1"
                  title="Copy coordinates"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-[10px]" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="font-mono text-base font-bold text-slate-900">
                {store.coordinates || 'Not configured'}
              </p>
              <p className="text-[11px] text-slate-500">Precise map coordinates</p>
            </div>

            {/* Card 2: Contact Phone */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Store Contact</span>
                <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {store.phone || 'Not available'}
              </p>
              <p className="text-[11px] text-slate-500">Helpline / counter phone</p>
            </div>

            {/* Card 3: Operating Hours */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Opening Hours</span>
                <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {store.operatingHours || '7:00 AM - 11:00 PM'}
              </p>
              <p className="text-[11px] text-slate-500">Daily business schedule</p>
            </div>

            {/* Card 4: Sorting Order & Priority */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">Display Order</span>
                <FontAwesomeIcon icon={faSort} className="text-[#064C23] text-xs" />
              </div>
              <p className="text-base font-bold text-slate-900 font-mono">
                #{store.sortingOrder || 1}
              </p>
              <p className="text-[11px] text-slate-500">App listing sequence</p>
            </div>
          </div>

          {/* Google Maps Location Preview Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCompass} className="text-[#064C23]" />
                  <span>Google Maps Destination URL</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Hyperlink for customer directions and rider delivery navigation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openGoogleMaps(store.googleUrl, store.coordinates, store.title)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#064C23] hover:bg-[#08632f] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xs" />
                <span>Open in Maps</span>
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 break-all select-all flex items-center justify-between gap-3">
              <span className="truncate">{store.googleUrl || `https://maps.google.com/?q=${encodeURIComponent(store.coordinates || store.title)}`}</span>
              <button
                type="button"
                onClick={() => {
                  const link = store.googleUrl || (store.coordinates ? `https://maps.google.com/?q=${encodeURIComponent(store.coordinates)}` : '')
                  if (link) {
                    navigator.clipboard.writeText(link)
                    toast.success('Copied URL', 'Google Maps link copied to clipboard!')
                  }
                }}
                className="text-xs font-bold text-[#064C23] hover:underline shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
