import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { format } from 'date-fns'

export default function ManageStudents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const olympiadId = searchParams.get('olympiad') || ''
  
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  // Fetch Olympiads for the dropdown filter
  const { data: olympiadsData } = useQuery({
    queryKey: ['olympiads-dropdown-list'],
    queryFn: () => api.get('/olympiads', { params: { limit: 100 } }).then(r => r.data.data),
  })

  // Fetch students, filtering by search and selected olympiad
  const { data, isLoading } = useQuery({
    queryKey: ['students', page, search, olympiadId],
    queryFn: () => 
      api.get('/students', { 
        params: { 
          page, 
          limit: 10, 
          search, 
          olympiad: olympiadId || undefined 
        } 
      }).then(r => r.data.data),
    keepPreviousData: true,
  })

  const handleOlympiadChange = (e) => {
    const value = e.target.value
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('olympiad', value)
    } else {
      newParams.delete('olympiad')
    }
    setSearchParams(newParams)
    setPage(1)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-sm text-gray-500 mt-1">View and search all registered student profiles.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-60">
            <select
              className="input-field bg-white"
              value={olympiadId}
              onChange={handleOlympiadChange}
            >
              <option value="">All Olympiads (Filter)</option>
              {olympiadsData?.docs?.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, email, roll number..."
              className="input-field"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
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
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>School</th>
                  <th>Joined Date</th>
                  <th>Email Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.docs?.map((student) => (
                  <tr key={student._id}>
                    <td className="font-semibold text-navy text-sm font-mono">{student.rollNumber || 'N/A'}</td>
                    <td className="font-medium text-gray-900">{student.fullName}</td>
                    <td className="text-gray-500">{student.email}</td>
                    <td>Class {student.class}</td>
                    <td className="text-gray-600 font-medium">{student.schoolName || '-'}</td>
                    <td className="text-gray-500">{student.createdAt ? format(new Date(student.createdAt), 'MMM dd, yyyy') : '-'}</td>
                    <td>
                      <span className={`badge ${student.isEmailVerified ? 'badge-green' : 'badge-orange'}`}>
                        {student.isEmailVerified ? 'Email Verified' : 'Email Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!data?.docs || data.docs.length === 0) && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No students found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={!data.hasPrevPage} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={!data.hasNextPage} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

