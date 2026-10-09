import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faLink,
  faArrowUpRightFromSquare,
  faArrowDown19,
  faCheckCircle,
  faCircleXmark,
  faImage,
  faPercent,
  faCopy
} from '@fortawesome/free-solid-svg-icons'
import { Button, BackButton } from '../index'
import { useToast } from '../../context/ToastContext'

export default function OfferDetailsView({ offer, onBack, onEdit }) {
  const toast = useToast()

  if (!offer) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
        <p className="text-slate-600 font-bold">Offer details not found.</p>
        <Button variant="primary" size="sm" onClick={onBack}>
          Back to Offers List
        </Button>
      </div>
    )
  }

  const handleCopyLink = () => {
    if (offer.redirectionUrl) {
      navigator.clipboard.writeText(offer.redirectionUrl)
      toast.success('Link Copied', 'Redirection URL copied to clipboard.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <BackButton onClick={onBack} />
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {offer.title}
              </h1>
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  offer.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={offer.status === 'Active' ? faCheckCircle : faCircleXmark}
                  className="text-[10px]"
                />
                <span>{offer.status}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Offer configuration, promotional banner preview, and redirection settings.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onEdit}
            icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
          >
            Edit Offer
          </Button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Banner Image (1.5:1) Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              BANNER PREVIEW (1.5:1)
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              3:2 RATIO
            </span>
          </div>

          <div className="relative aspect-[1.5/1] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shadow-xs">
            {offer.image ? (
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-2">
                <FontAwesomeIcon icon={faImage} className="text-3xl text-slate-300" />
                <p className="text-xs font-medium">No banner image uploaded</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Display Guidelines:</p>
            <p className="text-[11px] leading-relaxed">
              This banner renders across Bazario customer apps and storefront in 1.5:1 aspect ratio cards.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Information & Parameters */}
        <div className="lg:col-span-7 space-y-6">
          {/* Offer Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-3 border-b border-slate-100">
              Offer Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFER HEADLINE / TITLE
                </label>
                <p className="text-base font-extrabold text-slate-900 leading-snug">
                  {offer.title}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  REDIRECTION AT URL
                </label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 break-all flex-1">
                    {offer.redirectionUrl || '/'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Copy URL"
                  >
                    <FontAwesomeIcon icon={faCopy} className="text-xs" />
                  </button>
                  {offer.redirectionUrl && (
                    <a
                      href={offer.redirectionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#064C23]/10 hover:bg-[#064C23]/20 text-[#064C23] transition-colors"
                      title="Open Link"
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  SORTING ORDER
                </span>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faArrowDown19} className="text-slate-400 text-xs" />
                  <span className="text-base font-black text-slate-900 font-mono">
                    #{offer.sortingOrder || 1}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Priority rank</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFER STATUS
                </span>
                <span
                  className={`inline-block text-xs font-black uppercase px-2 py-0.5 rounded-md ${
                    offer.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {offer.status}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {offer.status === 'Active' ? 'Visible to shoppers' : 'Draft / Hidden'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  OFFER ID
                </span>
                <span className="text-base font-black text-slate-900 font-mono">
                  #{offer.id}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Database reference</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
