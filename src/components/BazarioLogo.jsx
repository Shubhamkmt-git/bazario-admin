import React from 'react'

export default function BazarioLogo({ className = "w-full max-w-lg", sticker = true }) {
  return (
    <div className={`relative select-none ${sticker ? 'filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]' : ''} ${className}`}>
      <svg
        viewBox="0 0 950 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* White outline / sticker shadow filter */}
          <filter id="white-sticker" x="-10%" y="-10%" width="120%" height="120%">
            <feMorphology operator="dilate" radius="10" in="SourceAlpha" result="dilated" />
            <feFlood floodColor="#ffffff" result="white" />
            <feComposite in="white" in2="dilated" operator="in" result="outline" />
            <feMerge>
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#white-sticker)">
          {/* SPROUTING LEAVES ON TOP OF CART */}
          {/* Left Leaf */}
          <path
            d="M148 42 C132 20 150 2 170 20 C182 32 175 52 148 42 Z"
            fill="#A44F37"
          />
          {/* Right Leaf */}
          <path
            d="M172 40 C194 15 215 32 195 50 C182 60 162 52 172 40 Z"
            fill="#A44F37"
          />

          {/* SHOPPING CART 'B' */}
          {/* Handle */}
          <rect x="30" y="85" width="80" height="24" rx="12" fill="#A44F37" />

          {/* Main 'B' Body */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60 90 H170 C215 90 235 110 235 142 C235 160 220 178 198 186 C225 195 240 216 240 242 C240 280 208 300 162 300 H60 V90 Z M115 130 V172 H160 C178 172 188 162 188 151 C188 140 178 130 160 130 H115 Z M115 212 V260 H165 C185 260 195 248 195 236 C195 224 185 212 165 212 H115 Z"
            fill="#A44F37"
          />

          {/* Cart Wheels */}
          <circle cx="100" cy="335" r="22" fill="#A44F37" />
          <circle cx="185" cy="335" r="22" fill="#A44F37" />

          {/* TEXT "azario" */}
          {/* Letter 'a' */}
          <path
            d="M275 225 C275 190 300 170 338 170 C375 170 398 190 398 225 V298 H365 V280 C356 295 340 303 322 303 C295 303 275 285 275 258 C275 230 295 214 332 210 L365 206 V198 C365 186 354 178 338 178 C322 178 310 186 308 198 H275 Z M365 232 L338 235 C318 237 308 245 308 258 C308 270 318 278 332 278 C352 278 365 264 365 246 V232 Z"
            fill="#064C23"
          />

          {/* Letter 'z' */}
          <path
            d="M410 175 H470 V200 L438 270 H472 V300 H408 V275 L440 205 H410 V175 Z"
            fill="#064C23"
          />

          {/* Letter 'a' (2nd) */}
          <path
            d="M482 225 C482 190 507 170 545 170 C582 170 605 190 605 225 V298 H572 V280 C563 295 547 303 529 303 C502 303 482 285 482 258 C482 230 502 214 539 210 L572 206 V198 C572 186 561 178 545 178 C529 178 517 186 515 198 H482 Z M572 232 L545 235 C525 237 515 245 515 258 C515 270 525 278 539 278 C559 278 572 264 572 246 V232 Z"
            fill="#064C23"
          />

          {/* Letter 'r' */}
          <path
            d="M620 175 H650 V205 C658 185 675 172 695 172 V208 C672 208 652 222 652 250 V300 H620 V175 Z"
            fill="#064C23"
          />

          {/* Letter 'i' with Dot */}
          <circle cx="725" cy="140" r="17" fill="#064C23" />
          <rect x="710" y="175" width="30" height="125" rx="4" fill="#064C23" />

          {/* Letter 'o' */}
          <path
            d="M758 238 C758 198 788 170 828 170 C868 170 898 198 898 238 C898 278 868 305 828 305 C788 305 758 278 758 238 Z M864 238 C864 212 848 196 828 196 C808 196 792 212 792 238 C792 263 808 279 828 279 C848 279 864 263 864 238 Z"
            fill="#064C23"
          />

          {/* TAGLINE: Bill Halka, Dil Halka */}
          <text
            x="275"
            y="350"
            fill="#064C23"
            fontFamily="'Roboto', sans-serif"
            fontSize="38"
            fontWeight="800"
            letterSpacing="-0.5"
          >
            Bill Halka, Dil Halka
          </text>
        </g>
      </svg>
    </div>
  )
}
