import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../services/api'
import { FiLock } from 'react-icons/fi'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }
    
    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }

    try {
      setIsLoading(true)
      await api.patch(`/auth/student/reset-password/${token}`, { password })
      toast.success('Password reset successful!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired token')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-[#F5F5F5]">
        <div className="container-custom max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="w-16 h-16 rounded-2xl mx-auto bg-green-50 text-[#0B7F3B] flex items-center justify-center mb-6">
              <FiLock size={30} />
            </div>
            
            <h1 className="text-2xl font-black text-center text-[#001F5E] mb-2 font-display">Create New Password</h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              Please enter your new password below.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field" 
                  placeholder="********"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-field" 
                  placeholder="********"
                  required
                />
              </div>
              
              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
