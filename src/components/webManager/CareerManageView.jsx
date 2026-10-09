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
  faIndianRupeeSign,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ActionButton,
  ToggleButton,
  InputField,
  Modal,
  AlertModal
} from '../../components'
import { useToast } from '../../context/ToastContext'

const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Store Operations Manager',
    subtitle: 'Retail Operations & Branch Leadership',
    type: 'Full Time',
    location: 'Central Superstore, Noida (Sec 18)',
    status: 'Active',
    salary: '₹45,000 - ₹60,000 / mo',
    description: 'Responsible for day-to-day supermarket branch operations, inventory audits, team leadership, and customer satisfaction.'
  },
  {
    id: 2,
    title: 'POS Cashier & Billing Executive',
    subtitle: 'Front Desk & Cash Management',
    type: 'Full Time',
    location: 'DLF Cyber City Outlet, Gurugram',
    status: 'Active',
    salary: '₹18,000 - ₹24,000 / mo',
    description: 'Handling fast-paced supermarket barcode scanning, cash and UPI POS terminals, and friendly customer checkout bagging.'
  },
  {
    id: 3,
    title: 'Fresh Procurement Lead',
    subtitle: 'Farm Produce & Sourcing Quality',
    type: 'Full Time',
    location: 'Delhi Central Hub',
    status: 'Active',
    salary: '₹50,000 - ₹70,000 / mo',
    description: 'Direct procurement from farmers and local mandis to maintain grade-A freshness standards across all branches.'
  },
  {
    id: 4,
    title: 'Express Delivery Partner',
    subtitle: '20-Minute Doorstep Fleet',
    type: 'Part Time',
    location: 'Multiple Outlets (Delhi NCR)',
    status: 'Active',
    salary: '₹20,000 - ₹30,000 / mo',
    description: 'Timely 20-minute grocery home delivery with two-wheeler bike and valid driver license.'
  },
  {
    id: 5,
    title: 'Inventory & Stock Supervisor',
    subtitle: 'Warehouse & Shelf Replenishment',
    type: 'Full Time',
    location: 'Indirapuram Branch, Ghaziabad',
    status: 'Inactive',
    salary: '₹25,000 - ₹32,000 / mo',
    description: 'Verifying FMCG expiry dates, barcode labeling, shelf replenishment, and cold storage monitoring.'
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

  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewingJob, setViewingJob] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)

  // Form State (Inputs: job title, suubtitle, type, location, status, sallary, description)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'Full Time',
    location: '',
    status: 'Active',
    salary: '',
    description: ''
  })

  const saveToStorage = (updated) => {
    setJobs(updated)
    localStorage.setItem('bazario_web_careers', JSON.stringify(updated))
  }

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingJob(null)
    setFormData({
      title: '',
      subtitle: '',
      type: 'Full Time',
      location: '',
      status: 'Active',
      salary: '',
      description: ''
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title || '',
      subtitle: job.subtitle || '',
      type: job.type || 'Full Time',
      location: job.location || '',
      status: job.status || 'Active',
      salary: job.salary || '',
      description: job.description || ''
    })
    setModalOpen(true)
  }

  // Open View Modal
  const handleOpenView = (job) => {
    setViewingJob(job)
    setViewModalOpen(true)
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

    if (editingJob) {
      const updated = jobs.map((j) =>
        j.id === editingJob.id ? { ...j, ...formData } : j
      )
      saveToStorage(updated)
      toast.success('Career Updated', `"${formData.title}" details updated.`)
    } else {
      const newJob = {
        id: Date.now(),
        ...formData
      }
      saveToStorage([...jobs, newJob])
      toast.success('Career Published', `"${formData.title}" added to career openings.`)
    }
    setModalOpen(false)
  }

  // Delete Confirm
  const handleDeleteConfirm = () => {
    if (!jobToDelete) return
    const updated = jobs.filter((j) => j.id !== jobToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setJobToDelete(null)
    toast.success('Career Deleted', 'The job vacancy has been permanently removed.')
  }

  // Filtered list
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase()
    return (
      job.title?.toLowerCase().includes(q) ||
      job.subtitle?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q) ||
      job.type?.toLowerCase().includes(q) ||
      job.salary?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 w-full pb-20">
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
              Manage website career listings, job roles, locations, salaries, and employment types.
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
            placeholder="Search job title, subtitle, location, or type..."
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
                <th className="px-6 py-4 w-16">Index</th>
                <th className="px-6 py-4 min-w-[240px]">Job Title & Subtitle</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Sallary</th>
                <th className="px-6 py-4 w-28">Status</th>
                <th className="px-6 py-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <tr key={job.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400 font-mono">
                      #{index + 1}
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
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {job.type}
                      </span>
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

      {/* ==========================================================
          ADD / EDIT MODAL (INPUTS: JOB TITLE, SUUBTITLE, TYPE, LOCATION, STATUS, SALLARY, DESCRIPTION)
          ========================================================== */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Career Opening' : 'Post New Career Opening'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Job Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Row 2: Type, Location, Status, Sallary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                label="LOCATION"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Sector 18, Noida"
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

            <div>
              <InputField
                label="SALLARY"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. ₹25,000 - ₹35,000 / mo"
              />
            </div>
          </div>

          {/* Row 3: Description */}
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

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}>
              {editingJob ? 'Save Changes' : 'Publish Job'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==========================================================
          VIEW DETAILS MODAL
          ========================================================== */}
      {viewingJob && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Career Details"
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{viewingJob.title}</h3>
                {viewingJob.subtitle && (
                  <p className="text-xs font-semibold text-slate-500">{viewingJob.subtitle}</p>
                )}
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  viewingJob.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {viewingJob.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Type</span>
                <p className="text-xs font-bold text-slate-800">{viewingJob.type}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Location</span>
                <p className="text-xs font-bold text-slate-800">{viewingJob.location || 'All Outlets'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5 col-span-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Sallary</span>
                <p className="text-sm font-mono font-bold text-slate-900">{viewingJob.salary || 'Not specified'}</p>
              </div>
            </div>

            {viewingJob.description && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Description</span>
                <p className="text-xs font-medium text-slate-700 whitespace-pre-line leading-relaxed">
                  {viewingJob.description}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Alert */}
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
