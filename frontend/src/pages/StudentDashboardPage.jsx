import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { FiUser, FiAward, FiBook, FiClock } from 'react-icons/fi'
import api from '../services/api'
import PageLoader from '../components/ui/PageLoader'
import { Link } from 'react-router-dom'

export default function StudentDashboardPage() {
  const { data: student, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: () => api.get('/students/me').then(r => r.data.data.student),
  })

  if (isLoading) return <PageLoader />

  return (
    <>
      <Helmet>
        <title>My Dashboard | Bharat AI Olympiad</title>
      </Helmet>

      <div className="pt-20 min-h-screen bg-[#F5F5F5]">
        <div className="bg-[#001F5E] text-white py-12">
          <div className="container-custom flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full gradient-orange flex items-center justify-center shadow-lg flex-shrink-0 text-3xl font-bold">
              {student?.profilePhoto?.url ? (
                <img src={student.profilePhoto.url} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                student?.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black font-display mb-2">Welcome, {student?.fullName}!</h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5"><FiBook /> Class {student?.class}</span>
                <span className="flex items-center gap-1.5"><FiAward /> Roll: {student?.rollNumber}</span>
                <span className="flex items-center gap-1.5 bg-[#FF8C00] px-2 py-0.5 rounded text-white font-semibold">
                  {student?.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-custom py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col */}
            <div className="lg:col-span-2 space-y-8">
              {/* Registered Olympiads */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-[#001F5E] mb-6 flex items-center gap-2">
                  <FiAward className="text-[#FF8C00]" /> My Registered Olympiads
                </h2>
                
                {student?.registeredOlympiads?.length > 0 ? (
                  <div className="space-y-4">
                    {student.registeredOlympiads.map((reg, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-5 hover:border-[#001F5E]/20 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-800 text-lg">{reg.olympiad?.title}</h3>
                          <span className={`badge ${reg.paymentStatus === 'paid' || reg.paymentStatus === 'free' ? 'badge-green' : 'badge-orange'}`}>
                            {reg.paymentStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="block text-gray-400 text-xs mb-1">Exam Date</span>
                            <span className="font-medium">{new Date(reg.olympiad?.examDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400 text-xs mb-1">Result Status</span>
                            <span className="font-medium">{reg.resultPublished ? 'Published' : 'Pending'}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {reg.hallTicket?.url && (
                            <a href={reg.hallTicket.url} target="_blank" rel="noreferrer" className="btn-secondary !text-xs !py-1.5 !px-3 !border-gray-300 !text-gray-700 hover:!bg-gray-50">
                              Download Admit Card
                            </a>
                          )}
                          {reg.resultPublished && (
                            <Link to="/results" className="btn-primary !text-xs !py-1.5 !px-3">
                              View Result
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-4">You haven't registered for any olympiads yet.</p>
                    <Link to="/olympiads" className="btn-primary !py-2 !px-4">Explore Olympiads</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-8">
              {/* Profile Overview */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-[#001F5E] mb-5 border-b pb-3">Profile Info</h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <span className="block text-gray-400 text-xs mb-0.5">Email</span>
                    <span className="font-medium text-gray-800">{student?.email}</span>
                  </li>
                  <li>
                    <span className="block text-gray-400 text-xs mb-0.5">Mobile</span>
                    <span className="font-medium text-gray-800">{student?.mobile}</span>
                  </li>
                  <li>
                    <span className="block text-gray-400 text-xs mb-0.5">School</span>
                    <span className="font-medium text-gray-800">{student?.schoolName}</span>
                  </li>
                  <li>
                    <span className="block text-gray-400 text-xs mb-0.5">Location</span>
                    <span className="font-medium text-gray-800">{student?.city}, {student?.state}</span>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-[#001F5E] mb-5 border-b pb-3">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/olympiads" className="block p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
                    Register for New Olympiad
                  </Link>
                  <Link to="/results" className="block p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
                    Check Results
                  </Link>
                  <Link to="/faq" className="block p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors">
                    Help & FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
