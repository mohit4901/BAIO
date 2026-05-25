import { Helmet } from 'react-helmet-async'
import OlympiadsSection from '../components/home/OlympiadsSection'

export default function OlympiadsPage() {
  return (
    <>
      <Helmet>
        <title>All Olympiads | Bharat AI Olympiad</title>
        <meta name="description" content="Browse and register for all upcoming AI and technology olympiads." />
      </Helmet>
      
      <div className="pt-20">
        <div className="bg-[#001F5E] py-16 text-center text-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Our Olympiads</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Discover competitions tailored to challenge and grow your technical skills.
            </p>
          </div>
        </div>
        <OlympiadsSection />
      </div>
    </>
  )
}
