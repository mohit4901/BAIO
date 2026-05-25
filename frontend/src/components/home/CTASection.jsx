import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers } from 'react-icons/fi'

export default function CTASection() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(135deg, #001040 0%, #001F5E 50%, #0B7F3B 100%)' }}>
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 rounded-3xl gradient-orange flex items-center justify-center mx-auto mb-8 shadow-2xl animate-float">
            <FiUsers className="text-white" size={36} />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-display mb-6 leading-tight">
            Ready to{' '}
            <span style={{ background: 'linear-gradient(135deg, #FF8C00, #FFA333)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Compete
            </span>
            {' '}at National Level?
          </h2>
          <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Join 50,000+ students who are already building their future through BAIO. Register today — it's free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base gap-2 group">
              Register as Student
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/school-register" className="btn-secondary text-base">
              Register Your School
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
