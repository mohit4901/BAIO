import { useQuery } from '@tanstack/react-query'
import { FiUsers, FiAward, FiBook, FiMessageSquare } from 'react-icons/fi'
import api from '../services/api'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data.data),
  })

  if (isLoading) return <div className="p-8 text-gray-500">Loading dashboard...</div>

  const statCards = [
    { title: 'Total Students', value: stats?.overview?.totalStudents || 0, icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Schools', value: stats?.overview?.totalSchools || 0, icon: FiBook, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Olympiads', value: stats?.highlights?.activeOlympiads || 0, icon: FiAward, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Announcements', value: stats?.overview?.totalAnnouncements || 0, icon: FiMessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Recent Registrations</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.recentStudents?.map(s => (
              <div key={s._id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.fullName}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">Class {s.class}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{format(new Date(s.createdAt), 'MMM dd')}</p>
                </div>
              </div>
            ))}
            {(!stats?.recentActivity?.recentStudents || stats.recentActivity.recentStudents.length === 0) && (
              <p className="text-sm text-gray-500">No recent students.</p>
            )}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Recently Added Schools</h3>
          <div className="space-y-4">
            {stats?.recentActivity?.recentSchools?.map(s => (
              <div key={s._id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.schoolName}</p>
                  <p className="text-xs text-gray-500">{s.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${s.verificationStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {s.verificationStatus}
                  </span>
                </div>
              </div>
            ))}
             {(!stats?.recentActivity?.recentSchools || stats.recentActivity.recentSchools.length === 0) && (
              <p className="text-sm text-gray-500">No recent schools.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
