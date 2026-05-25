import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { FiArrowRight, FiPlay, FiAward, FiUsers, FiBookOpen, FiStar } from 'react-icons/fi'

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 4 + 3,
}))

const highlights = [
  { icon: FiUsers, value: '50K+', label: 'Students' },
  { icon: FiBookOpen, value: '10K+', label: 'Schools' },
  { icon: FiAward, value: '100+', label: 'Olympiads' },
  { icon: FiStar, value: '28+', label: 'States' },
]

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ position: 'relative', background: 'linear-gradient(135deg, #001040 0%, #001F5E 45%, #003d9e 75%, #0B7F3B 100%)' }}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <div className="absolute inset-0 pattern-grid" />

      {/* Animated particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#003d9e]/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#FF8C00]/20 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0B7F3B]/10 blur-[120px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 container-custom text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FF8C00]/40 bg-[#FF8C00]/10 text-[#FF8C00] text-sm font-semibold mb-8"
        >
          <FiStar size={14} className="animate-pulse" />
          India's #1 AI Olympiad Platform
          <FiStar size={14} className="animate-pulse" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight mb-6 font-display"
        >
          Bharat{' '}
          <span className="relative inline-block">
            <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFA333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              AI
            </span>
          </span>
          <br />
          <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Olympiad</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover your potential in Artificial Intelligence. Compete with the best minds
          across India in our nationally recognized olympiad platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link to="/register" className="btn-primary text-base gap-3 group">
            Register Now
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/olympiads" className="btn-secondary text-base gap-3 group">
            <FiPlay size={16} className="group-hover:scale-110 transition-transform" />
            Explore Olympiads
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {highlights.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-2xl p-5 text-center card-hover"
            >
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center mx-auto mb-3">
                <Icon className="text-white" size={18} />
              </div>
              <div className="text-2xl font-black text-white font-display">{value}</div>
              <div className="text-white/60 text-xs font-medium mt-0.5">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs tracking-wider uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}
