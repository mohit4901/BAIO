import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../services/api'
import { FiMail } from 'react-icons/fi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsLoading(true)
      await api.post('/auth/student/forgot-password', { email })
      setIsSent(true)
      toast.success('Password reset email sent!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-[#F5F5F5]">
        <div className="container-custom max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="w-16 h-16 rounded-2xl mx-auto bg-blue-50 text-[#001F5E] flex items-center justify-center mb-6">
              <FiMail size={30} />
            </div>
            
            <h1 className="text-2xl font-black text-center text-[#001F5E] mb-2 font-display">Forgot Password?</h1>
            
            {isSent ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  We have sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder).
                </p>
                <Link to="/login" className="btn-primary w-full justify-center">Return to Login</Link>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-600 text-sm mb-8">
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field" 
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  
                  <div className="text-center mt-6">
                    <Link to="/login" className="text-sm font-bold text-[#001F5E] hover:underline">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
