import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Bharat AI Olympiad</title>
        <meta name="description" content="Learn about Bharat AI Olympiad, India's premier AI competition platform." />
      </Helmet>
      
      <div className="pt-20">
        <section className="section-padding gradient-navy text-white text-center">
          <div className="container-custom">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black font-display mb-6"
            >
              About Bharat AI Olympiad
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl max-w-2xl mx-auto text-white/80"
            >
              Empowering the next generation of innovators through world-class AI competitions.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom max-w-4xl">
            <div className="prose prose-lg mx-auto text-gray-600">
              <h2 className="text-3xl font-bold text-[#001F5E] mb-6">Our Mission</h2>
              <p className="mb-8">
                Bharat AI Olympiad is dedicated to fostering a culture of innovation and technical excellence among students across India. We believe that artificial intelligence is the future, and early exposure to these concepts is crucial for the leaders of tomorrow.
              </p>
              
              <h2 className="text-3xl font-bold text-[#001F5E] mb-6">What We Do</h2>
              <p className="mb-8">
                We organize national-level olympiads in Artificial Intelligence, Machine Learning, Data Science, and related technological fields. Our platform brings together students, educators, and industry experts to create a comprehensive ecosystem for technical education and assessment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
