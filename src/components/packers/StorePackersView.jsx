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
  faFilter
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import { getStorePackersApi } from '../../utils/adminApi'

export default function StorePackersView({ currentUser }) {
  const toast = useToast()
  const [packers, setPackers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

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

  const filteredPackers = packers.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q)

    const matchesRole =
      roleFilter === 'all' ||
      p.role?.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faBoxOpen} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
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
            <p className="text-xs sm:text-sm text-slate-500">
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
          <h4 className="font-bold text-slate-900">How Order Packing Works</h4>
          <p className="text-slate-600">
            When customer orders arrive in the <strong>Orders</strong> queue, click <strong>"Accept & Pack"</strong> to assign any of these verified branch packers. Once the items are bagged and ready, dispatch the order with a delivery rider.
          </p>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search packer name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#064C23] focus:ring-2 focus:ring-[#064C23]/10 transition-all"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs font-bold">
          <span className="text-slate-400 uppercase text-[10px] mr-1">Filter Role:</span>
          {['all', 'Order Packer', 'Order Picker'].map((r) => (
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
      </div>

      {/* Packers Cards Grid */}
      {filteredPackers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackers.map((packer) => (
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
  )
}
