import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faPlus,
  faMagnifyingGlass,
  faFilter,
  faLocationDot,
  faClock,
  faIndianRupeeSign,
  faUsers,
  faPenToSquare,
  faTrashCan,
  faFloppyDisk,
  faBuilding
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
    department: 'Retail Operations',
    location: 'Central Superstore, Noida (Sec 18)',
    type: 'Full Time',
    salary: '₹45,000 - ₹60,000 / mo',
    experience: '3 - 5 Years',
    applicants: 18,
    status: 'Active',
    description: 'Responsible for day-to-day supermarket branch operations, inventory audits, and customer experience.'
  },
  {
    id: 2,
    title: 'POS Cashier & Billing Executive',
    department: 'Front Desk & Cash',
    location: 'DLF Cyber City Outlet, Gurugram',
    type: 'Full Time',
    salary: '₹18,000 - ₹24,000 / mo',
    experience: '1 - 2 Years',
    applicants: 42,
    status: 'Active',
    description: 'Handling fast-paced supermarket barcode scanning, cash and UPI POS terminals, and customer bagging.'
  },
  {
    id: 3,
    title: 'Fresh Fruits & Vegetables Procurement Lead',
    department: 'Supply Chain & Sourcing',
    location: 'Delhi Central Hub',
    type: 'Full Time',
    salary: '₹50,000 - ₹70,000 / mo',
    experience: '4+ Years',
    applicants: 9,
    status: 'Active',
    description: 'Direct procurement from farmers and APMC mandis to maintain grade-A freshness across all branches.'
  },
  {
    id: 4,
    title: 'Express Grocery Delivery Partner',
    department: 'Logistics & Fleet',
    location: 'Multiple Outlets (Delhi NCR)',
    type: 'Part Time',
    salary: '₹20,000 - ₹30,000 / mo',
    experience: 'Freshers Welcome',
    applicants: 64,
    status: 'Active',
    description: 'Timely 20-minute grocery home delivery with two-wheeler bike and valid driver license.'
  },
  {
    id: 5,
    title: 'Inventory & Stock Inward Supervisor',
    department: 'Warehouse & Quality',
    location: 'Indirapuram Branch, Ghaziabad',
    type: 'Full Time',
    salary: '₹25,000 - ₹32,000 / mo',
    experience: '2 - 3 Years',
    applicants: 15,
    status: 'Closed',
    description: 'Verifying FMCG expiry dates, barcode labeling, shelf replenishment, and cold storage monitoring.'
  }
]

export default function CareerManageView() {
  const toast = useToast()
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('bazario_web_careers')
    return saved ? JSON.parse(saved) : INITIAL_JOBS
  })

  const [searchQuery, setSearchQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    department: 'Retail Operations',
    location: '',
    type: 'Full Time',
    salary: '',
    experience: '',
    description: '',
    status: 'Active'
  })

  const saveToStorage = (updated) => {
    setJobs(updated)
    localStorage.setItem('bazario_web_careers', JSON.stringify(updated))
  }

  const handleOpenAdd = () => {
    setEditingJob(null)
    setFormData({
      title: '',
      department: 'Retail Operations',
      location: 'Central Superstore, Noida',
      type: 'Full Time',
      salary: '₹25,000 - ₹35,000 / mo',
      experience: '1 - 3 Years',
      description: '',
      status: 'Active'
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (job) => {
    setEditingJob(job)
    setFormData({ ...job })
    setModalOpen(true)
  }

  const handleToggleStatus = (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active'
    const updated = jobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
    saveToStorage(updated)
    toast.info('Job Status', `"${job.title}" is now ${newStatus}.`)
  }

  const handleSubmit = (e) => {
    e?.preventDefault?.()
    if (!formData.title || !formData.department || !formData.location) {
      toast.error('Validation Error', 'Please fill in all mandatory job details.')
      return
    }

    if (editingJob) {
      const updated = jobs.map((j) =>
        j.id === editingJob.id ? { ...j, ...formData } : j
      )
      saveToStorage(updated)
      toast.success('Job Vacancy Updated', `"${formData.title}" details updated.`)
    } else {
      const newJob = {
        id: Date.now(),
        applicants: 0,
        ...formData
      }
      saveToStorage([...jobs, newJob])
      toast.success('Job Vacancy Published', `"${formData.title}" is now live on careers portal.`)
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!jobToDelete) return
    const updated = jobs.filter((j) => j.id !== jobToDelete.id)
    saveToStorage(updated)
    setDeleteModalOpen(false)
    setJobToDelete(null)
    toast.success('Job Deleted', 'The job posting has been permanently removed.')
  }

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#064C23]/10 text-[#064C23] flex items-center justify-center text-xl shrink-0">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Career Manage</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {jobs.filter((j) => j.status === 'Active').length} Active Openings
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage job openings, departments, requirements, compensation, and applicant postings.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          icon={<FontAwesomeIcon icon={faPlus} />}
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
            placeholder="Search job title, branch, or department..."
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
                <th className="px-6 py-4">Job Title & Dept</th>
                <th className="px-6 py-4">Location Branch</th>
                <th className="px-6 py-4">Employment Type</th>
                <th className="px-6 py-4">Job Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
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
                        <span className="text-xs font-semibold text-[#064C23] bg-[#064C23]/10 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {job.department}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#A44F37] text-xs" />
                        <span>{job.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {job.type}
                      </span>
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
                          variant="edit"
                          tooltip="Edit Job"
                          onClick={() => handleOpenEdit(job)}
                        />
                        <ActionButton
                          variant="delete"
                          tooltip="Delete Job"
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
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No matching job openings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingJob ? 'Edit Career Opening' : 'Post New Career Opening'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="JOB TITLE"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Store Operations Manager"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="DEPARTMENT"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Retail Operations / Logistics"
              required
            />
            <InputField
              label="LOCATION / STORE BRANCH"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Sector 18, Noida Superstore"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                JOB TYPE
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:border-[#064C23]"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <InputField
              label="SALARY (INR ₹)"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="e.g. ₹25,000 - ₹35,000 / mo"
            />

            <InputField
              label="EXPERIENCE REQUIRED"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="e.g. 2 - 4 Years"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              JOB ROLE & RESPONSIBILITIES DESCRIPTION
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition-all focus:border-[#064C23] focus:ring-4 focus:ring-[#064C23]/10 outline-none"
              placeholder="Detailed description of role duties and requirements..."
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Accepting Live Applications</span>
            <ToggleButton
              size="sm"
              checked={formData.status === 'Active'}
              onChange={(val) => setFormData({ ...formData, status: val ? 'Active' : 'Closed' })}
              activeColor="#064C23"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<FontAwesomeIcon icon={faFloppyDisk} />}>
              {editingJob ? 'Save Changes' : 'Publish Job'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Alert */}
      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting?"
        message={`Are you sure you want to permanently delete the job vacancy "${jobToDelete?.title}"?`}
        confirmText="Delete Posting"
        type="danger"
      />
    </div>
  )
}
