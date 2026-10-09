import React from 'react'

export default function BazarioLogo({ className = "w-full max-w-lg", sticker = true }) {
  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="Bazario - Bill Halka, Dil Halka"
        className={`w-full h-auto object-contain transition-transform duration-300 ${
          sticker ? 'drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]' : ''
        }`}
        draggable="false"
      />
    </div>
  )
}
