import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faPenToSquare,
  faTrashCan,
  faFloppyDisk,
  faEye,
  faGlobe,
  faArrowLeft,
  faUserTie,
  faIndianRupeeSign
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  AlertModal,
  BackButton
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_JOBS = [
  {
    id: 1,
    sortingOrder: 1,
    title: 'Store Operations Manager',
    subtitle: 'Retail Operations & Branch Leadership',
    type: 'Full Time',
    experience: '3 - 5 Years',
    location: 'Central Superstore, Noida (Sec 18)',
    status: 'Active',
    salary: '₹45,000 - ₹60,000 / mo',
    description: 'Responsible for day-to-day supermarket branch operations, inventory audits, team leadership, and customer satisfaction.',
    seoTitle: 'Career Opportunity: Store Operations Manager at Bazario Supermarket',
    seoKeywords: 'retail operations, store manager, supermarket careers, bazario jobs',
    seoDescription: 'Join Bazario as Store Operations Manager in Noida. Lead grocery retail operations with competitive pay and growth opportunities.'
  },
  {
    id: 2,
    sortingOrder: 2,
    title: 'POS Cashier & Billing Executive',
    subtitle: 'Front Desk & Cash Management',
    type: 'Full Time',
    experience: '1 - 2 Years',
    location: 'DLF Cyber City Outlet, Gurugram',
    status: 'Active',
    salary: '₹18,000 - ₹24,000 / mo',
    description: 'Handling fast-paced supermarket barcode scanning, cash and UPI POS terminals, and friendly customer checkout bagging.',
    seoTitle: 'POS Cashier Jobs at Bazario Gurugram',
    seoKeywords: 'cashier jobs, billing executive, retail cashier, gurugram jobs',
    seoDescription: 'Urgent hiring for POS Cashier and Billing Executives at Bazario Superstore in Gurugram.'
  },
  {
    id: 3,
    sortingOrder: 3,
    title: 'Fresh Procurement Lead',
    subtitle: 'Farm Produce & Sourcing Quality',
    type: 'Full Time',
    experience: '4+ Years',
    location: 'Delhi Central Hub',
    status: 'Active',
    salary: '₹50,000 - ₹70,000 / mo',
    description: 'Direct procurement from farmers and local mandis to maintain grade-A freshness standards across all branches.',
    seoTitle: 'Fresh Produce Procurement Lead - Bazario Supply Chain',
    seoKeywords: 'procurement lead, farm sourcing, agricultural supply chain jobs',
    seoDescription: 'Manage farm produce sourcing and quality verification across North India at Bazario Hub.'
  },
  {
    id: 4,
    sortingOrder: 4,
    title: 'Express Delivery Partner',
    subtitle: '20-Minute Doorstep Fleet',
    type: 'Part Time',
    experience: 'Freshers Welcome',
    location: 'Multiple Outlets (Delhi NCR)',
    status: 'Active',
    salary: '₹20,000 - ₹30,000 / mo',
    description: 'Timely 20-minute grocery home delivery with two-wheeler bike and valid driver license.',
    seoTitle: 'Express Grocery Delivery Partner Jobs - Bazario Fleet',
    seoKeywords: 'delivery partner jobs, bike rider jobs, part time delivery, delhi ncr jobs',
    seoDescription: 'Earn daily with flexible shifts as a Bazario 20-minute express grocery delivery partner in Delhi NCR.'
  },
  {
    id: 5,
    sortingOrder: 5,
    title: 'Inventory & Stock Supervisor',
    subtitle: 'Warehouse & Shelf Replenishment',
    type: 'Full Time',
    experience: '2 - 3 Years',
    location: 'Indirapuram Branch, Ghaziabad',
    status: 'Inactive',
    salary: '₹25,000 - ₹32,000 / mo',
    description: 'Verifying FMCG expiry dates, barcode labeling, shelf replenishment, and cold storage monitoring.',
    seoTitle: 'Supermarket Inventory Supervisor Job in Ghaziabad',
    seoKeywords: 'inventory supervisor, warehouse stock management, grocery retail',
    seoDescription: 'Supervise supermarket stock replenishment, expiry audits, and warehouse inwarding at Bazario.'
  }
]

