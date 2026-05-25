import { motion } from 'framer-motion'
import { FiShield, FiAward, FiGlobe, FiTrendingUp, FiUsers, FiBookOpen } from 'react-icons/fi'

const features = [
  {
    icon: FiShield,
    title: 'Nationally Recognized',
    description: 'Certificates and awards recognized by schools and institutions across India.',
    color: '#001F5E',
    bgColor: 'rgba(0,31,94,0.07)',
  },
  {
    icon: FiAward,
    title: 'Prestigious Awards',
    description: 'Win medals, certificates, scholarships, and recognition at national level.',
    color: '#FF8C00',
    bgColor: 'rgba(255,140,0,0.08)',
  },
  {
    icon: FiGlobe,
    title: 'Pan-India Coverage',
    description: 'Participate from anywhere in India. 28+ states and 10,000+ partner schools.',
    color: '#0B7F3B',
    bgColor: 'rgba(11,127,59,0.08)',
  },
  {
    icon: FiTrendingUp,
    title: 'Career Boost',
    description: 'Enhance your academic profile with AI olympiad achievements for college admissions.',
    color: '#003d9e',
    bgColor: 'rgba(0,61,158,0.07)',
  },
  {
    icon: FiUsers,
    title: 'Expert Mentors',
    description: 'Learn from IIT/IIM faculty and AI industry experts who design the curriculum.',
    color: '#FF8C00',
    bgColor: 'rgba(255,140,0,0.08)',
  },
  {
    icon: FiBookOpen,
    title: 'Rich Study Material',
    description: 'Free access to syllabus, sample papers, and study guides for all olympiads.',
    color: '#0B7F3B',
    bgColor: 'rgba(11,127,59,0.08)',
  },
]

export default function WhyUsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block badge badge-navy mb-4"
          >
            ✦ Why Choose BAIO
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-4"
          >
            Why Bharat AI Olympiad?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            We provide a world-class platform for students to demonstrate their AI knowledge and compete at a national level.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-7 rounded-2xl border border-gray-100 card-hover bg-white group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: feature.bgColor }}
              >
                <feature.icon size={26} style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-[#001F5E] mb-3 group-hover:text-[#FF8C00] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
