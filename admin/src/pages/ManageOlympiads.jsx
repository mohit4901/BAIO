import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiUsers, FiSearch, FiCalendar, FiDollarSign, FiPlus, FiX } from 'react-icons/fi'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const CATEGORIES = ['AI', 'Science', 'Mathematics', 'Technology', 'Coding', 'Robotics', 'General']
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-700' },
  { value: 'registration_open', label: 'Registration Open', color: 'bg-green-100 text-green-700' },
  { value: 'registration_closed', label: 'Registration Closed', color: 'bg-red-100 text-red-700' },
  { value: 'ongoing', label: 'Ongoing', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'Completed', color: 'bg-teal-100 text-teal-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-700' }
]

export default function ManageOlympiads() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [editingOlympiad, setEditingOlympiad] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'General',
    examDate: '',
    registrationLastDate: '',
    registrationFee: 0,
    isFree: true,
    status: 'draft',
    isFeatured: false,
  })

  // Fetch Olympiads
  const { data: olympiadsData, isLoading } = useQuery({
    queryKey: ['olympiads', search],
    queryFn: () => api.get('/olympiads', { params: { search, limit: 100 } }).then(r => r.data.data),
  })

  // Update Olympiad Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => api.patch(`/olympiads/${data.id}`, data.fields),
    onSuccess: () => {
      queryClient.invalidateQueries(['olympiads'])
      toast.success('Olympiad updated successfully!')
      setEditingOlympiad(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update Olympiad')
    }
  })

  const handleEditClick = (olympiad) => {
    setEditingOlympiad(olympiad)
    setFormData({
      title: olympiad.title || '',
      description: olympiad.description || '',
      shortDescription: olympiad.shortDescription || '',
      category: olympiad.category || 'General',
      examDate: olympiad.examDate ? format(new Date(olympiad.examDate), 'yyyy-MM-dd') : '',
      registrationLastDate: olympiad.registrationLastDate ? format(new Date(olympiad.registrationLastDate), 'yyyy-MM-dd') : '',
      registrationFee: olympiad.registrationFee || 0,
      isFree: olympiad.isFree ?? true,
      status: olympiad.status || 'draft',
      isFeatured: olympiad.isFeatured || false,
    })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) return toast.error('Title is required')
    if (!formData.description.trim()) return toast.error('Description is required')
    if (!formData.examDate) return toast.error('Exam Date is required')
    if (!formData.registrationLastDate) return toast.error('Registration Last Date is required')

    const fields = {
      ...formData,
      registrationFee: formData.isFree ? 0 : Number(formData.registrationFee)
    }

    updateMutation.mutate({ id: editingOlympiad._id, fields })
  }

  const getStatusLabel = (statusValue) => {
    const opt = STATUS_OPTIONS.find(o => o.value === statusValue)
    return opt ? opt.label : statusValue
  }

  const getStatusColorClass = (statusValue) => {
    const opt = STATUS_OPTIONS.find(o => o.value === statusValue)
    return opt ? opt.color : 'bg-gray-100 text-gray-700'
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olympiads Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage registration parameters, fees, dates, and details.</p>
        </div>
        
        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="text"
              placeholder="Search olympiads..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="table-container border-none">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Olympiad Info</th>
                  <th>Category</th>
                  <th>Exam Date</th>
                  <th>Reg. Deadline</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {olympiadsData?.docs?.map((olympiad) => (
                  <tr key={olympiad._id} className="hover:bg-gray-50">
                    <td className="max-w-xs">
                      <div className="font-semibold text-gray-900 truncate">{olympiad.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">{olympiad.shortDescription || 'No description provided.'}</div>
                      {olympiad.isFeatured && (
                        <span className="inline-block bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1">
                          Featured
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-gray-700 font-medium text-xs bg-gray-100 px-2.5 py-1 rounded">
                        {olympiad.category}
                      </span>
                    </td>
                    <td className="text-gray-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-navy/60" size={14} />
                        {olympiad.examDate ? format(new Date(olympiad.examDate), 'MMM dd, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="text-gray-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-orange/60" size={14} />
                        {olympiad.registrationLastDate ? format(new Date(olympiad.registrationLastDate), 'MMM dd, yyyy') : '-'}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-800">
                        {olympiad.isFree ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          <span>₹{olympiad.registrationFee}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColorClass(olympiad.status)}`}>
                        {getStatusLabel(olympiad.status)}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => navigate(`/students?olympiad=${olympiad._id}`)}
                          className="p-2 text-navy hover:bg-navy/5 rounded-lg transition-colors title-tooltip"
                          title="View Registered Students"
                        >
                          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-navy/10 rounded">
                            <FiUsers size={14} />
                            <span>{olympiad.totalRegistrations || 0}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleEditClick(olympiad)}
                          className="p-2 text-orange-600 hover:bg-orange/5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-orange/10 rounded"
                          title="Edit Details"
                        >
                          <FiEdit2 size={14} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!olympiadsData?.docs || olympiadsData.docs.length === 0) && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No olympiads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingOlympiad && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Edit Olympiad Details</h2>
              <button 
                onClick={() => setEditingOlympiad(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Olympiad Title</label>
                  <input
                    type="text"
                    name="title"
                    className="input-field"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. British AI Olympiad 2026"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    className="input-field"
                    value={formData.shortDescription}
                    onChange={handleFormChange}
                    placeholder="Brief description showing on cards (max 500 chars)"
                    maxLength={500}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="input-field min-h-[100px] resize-y"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Detailed information and syllabus information..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    name="category"
                    className="input-field bg-white"
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select
                    name="status"
                    className="input-field bg-white"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Exam Date</label>
                  <input
                    type="date"
                    name="examDate"
                    className="input-field"
                    value={formData.examDate}
                    onChange={handleFormChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Deadline</label>
                  <input
                    type="date"
                    name="registrationLastDate"
                    className="input-field"
                    value={formData.registrationLastDate}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="border-t border-gray-100 col-span-2 my-2"></div>

                <div className="col-span-2 flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
                    />
                    <span className="text-sm font-semibold text-gray-700">Free Olympiad</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured on Homepage</span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Fee (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">₹</span>
                      <input
                        type="number"
                        name="registrationFee"
                        className="input-field pl-7"
                        value={formData.registrationFee}
                        onChange={handleFormChange}
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingOlympiad(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="btn-primary px-6"
                >
                  {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
