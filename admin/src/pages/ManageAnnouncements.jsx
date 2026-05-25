import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar, FiX, FiCheckCircle } from 'react-icons/fi'
import api from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const TYPES = [
  { value: 'announcement', label: 'Announcement', color: 'bg-blue-100 text-blue-800' },
  { value: 'notice', label: 'Notice', color: 'bg-gray-100 text-gray-800' },
  { value: 'alert', label: 'Alert', color: 'bg-rose-100 text-rose-800' },
  { value: 'update', label: 'Update', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'result', label: 'Result', color: 'bg-green-100 text-green-800' },
  { value: 'event', label: 'Event', color: 'bg-amber-100 text-amber-800' }
]

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700 font-bold animate-pulse' }
]

const AUDIENCES = [
  { value: 'all', label: 'All Users' },
  { value: 'students', label: 'Students Only' },
  { value: 'schools', label: 'Schools Only' },
  { value: 'admins', label: 'Admins Only' }
]

export default function ManageAnnouncements() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'medium',
    targetAudience: 'all',
    isPublished: true,
    isPinned: false,
    expiresAt: ''
  })

  // Fetch Announcements
  const { data: announcementData, isLoading } = useQuery({
    queryKey: ['announcements', search, typeFilter],
    queryFn: () => 
      api.get('/announcements', { 
        params: { 
          search, 
          type: typeFilter || undefined,
          limit: 100 
        } 
      }).then(r => r.data.data),
  })

  // Create Announcement Mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/announcements', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements'])
      toast.success('Announcement created successfully!')
      handleCloseModal()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create announcement')
    }
  })

  // Update Announcement Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => api.patch(`/announcements/${data.id}`, data.fields),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements'])
      toast.success('Announcement updated successfully!')
      handleCloseModal()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update announcement')
    }
  })

  // Delete Announcement Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/announcements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements'])
      toast.success('Announcement deleted successfully')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete announcement')
    }
  })

  const handleOpenCreate = () => {
    setEditingAnnouncement(null)
    setFormData({
      title: '',
      content: '',
      type: 'announcement',
      priority: 'medium',
      targetAudience: 'all',
      isPublished: true,
      isPinned: false,
      expiresAt: ''
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title || '',
      content: announcement.content || '',
      type: announcement.type || 'announcement',
      priority: announcement.priority || 'medium',
      targetAudience: announcement.targetAudience || 'all',
      isPublished: announcement.isPublished ?? false,
      isPinned: announcement.isPinned ?? false,
      expiresAt: announcement.expiresAt ? format(new Date(announcement.expiresAt), 'yyyy-MM-dd') : ''
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAnnouncement(null)
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

    if (!formData.title.trim()) return toast.error('Title is required')
    if (!formData.content.trim()) return toast.error('Content is required')

    const submissionData = {
      ...formData,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null
    }

    if (editingAnnouncement) {
      updateMutation.mutate({ id: editingAnnouncement._id, fields: submissionData })
    } else {
      createMutation.mutate(submissionData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  const getTypeLabel = (val) => TYPES.find(t => t.value === val)?.label || val
  const getTypeColor = (val) => TYPES.find(t => t.value === val)?.color || 'bg-gray-100'
  const getPriorityLabel = (val) => PRIORITIES.find(p => p.value === val)?.label || val
  const getPriorityColor = (val) => PRIORITIES.find(p => p.value === val)?.color || 'bg-gray-100'

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Publish notices, alerts, and news for students, schools, or all users.</p>
        </div>
        
        <button
          onClick={handleOpenCreate}
          className="btn-primary"
        >
          <FiPlus />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search announcements..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>
        
        <div className="w-full sm:w-48">
          <select
            className="input-field bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types (Filter)</option>
            {TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
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
                  <th className="w-1/3">Announcement Info</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Audience</th>
                  <th>Published</th>
                  <th>Pinned</th>
                  <th>Created Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcementData?.docs?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td>
                      <div className="font-semibold text-gray-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.content}</div>
                      {item.expiresAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-medium mt-1">
                          Expires: {format(new Date(item.expiresAt), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getTypeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityColor(item.priority)}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-gray-600 font-medium capitalize">
                        {AUDIENCES.find(a => a.value === item.targetAudience)?.label || item.targetAudience}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.isPublished ? 'badge-green' : 'badge-orange'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.isPinned ? 'badge-blue' : 'bg-gray-100 text-gray-400'}`}>
                        {item.isPinned ? 'Pinned' : 'No'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-xs font-medium">
                      {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-orange-600 hover:bg-orange/5 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!announcementData?.docs || announcementData.docs.length === 0) && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Creation / Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Announcement Title</label>
                  <input
                    type="text"
                    name="title"
                    className="input-field"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Schedule for BAIO 2026 Examination Released"
                    maxLength={300}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Announcement Content</label>
                  <textarea
                    name="content"
                    rows="5"
                    className="input-field min-h-[120px] resize-y"
                    value={formData.content}
                    onChange={handleFormChange}
                    placeholder="Type the announcement details here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
                  <select
                    name="type"
                    className="input-field bg-white"
                    value={formData.type}
                    onChange={handleFormChange}
                  >
                    {TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select
                    name="priority"
                    className="input-field bg-white"
                    value={formData.priority}
                    onChange={handleFormChange}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Audience</label>
                  <select
                    name="targetAudience"
                    className="input-field bg-white"
                    value={formData.targetAudience}
                    onChange={handleFormChange}
                  >
                    {AUDIENCES.map(a => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    name="expiresAt"
                    className="input-field"
                    value={formData.expiresAt}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="border-t border-gray-100 col-span-2 my-2"></div>

                <div className="col-span-2 flex flex-wrap gap-6 items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
                    />
                    <span className="text-sm font-semibold text-gray-700">Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isPinned"
                      checked={formData.isPinned}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-navy rounded border-gray-300 focus:ring-navy"
                    />
                    <span className="text-sm font-semibold text-gray-700">Pin to Top (Featured/Priority)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="btn-primary px-6"
                >
                  {createMutation.isLoading || updateMutation.isLoading ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
