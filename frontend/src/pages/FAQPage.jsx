import { Helmet } from 'react-helmet-async'
import FAQSection from '../components/home/FAQSection'

export default function FAQPage() {
  return (
    <>
      <Helmet>
        <title>FAQ | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="pt-20">
        <div className="bg-[#001F5E] py-16 text-center text-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Help & FAQ</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Find answers to common questions about BAIO registrations, exams, and results.
            </p>
          </div>
        </div>
        <FAQSection />
      </div>
    </>
  )
}
