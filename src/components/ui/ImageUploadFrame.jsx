import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp, faTrashCan, faImage, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

export default function ImageUploadFrame({
  value,
  onChange,
  label = 'Product Image',
  description = 'PNG, JPG, WEBP up to 5MB',
  aspectRatio = 'square', // 'square' | 'video' | 'banner' | 'auto'
  className = '',
  maxSizeMB = 5,
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(value || null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const aspectClasses = {
    square: 'aspect-square max-w-[260px]',
    video: 'aspect-video max-w-md',
    banner: 'aspect-[3/1] max-w-xl',
    auto: 'min-h-[180px]',
  }

  const handleFileChange = (file) => {
    setError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxSizeMB}MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      setPreview(result)
      if (onChange) onChange(result, file)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    setPreview(null)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (onChange) onChange(null, null)
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full ${aspectClasses[aspectRatio] || aspectClasses.square} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' : ''
        } ${
          isDragging
            ? 'border-[#064C23] bg-[#064C23]/5 scale-[1.01]'
            : preview
            ? 'border-slate-200 bg-slate-50 hover:border-slate-300'
            : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50 hover:border-[#064C23]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => handleFileChange(e.target.files?.[0])}
          className="sr-only"
        />

        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-full object-cover rounded-xl"
            />
            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110"
                title="Change Image"
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-sm shadow-md transition-transform hover:scale-110"
                title="Remove Image"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 space-y-2 select-none">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-lg mb-1">
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Click to upload <span className="text-slate-400 font-normal">or drag & drop</span>
              </p>
              {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  )
}
