import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiBell, FiClock, FiAlertCircle, FiInfo, FiArrowRight, FiStar } from 'react-icons/fi'
import api from '../../services/api'

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

export default function AnnouncementsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['latest-announcements'],
    queryFn: () => api.get('/announcements/latest').then(r => r.data.data.announcements),
  })

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block badge badge-orange mb-4"
            >
              ✦ Latest News
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-4"
            >
              Announcements &amp; Updates
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg mb-8"
            >
              Stay updated with the latest news, notifications, and important announcements from BAIO.
            </motion.p>
            <Link to="/announcements" className="btn-navy gap-2 group">
              View All Announcements
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-20 rounded-2xl" />
                ))
              : data?.map((ann, i) => {
                  const Icon = typeIcons[ann.type] || FiBell
                  const color = typeColors[ann.type] || '#003d9e'
                  return (
                    <motion.div
                      key={ann._id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={`/announcements`}
                        className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#001F5E]/20 hover:shadow-lg transition-all duration-300 bg-white group"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                        >
                          <Icon size={18} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-[#001F5E] text-sm line-clamp-1 group-hover:text-[#FF8C00] transition-colors">
                              {ann.isPinned && <FiStar size={12} className="inline text-[#FF8C00] mr-1" />}
                              {ann.title}
                            </h4>
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(ann.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <FiArrowRight size={14} className="text-gray-400 flex-shrink-0 mt-1 group-hover:text-[#001F5E] group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}
