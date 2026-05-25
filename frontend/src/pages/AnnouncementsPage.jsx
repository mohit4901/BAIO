import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { FiBell, FiClock, FiAlertCircle, FiInfo } from 'react-icons/fi'
import api from '../services/api'
import PageLoader from '../components/ui/PageLoader'

const typeIcons = {
  announcement: FiBell,
  notice: FiInfo,
  alert: FiAlertCircle,
  update: FiClock,
}
const typeColors = {
  announcement: '#003d9e',
  notice: '#0B7F3B',
  alert: '#ef4444',
  update: '#FF8C00',
}

export default function AnnouncementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => api.get('/announcements').then(r => r.data.data),
  })

  if (isLoading) return <PageLoader />

  return (
    <>
      <Helmet>
        <title>Announcements | Bharat AI Olympiad</title>
      </Helmet>

      <div className="pt-20 bg-[#F5F5F5] min-h-screen">
        <div className="bg-[#001F5E] py-16 text-center text-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Announcements</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Stay up-to-date with the latest news, notices, and updates from BAIO.
            </p>
          </div>
        </div>

        <div className="container-custom py-16 max-w-4xl">
          <div className="space-y-6">
            {data?.map((ann) => {
              const Icon = typeIcons[ann.type] || FiBell
              const color = typeColors[ann.type] || '#003d9e'
              return (
                <div key={ann._id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex gap-6">
                  <div className="hidden md:flex w-16 h-16 rounded-2xl flex-shrink-0 items-center justify-center" style={{ background: `${color}15`, color }}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="badge" style={{ background: `${color}20`, color }}>{ann.type.toUpperCase()}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{ann.title}</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-wrap">{ann.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
