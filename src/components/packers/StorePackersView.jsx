import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBoxOpen,
  faBoxesPacking,
  faMagnifyingGlass,
  faRotateRight,
  faPhone,
  faEnvelope,
  faCheckCircle,
  faCircleCheck,
  faClock,
  faIdCard,
  faShieldHalved,
  faFilter,
  faTableList,
  faGripVertical,
  faStore,
  faUserTie
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import Pagination from '../ui/Pagination'
import { getStorePackersApi } from '../../utils/adminApi'

export default function StorePackersView({ currentUser }) {
  const toast = useToast()
  const [packers, setPackers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchPackers = async () => {
    setIsLoading(true)
    try {
      const res = await getStorePackersApi()
      if (res && res.packers) {
        setPackers(res.packers)
      }
    } catch (err) {
      console.warn('Could not load packers:', err)
      toast.error('Sync Error', 'Failed to refresh branch packers list.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPackers()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, roleFilter])

  const filteredPackers = packers.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q) ||
      p.fathersName?.toLowerCase().includes(q)

    const matchesRole =
      roleFilter === 'all' ||
      p.role?.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  const totalPages = Math.max(1, Math.ceil(filteredPackers.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const paginatedPackers = filteredPackers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  )

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Store Packers & In-Store Staff
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {packers.filter((p) => p.status === 'Active').length} Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {packers.length} Total Assigned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pickers and packers assigned by Admin to this branch for supermarket shelf picking and grocery bag packing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchPackers()
            toast.success('Sync Refreshed', 'Packers roster updated.')
          }}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <FontAwesomeIcon icon={faRotateRight} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Information Helper Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 text-xs text-slate-700 flex items-start space-x-3">
        <div className="w-7 h-7 rounded-lg bg-[#064C23] text-white flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-2xs">
          <FontAwesomeIcon icon={faBoxesPacking} />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-slate-900">How Order Packing Works (FMCG Workflow)</h4>
          <p className="text-slate-600">
            When customer orders arrive in the <strong>Orders</strong> queue, assign any verified branch packer. Once the items are picked from supermarket shelves, verified, and bagged, dispatch the order with a delivery rider.
          </p>
        </div>
      </div>

      {/* Toolbar: Search, Role Filter & View Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search packer name, phone, email, father's name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Role Filters & View Mode Switcher */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3 flex-wrap">
          <div className="flex items-center space-x-1.5 text-xs font-bold">
            <span className="text-slate-400 uppercase text-[10px] mr-1 hidden sm:inline">Role:</span>
            {['all', 'Order Packer', 'Order Picker', 'Order POC'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-[#064C23] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#064C23] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <FontAwesomeIcon icon={faTableList} className="text-xs" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#064C23] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards Grid View"
            >
              <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
              <span>Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table View vs Grid Cards */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-16">#</th>
                  <th className="px-6 py-4">Packer / Staff Details</th>
                  <th className="px-6 py-4">Role & Designation</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Assigned Store Hub</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedPackers.length > 0 ? (
                  paginatedPackers.map((packer, index) => {
                    const globalIndex = (safeCurrentPage - 1) * itemsPerPage + index + 1
                    const roleColor =
                      packer.role === 'Order Picker'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : packer.role === 'Order POC'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'

                    return (
                      <tr key={packer.id || packer._id} className="hover:bg-slate-50/75 transition-colors">
                        {/* Index */}
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">
                          #{globalIndex}
                        </td>

                        {/* Packer Name & Father */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#064C23] to-[#248149] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                              <FontAwesomeIcon icon={faBoxOpen} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">
                                {packer.name}
                              </span>
                              {packer.fathersName && (
                                <span className="text-[11px] text-slate-400 block font-medium">
                                  S/O {packer.fathersName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${roleColor}`}>
                            {packer.role || 'Order Packer'}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                          <a
                            href={`tel:${packer.phone}`}
                            className="inline-flex items-center space-x-1.5 hover:text-[#064C23] transition-colors"
                          >
                            <FontAwesomeIcon icon={faPhone} className="text-[#064C23] text-[10px]" />
                            <span>{packer.phone || 'N/A'}</span>
                          </a>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-xs text-slate-500">
                          <span className="inline-flex items-center space-x-1.5">
                            <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                            <span className="truncate max-w-[200px]">{packer.email || 'N/A'}</span>
                          </span>
                        </td>

                        {/* Assigned Store */}
                        <td className="px-6 py-4 text-xs text-slate-600">
                          <div className="inline-flex items-center space-x-1.5">
                            <FontAwesomeIcon icon={faStore} className="text-slate-400 text-xs" />
                            <span className="font-semibold">{packer.store?.name || currentUser?.storeName || 'Assigned Branch'}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                            {packer.status || 'Active'}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`tel:${packer.phone}`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#064C23] border border-slate-200 hover:border-emerald-200 transition-colors"
                          >
                            <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                            <span>Call</span>
                          </a>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-400 text-xs">
                      No packers found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={safeCurrentPage}
            totalItems={filteredPackers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit)
              setCurrentPage(1)
            }}
            itemsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div>
          {paginatedPackers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedPackers.map((packer) => (
                  <div
                    key={packer.id || packer._id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-[#064C23]/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#064C23] to-[#248149] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                          <FontAwesomeIcon icon={faBoxOpen} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-black text-slate-900 truncate">
                            {packer.name}
                          </h3>
                          {packer.fathersName && (
                            <span className="text-xs text-slate-400 block truncate">
                              S/O {packer.fathersName}
                            </span>
                          )}
                          <span className="inline-flex items-center text-[10px] font-black text-[#064C23] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-1">
                            {packer.role || 'Order Packer'}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                        {packer.status || 'Active'}
                      </span>
                    </div>

                    {/* Contact Details & Info */}
                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400 flex items-center space-x-1.5">
                          <FontAwesomeIcon icon={faPhone} className="text-[#064C23] text-[10px]" />
                          <span>Phone:</span>
                        </span>
                        <span className="font-mono font-bold">{packer.phone || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400 flex items-center space-x-1.5">
                          <FontAwesomeIcon icon={faEnvelope} className="text-slate-400 text-[10px]" />
                          <span>Email:</span>
                        </span>
                        <span className="truncate max-w-[180px]">{packer.email || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center space-x-2">
                      <a
                        href={`tel:${packer.phone}`}
                        className="flex-1 py-2 text-center rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#064C23] font-bold text-xs border border-slate-200 hover:border-emerald-200 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPhone} className="mr-1.5 text-[10px]" />
                        Call Packer
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for Card Grid */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
                <Pagination
                  currentPage={safeCurrentPage}
                  totalItems={filteredPackers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={(page) => setCurrentPage(page)}
                  onItemsPerPageChange={(limit) => {
                    setItemsPerPage(limit)
                    setCurrentPage(1)
                  }}
                  itemsPerPageOptions={[10, 20, 50, 100]}
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-2xl">
                <FontAwesomeIcon icon={faBoxOpen} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Packers Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || roleFilter !== 'all'
                  ? 'No packers match the current search filters.'
                  : 'There are no packers assigned to this dark store branch yet. Contact Super Admin to assign packers.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
