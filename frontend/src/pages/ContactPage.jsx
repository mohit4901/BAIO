import { Helmet } from 'react-helmet-async'
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Bharat AI Olympiad</title>
      </Helmet>

      <div className="pt-20 bg-[#F5F5F5] min-h-screen">
        <div className="bg-[#001F5E] py-16 text-center text-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4">Contact Us</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              We're here to help. Get in touch with the BAIO support team.
            </p>
          </div>
        </div>

        <div className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#001F5E] mb-6">Get in Touch</h2>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF8C00] flex items-center justify-center flex-shrink-0">
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Email Address</h3>
                  <p className="text-gray-600 mt-1">support@baio.in</p>
                  <p className="text-gray-600">info@baio.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-[#0B7F3B] flex items-center justify-center flex-shrink-0">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Phone Number</h3>
                  <p className="text-gray-600 mt-1">1800-XXX-XXXX (Toll Free)</p>
                  <p className="text-gray-600">+91 98XXX XXXXX</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#001F5E] flex items-center justify-center flex-shrink-0">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Office Address</h3>
                  <p className="text-gray-600 mt-1">
                    BAIO Headquarters,<br/>
                    Sector 42, AI Hub,<br/>
                    New Delhi, India 110001
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-[#001F5E] mb-6">Send a Message</h2>
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                  <input type="text" className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <textarea className="input-field min-h-[120px] resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg mt-4">
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </>
  )
}
