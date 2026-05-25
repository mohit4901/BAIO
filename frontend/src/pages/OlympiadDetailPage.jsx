import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { FiCalendar, FiUsers, FiClock, FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi'
import api from '../services/api'
import PageLoader from '../components/ui/PageLoader'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function OlympiadDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { student } = useAuthStore()
  const queryClient = useQueryClient()
  const [registered, setRegistered] = useState(false)

  const { data: olympiad, isLoading, isError } = useQuery({
    queryKey: ['olympiad', slug],
    queryFn: () => api.get(`/olympiads/${slug}`).then(r => r.data.data.olympiad),
  })

  // Check if this student is already registered for this olympiad
  const isAlreadyRegistered = registered ||
    student?.registeredOlympiads?.some(id => id === olympiad?._id)

  const { mutate: registerForOlympiad, isPending: isRegistering } = useMutation({
    mutationFn: () => api.post(`/students/me/register-olympiad/${olympiad._id}`),
    onSuccess: (res) => {
      toast.success('Successfully registered for the olympiad!')
      setRegistered(true)
      queryClient.invalidateQueries(['olympiad', slug])
      queryClient.invalidateQueries(['my-profile'])
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    },
  })

  const handleRegisterClick = () => {
    if (!student) {
      toast('Please log in to register for this olympiad', { icon: '🔒' })
      navigate('/login', { state: { from: `/olympiads/${slug}` } })
      return
    }
    registerForOlympiad()
  }

  if (isLoading) return <PageLoader />
  if (isError || !olympiad) return (
    <div className="pt-32 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Olympiad Not Found</h2>
      <Link to="/olympiads" className="btn-primary mt-4 inline-flex">Browse Olympiads</Link>
    </div>
  )

  const isRegistrationOpen = olympiad.status === 'registration_open'
  const deadline = olympiad.registrationLastDate ? new Date(olympiad.registrationLastDate) : null
  const isPastDeadline = deadline && deadline < new Date()

  return (
    <>
      <Helmet>
        <title>{olympiad.title} | Bharat AI Olympiad</title>
        <meta name="description" content={olympiad.shortDescription} />
      </Helmet>

      <div className="pt-20">
        {/* Hero Banner */}
        <div className="bg-[#001F5E] text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="container-custom relative z-10">
            <div className="max-w-4xl">
              <span className="inline-block badge badge-orange mb-6 text-sm">{olympiad.category}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display mb-6 leading-tight">
                {olympiad.title}
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {olympiad.shortDescription}
              </p>

              <div className="flex flex-wrap gap-6 mb-10 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-[#FF8C00]" size={18} />
                  <span>Exam: <strong>{new Date(olympiad.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-[#0B7F3B]" size={18} />
                  <span><strong>{olympiad.totalRegistrations || 0}</strong> Registered</span>
                </div>
                {deadline && (
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#FF8C00]" size={18} />
                    <span>Last Date: <strong>{deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {isAlreadyRegistered ? (
                <div className="inline-flex items-center gap-3 bg-green-500/20 border border-green-400/40 text-green-300 px-8 py-4 rounded-xl font-bold text-lg">
                  <FiCheckCircle size={22} />
                  You are registered!
                </div>
              ) : !isRegistrationOpen || isPastDeadline ? (
                <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/40 text-red-300 px-8 py-4 rounded-xl font-bold text-lg">
                  <FiAlertCircle size={22} />
                  Registration Closed
                </div>
              ) : (
                <button
                  onClick={handleRegisterClick}
                  disabled={isRegistering}
                  className="btn-primary text-lg px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isRegistering ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : !student ? (
                    <>
                      <FiLock size={18} />
                      Login to Register
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Register Now — {olympiad.isFree ? 'Free' : `₹${olympiad.registrationFee}`}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="section-padding bg-[#F5F5F5]">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#001F5E] mb-4 border-b pb-4">About This Olympiad</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{olympiad.description}</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#001F5E] mb-4 border-b pb-4">Eligibility</h2>
                  <ul className="space-y-3">
                    {olympiad.eligibility?.classes?.length > 0 && (
                      <li className="flex gap-3 text-gray-600">
                        <FiCheckCircle className="text-[#0B7F3B] mt-1 flex-shrink-0" />
                        <span>Open for Classes: <strong>{olympiad.eligibility.classes.join(', ')}</strong></span>
                      </li>
                    )}
                    {olympiad.eligibility?.description && (
                      <li className="flex gap-3 text-gray-600">
                        <FiCheckCircle className="text-[#0B7F3B] mt-1 flex-shrink-0" />
                        <span>{olympiad.eligibility.description}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {olympiad.tags?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[#001F5E] mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {olympiad.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-[#001F5E] rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-[#FF8C00]">
                  <h3 className="text-lg font-bold text-[#001F5E] mb-4">Quick Information</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    {[
                      { label: 'Fee', value: olympiad.isFree ? 'Free' : `₹${olympiad.registrationFee}` },
                      { label: 'Level', value: olympiad.level?.replace('_', ' '), capitalize: true },
                      { label: 'Category', value: olympiad.category },
                      { label: 'Status', value: olympiad.status?.replace(/_/g, ' '), capitalize: true },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between border-b pb-2 last:border-0">
                        <span className="font-semibold">{item.label}:</span>
                        <span className={item.capitalize ? 'capitalize' : ''}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prizes Card */}
                {olympiad.prizes?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-[#0B7F3B]">
                    <h3 className="text-lg font-bold text-[#001F5E] mb-4">Prizes & Awards</h3>
                    <div className="space-y-4">
                      {olympiad.prizes.map((prize, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                            {prize.rank}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{prize.prize}</p>
                            {prize.amount && <p className="text-xs text-[#0B7F3B] font-bold mt-0.5">₹{prize.amount.toLocaleString()}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not logged-in prompt */}
                {!student && isRegistrationOpen && !isPastDeadline && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                    <FiLock className="mx-auto mb-2 text-[#001F5E]" size={24} />
                    <p className="text-sm text-gray-600 mb-3">Login to register for this olympiad</p>
                    <Link to="/login" state={{ from: `/olympiads/${slug}` }} className="btn-primary w-full justify-center py-2.5 text-sm">
                      Login / Register
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
