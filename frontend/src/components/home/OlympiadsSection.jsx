import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiUsers, FiTag } from 'react-icons/fi'
import api from '../../services/api'

const statusColors = {
  registration_open: { bg: 'badge-green', label: 'Registration Open' },
  upcoming: { bg: 'badge-navy', label: 'Upcoming' },
  registration_closed: { bg: 'badge-red', label: 'Closed' },
  completed: { bg: 'badge-red', label: 'Completed' },
}

const categoryColors = {
  AI: 'bg-purple-100 text-purple-700',
  Science: 'bg-blue-100 text-blue-700',
  Mathematics: 'bg-yellow-100 text-yellow-700',
  Technology: 'bg-cyan-100 text-cyan-700',
  Coding: 'bg-green-100 text-green-700',
  Robotics: 'bg-orange-100 text-orange-700',
}

function OlympiadCard({ olympiad, index }) {
  const status = statusColors[olympiad.status] || { bg: 'badge-navy', label: olympiad.status }
  const catColor = categoryColors[olympiad.category] || 'bg-gray-100 text-gray-700'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover border border-gray-100"
    >
      {/* Banner */}
      <div className="relative h-44 gradient-navy overflow-hidden">
        {olympiad.bannerImage?.url ? (
          <img src={olympiad.bannerImage.url} alt={olympiad.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 pattern-dots opacity-20">
            <div className="flex items-center justify-center h-full">
              <span className="text-6xl font-black text-white/20 font-display">{olympiad.category}</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge ${status.bg}`}>{status.label}</span>
        </div>
        {olympiad.isFree && (
          <div className="absolute top-3 right-3">
            <span className="badge badge-green">FREE</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${catColor}`}>
            <FiTag size={10} />
            {olympiad.category}
          </span>
        </div>
        <h3 className="font-bold text-[#001F5E] text-lg leading-tight mb-2 line-clamp-2">{olympiad.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{olympiad.shortDescription}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 gap-3">
          <span className="flex items-center gap-1.5">
            <FiCalendar size={12} className="text-[#FF8C00]" />
            {new Date(olympiad.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <FiUsers size={12} className="text-[#0B7F3B]" />
            {olympiad.totalRegistrations?.toLocaleString() || 0} registered
          </span>
        </div>

        <Link
          to={`/olympiads/${olympiad.slug}`}
          className="btn-navy w-full justify-center !py-2.5 !text-sm group"
        >
          View Details
          <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}

function OlympiadSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <div className="skeleton h-44 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

export default function OlympiadsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-olympiads'],
    queryFn: () => api.get('/olympiads/featured').then(r => r.data.data.olympiads),
  })

  return (
    <section className="section-padding bg-[#F5F5F5]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block badge badge-orange mb-4 text-sm"
          >
            ✦ Featured Olympiads
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-4"
          >
            Explore Olympiads
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Choose from our wide range of nationally recognized olympiads across AI, Science, Mathematics, and more.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <OlympiadSkeleton key={i} />)
            : data?.map((olympiad, i) => <OlympiadCard key={olympiad._id} olympiad={olympiad} index={i} />)
          }
        </div>

        <div className="text-center">
          <Link to="/olympiads" className="btn-primary gap-2 group">
            View All Olympiads
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
