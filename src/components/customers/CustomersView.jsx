import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faMagnifyingGlass,
  faEnvelope,
  faPhone,
  faUserCheck,
  faStar,
  faRotateRight,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons'
import { useToast } from '../../context/ToastContext'
import Button from '../ui/Button'
import ActionButton from '../ui/ActionButton'

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98234 11223',
    ordersCount: 28,
    totalSpent: '$1,420.50',
    loyalty: 'Gold Member',
    joined: 'Jan 2025',
    status: 'Active',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    email: 'rahul.v@techmail.com',
    phone: '+91 97123 44556',
    ordersCount: 14,
    totalSpent: '$680.00',
    loyalty: 'Silver Member',
    joined: 'Mar 2025',
    status: 'Active',
    avatar: 'RV',
  },
  {
    id: 3,
    name: 'Ananya Roy',
    email: 'ananya.roy@web.in',
    phone: '+91 98450 67890',
    ordersCount: 42,
    totalSpent: '$2,890.20',
    loyalty: 'Platinum VIP',
    joined: 'Nov 2024',
    status: 'Active',
    avatar: 'AR',
  },
  {
    id: 4,
    name: 'Amit Patel',
    email: 'amit.patel@corphub.com',
    phone: '+91 99012 33445',
    ordersCount: 8,
    totalSpent: '$320.40',
    loyalty: 'Bronze Member',
    joined: 'Aug 2025',
    status: 'Active',
    avatar: 'AP',
  },
  {
    id: 5,
    name: 'Kavita Joshi',
    email: 'kavita.j@mail.com',
    phone: '+91 98765 12340',
    ordersCount: 19,
    totalSpent: '$940.80',
    loyalty: 'Gold Member',
    joined: 'Feb 2025',
    status: 'Active',
    avatar: 'KJ',
  },
]

export default function CustomersView() {
  const toast = useToast()
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  )

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Accounts Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Customer order histories, loyalty tier rewards, and contact information.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => toast.info('New Customer', 'Registration form modal ready.')}
            icon={<FontAwesomeIcon icon={faUserPlus} className="text-xs" />}
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Search Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064C23]/20 focus:border-[#064C23]"
            />
          </div>

          <span className="text-xs font-bold text-[#064C23] bg-[#f0f9f3] px-3 py-1.5 rounded-xl border border-[#bae2cb]">
            {filteredCustomers.length} Registered Customers
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Loyalty Tier</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Lifetime Spend</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#064C23] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {cust.avatar}
                        </div>
                        <span className="font-bold text-slate-800">{cust.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-0.5">
                      <div className="text-slate-800 font-medium">{cust.email}</div>
                      <div className="text-slate-400">{cust.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A44F37]/10 text-[#A44F37] border border-[#A44F37]/20">
                        <FontAwesomeIcon icon={faStar} className="mr-1 text-[10px]" />
                        {cust.loyalty}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {cust.ordersCount} orders
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      {cust.totalSpent}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {cust.joined}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                      <ActionButton
                        action="view"
                        onClick={() => toast.info('Customer Profile', `Viewing ${cust.name}'s profile...`)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-xs">
                    No customer matches your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
