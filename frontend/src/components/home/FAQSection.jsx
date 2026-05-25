import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-gray-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-[#001F5E] pr-4">{faq.question}</span>
        <FiChevronDown
          className={`flex-shrink-0 text-[#FF8C00] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const defaultFAQs = [
  { question: 'What is Bharat AI Olympiad?', answer: "BAIO is India's premier AI-focused olympiad platform for students in classes 1-12, offering national-level competitions in AI, Science, Mathematics, and Technology." },
  { question: 'Who can participate?', answer: 'Students from classes 1 to 12 from any recognized school across India can participate.' },
  { question: 'How to register?', answer: 'Click on Register, fill your details, select your olympiad, and submit. Registration is free for most olympiads.' },
  { question: 'Are results available online?', answer: 'Yes! Results are published on our Result Search page. Search by roll number or email to view your results.' },
  { question: 'Will I receive a certificate?', answer: 'Yes, all participants receive digital certificates and top rankers receive special awards and scholarships.' },
]

export default function FAQSection() {
  const { data } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => api.get('/cms/type/faq').then(r => r.data.data.items),
    onError: () => {},
  })

  const faqs = data?.length ? data : defaultFAQs

  return (
    <section className="section-padding bg-[#F5F5F5]">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block badge badge-navy mb-4">✦ FAQ</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-4">
              Frequently Asked Questions
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.key || i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