export default function CareerManageView() {
  const toast = useToast()

  // State: Careers list
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('bazario_web_careers')
      return saved ? JSON.parse(saved) : INITIAL_JOBS
    } catch {
      return INITIAL_JOBS
    }
  })

  // Page Routing Mode: 'index' | 'add' | 'edit' | 'view' (No popups!)
  const [pageMode, setPageMode] = useState('index')
  const [activeJob, setActiveJob] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Delete Alert Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)

  // Form State (Inputs: sortingOrder, title, subtitle, type, experience, location, status, salary, description, seoTitle, seoKeywords, seoDescription)
  const [formData, setFormData] = useState({
    sortingOrder: 1,
    title: '',
    subtitle: '',
    type: 'Full Time',
    experience: '',
    location: '',
    status: 'Active',
    salary: '',
    description: '',
    seoTitle: '',
    seoKeywords: '',
    seoDescription: ''
  })

  const saveToStorage = (updated) => {
    setJobs(updated)
    localStorage.setItem('bazario_web_careers', JSON.stringify(updated))
  }

  // Open Dedicated Add Page
  const handleOpenAdd = () => {
    const nextOrder = jobs.length > 0 ? Math.max(...jobs.map((j) => Number(j.sortingOrder) || 0)) + 1 : 1
    setActiveJob(null)
    setFormData({
      sortingOrder: nextOrder,
      title: '',
      subtitle: '',
      type: 'Full Time',
      experience: '',
      location: '',
      status: 'Active',
      salary: '',
      description: '',
      seoTitle: '',
      seoKeywords: '',
      seoDescription: ''
    })
    setPageMode('add')
  }

  // Open Dedicated Edit Page
  const handleOpenEdit = (job) => {
    setActiveJob(job)
    setFormData({
      sortingOrder: job.sortingOrder || 1,
      title: job.title || '',
      subtitle: job.subtitle || '',
      type: job.type || 'Full Time',
      experience: job.experience || '',
      location: job.location || '',
      status: job.status || 'Active',
      salary: job.salary || '',
      description: job.description || '',
      seoTitle: job.seoTitle || '',
      seoKeywords: job.seoKeywords || '',
      seoDescription: job.seoDescription || ''
    })
    setPageMode('edit')
  }

  // Open Dedicated View Page
  const handleOpenView = (job) => {
    setActiveJob(job)
    setPageMode('view')
  }

  // Toggle Status inline
  const handleToggleStatus = (job) => {
    const nextStatus = job.status === 'Active' ? 'Inactive' : 'Active'
    const updated = jobs.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
    saveToStorage(updated)
    toast.info('Status Updated', `"${job.title}" is now ${nextStatus}.`)
  }

  // Form Submit (Create / Update)
  const handleSubmit = (e) => {
    e?.preventDefault?.()

    if (!formData.title?.trim()) {
      toast.error('Validation Error', 'Job Title is required.')
      return
    }

    const orderNum = parseInt(formData.sortingOrder, 10) || 1

    if (pageMode === 'edit' && activeJob) {
      const updated = jobs.map((j) =>
        j.id === activeJob.id
          ? {
              ...j,
              ...formData,
              sortingOrder: orderNum,
              title: formData.title.trim()
            }
          : j
      )
      saveToStorage(updated)
      toast.success('Career Updated', `"${formData.title}" details updated.`)
      setPageMode('index')
      setActiveJob(null)
    } else if (pageMode === 'add') {
      const newJob = {
        id: Date.now(),
        ...formData,
        sortingOrder: orderNum,
        title: formData.title.trim()
      }
      saveToStorage([...jobs, newJob])
      toast.success('Career Published', `"${formData.title}" added to career openings.`)
      setPageMode('index')
    }
  }

  // Delete Confirm
  const handleDeleteConfirm = () => {
    if (!jobToDelete) return
    const updated = jobs.filter((j) => j.id !== jobToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setItemToDelete(null)
    toast.success('Career Deleted', 'The job vacancy has been permanently removed.')
    if (pageMode === 'view' || pageMode === 'edit') {
      setPageMode('index')
      setActiveJob(null)
    }
  }

  // Filtered and sorted list
  const filteredJobs = jobs
    .filter((job) => {
      const q = searchQuery.toLowerCase()
      return (
        job.title?.toLowerCase().includes(q) ||
        job.subtitle?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.type?.toLowerCase().includes(q) ||
        job.experience?.toLowerCase().includes(q) ||
        job.salary?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => (Number(a.sortingOrder) || 0) - (Number(b.sortingOrder) || 0))

  return (
    <div className="space-y-6 w-full pb-20">
      {/* ==========================================================
          PAGE 1: INDEX / LIST PAGE
          ========================================================== */}
      {pageMode === 'index' && (
        <>
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Carrier Manage
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {jobs.filter((j) => j.status === 'Active').length} Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage website career listings, sorting order, job roles, experience, locations, salaries, and SEO meta.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleOpenAdd}
              icon={<FontAwesomeIcon icon={faPlus} className="text-xs" />}
            >
              Post New Vacancy
            </Button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, subtitle, location, experience..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none transition-all"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-3.5 text-slate-400 text-xs"
              />
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 w-28 text-center">Sorting Order</th>
                    <th className="px-6 py-4 min-w-[240px]">Job Title & Subtitle</th>
                    <th className="px-6 py-4">Type & Exp</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Sallary</th>
                    <th className="px-6 py-4 w-28">Status</th>
                    <th className="px-6 py-4 text-right w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 font-mono font-black text-xs text-[#064C23] border border-slate-200 shadow-2xs">
                            #{job.sortingOrder || 1}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {job.title}
                            </span>
                            {job.subtitle && (
                              <span className="text-xs text-slate-500 block mt-0.5">
                                {job.subtitle}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                              {job.type}
                            </span>
                            {job.experience && (
                              <span className="text-[11px] text-slate-500 font-semibold block">
                                Exp: {job.experience}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-700">
                          <div className="flex items-center space-x-1.5">
                            <FontAwesomeIcon icon={faLocationDot} className="text-[#A44F37] text-xs" />
                            <span>{job.location || 'All Outlets'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900">
                          {job.salary || 'Not specified'}
                        </td>

                        <td className="px-6 py-4">
                          <ToggleButton
                            size="sm"
                            checked={job.status === 'Active'}
                            onChange={() => handleToggleStatus(job)}
                            activeColor="#064C23"
                          />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <ActionButton
                              action="view"
                              tooltip="View Details"
                              onClick={() => handleOpenView(job)}
                            />
                            <ActionButton
                              action="edit"
                              tooltip="Edit Career"
                              onClick={() => handleOpenEdit(job)}
                            />
                            <ActionButton
                              action="delete"
                              tooltip="Delete Career"
                              onClick={() => {
                                setJobToDelete(job)
                                setDeleteModalOpen(true)
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No matching career openings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ==========================================================
          PAGE 2 & 3: DEDICATED ADD / EDIT FULL PAGE (NO POPUPS)
          ========================================================== */}
      {(pageMode === 'add' || pageMode === 'edit') && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {pageMode === 'add' ? 'Post New Career Opening' : 'Edit Career Opening'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Configure job title, subtitle, type, experience, location, status, sallary, and SEO meta.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
              >
                {pageMode === 'add' ? 'Publish Vacancy' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            {/* Row 1: Sorting Order & Status Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <InputField
                  label="SORTING ORDER"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.sortingOrder}
                  onChange={(e) => setFormData({ ...formData, sortingOrder: e.target.value })}
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Row 2: Job Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="JOB TITLE"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Store Operations Manager"
                required
              />
              <InputField
                label="SUUBTITLE"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Retail Operations & Branch Leadership"
              />
            </div>

            {/* Row 3: Type, Experience, Location, Sallary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  TYPE
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all cursor-pointer"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <InputField
                  label="EXPERIENCE"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 2 - 4 Years"
                />
              </div>

              <div>
                <InputField
                  label="LOCATION"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector 18, Noida"
                />
              </div>

              <div>
                <InputField
                  label="SALLARY"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. ₹25,000 - ₹35,000 / mo"
                />
              </div>
            </div>

            {/* Row 4: Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                DESCRIPTION
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
                placeholder="Detailed description of role duties, responsibilities, and requirements..."
              />
            </div>

            {/* Row 5: SEO Meta Inputs */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#064C23]">
                <FontAwesomeIcon icon={faGlobe} />
                <span>SEO Meta Configuration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="SEO META TITLE"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="e.g. Careers at Bazario - Store Operations Manager"
                  helperText="Appears in Google search results and browser title tab"
                />
                <InputField
                  label="SEO KEYWORDS"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  placeholder="e.g. grocery jobs, supermarket manager, retail careers"
                  helperText="Comma separated target keywords"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  SEO META DESCRIPTION
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 transition-all"
                  placeholder="Meta summary shown beneath the title in search engine result snippets..."
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" size="md" onClick={() => setPageMode('index')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}>
                {pageMode === 'add' ? 'Publish Vacancy' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================================
          PAGE 4: DEDICATED VIEW DETAILS FULL PAGE (NO POPUPS)
          ========================================================== */}
      {pageMode === 'view' && activeJob && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BackButton onClick={() => setPageMode('index')} />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {activeJob.title}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeJob.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {activeJob.status}
                  </span>
                </div>
                {activeJob.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold">{activeJob.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleOpenEdit(activeJob)}
                icon={<FontAwesomeIcon icon={faPenToSquare} className="text-xs" />}
              >
                Edit Vacancy
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  setJobToDelete(activeJob)
                  setDeleteModalOpen(true)
                }}
                icon={<FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Overview Grid Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Sorting Order</span>
                <p className="text-lg font-black font-mono text-[#064C23]">#{activeJob.sortingOrder || 1}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Employment Type</span>
                <p className="text-sm font-bold text-slate-900">{activeJob.type}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Experience</span>
                <p className="text-sm font-bold text-slate-900">{activeJob.experience || 'Not specified'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Location Branch</span>
                <p className="text-sm font-bold text-slate-900">{activeJob.location || 'All Outlets'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Sallary</span>
                <p className="text-sm font-mono font-bold text-slate-900">{activeJob.salary || 'Not specified'}</p>
              </div>
            </div>

            {/* Description Section */}
            {activeJob.description && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Role Description & Requirements
                </span>
                <p className="text-sm font-medium text-slate-800 whitespace-pre-line leading-relaxed">
                  {activeJob.description}
                </p>
              </div>
            )}

            {/* SEO Section */}
            {(activeJob.seoTitle || activeJob.seoKeywords || activeJob.seoDescription) && (
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-black text-[#064C23] uppercase">
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>Configured SEO Metadata</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeJob.seoTitle && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Meta Title</span>
                      <p className="text-xs font-semibold text-slate-800">{activeJob.seoTitle}</p>
                    </div>
                  )}
                  {activeJob.seoKeywords && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Keywords</span>
                      <p className="text-xs font-mono text-slate-700">{activeJob.seoKeywords}</p>
                    </div>
                  )}
                </div>
                {activeJob.seoDescription && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Meta Description</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{activeJob.seoDescription}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================================
          DELETE ALERT MODAL
          ========================================================== */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting?"
        message={`Are you sure you want to permanently delete "${jobToDelete?.title}"?`}
        confirmText="Delete Posting"
        type="danger"
      />
    </div>
  )
}
