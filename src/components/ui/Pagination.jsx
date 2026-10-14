import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight
} from '@fortawesome/free-solid-svg-icons'

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  showItemsPerPage = true,
  showSummary = true,
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems)

  // Generate page numbers window with ellipses
  const getPageNumbers = () => {
    const pages = []
    const delta = 1 // pages to show around current page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      const start = Math.max(2, safeCurrentPage - delta)
      const end = Math.min(totalPages - 1, safeCurrentPage + delta)

      if (start > 2) {
        pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const handlePageClick = (page) => {
    if (page === '...' || page === safeCurrentPage || page < 1 || page > totalPages) {
      return
    }
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 select-none ${className}`}
    >
      {/* Left: Summary Results & Items per page dropdown */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
        {showSummary && (
          <div>
            Showing <span className="font-bold text-slate-800">{startItem}</span> to{' '}
            <span className="font-bold text-slate-800">{endItem}</span> of{' '}
            <span className="font-bold text-slate-900">{totalItems}</span> results
          </div>
        )}

        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2 pl-2 sm:border-l sm:border-slate-200">
            <span className="text-slate-400">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 cursor-pointer transition-colors"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Navigation Controls */}
      <div className="flex items-center space-x-1.5">
        {/* First Page Button */}
        <button
          type="button"
          onClick={() => handlePageClick(1)}
          disabled={safeCurrentPage <= 1}
          title="First Page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          title="Previous Page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* Page Number Pills */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 font-bold"
                >
                  •••
                </span>
              )
            }

            const isActive = page === safeCurrentPage

            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageClick(page)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#064C23] text-white shadow-xs scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          title="Next Page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Last Page Button */}
        <button
          type="button"
          onClick={() => handlePageClick(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          title="Last Page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
    </div>
  )
}
