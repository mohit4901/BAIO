import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { FiUsers, FiBookOpen, FiAward, FiMapPin, FiTrendingUp, FiStar } from 'react-icons/fi'

const stats = [
  { icon: FiUsers, value: 50000, suffix: '+', label: 'Students Registered', color: '#FF8C00' },
  { icon: FiBookOpen, value: 10000, suffix: '+', label: 'Partner Schools', color: '#0B7F3B' },
  { icon: FiAward, value: 100, suffix: '+', label: 'Olympiads Conducted', color: '#003d9e' },
  { icon: FiMapPin, value: 28, suffix: '+', label: 'States Covered', color: '#FF8C00' },
  { icon: FiTrendingUp, value: 98, suffix: '%', label: 'Student Satisfaction', color: '#0B7F3B' },
  { icon: FiStar, value: 500, suffix: '+', label: 'Award Winners', color: '#003d9e' },
]

function StatCard({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center group"
    >
      <div className="relative inline-flex mb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}44)`, border: `2px solid ${stat.color}33` }}
        >
          <stat.icon size={24} style={{ color: stat.color }} />
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-1">
        {inView ? (
          <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
        ) : (
          '0'
        )}
      </div>
      <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
    </motion.div>
  )
}

export default function StatsSection() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(135deg, #001040 0%, #001F5E 100%)' }}>
      <div className="absolute inset-0 pattern-dots opacity-10 pointer-events-none" />
      <div className="container-custom relative">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white font-display mb-4"
          >
            Our Impact in Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/60 text-lg max-w-xl mx-auto"
          >
            Empowering India's brightest students through national-level competitions
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center group cursor-default">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${stat.color}22`, border: `1px solid ${stat.color}44` }}
              >
                <stat.icon size={22} style={{ color: stat.color }} />
              </motion.div>
              <div className="text-3xl md:text-4xl font-black text-white font-display mb-1">
                <CounterValue end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/50 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CounterValue({ end, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <span ref={ref}>
      {inView ? <CountUp end={end} duration={2.5} separator="," suffix={suffix} /> : '0'}
    </span>
  )
}
