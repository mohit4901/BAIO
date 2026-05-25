import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function StudentLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const from = location.state?.from || '/dashboard'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await api.post('/auth/student/login', data)
      login(res.data.data.student, res.data.data.accessToken)
      toast.success('Logged in successfully!')
      navigate(from)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Student Login | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-[#F5F5F5] relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-5" />
        
        <div className="container-custom relative z-10 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-[#001F5E] p-8 text-center text-white">
              <div className="w-16 h-16 rounded-2xl mx-auto gradient-orange flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white font-black text-3xl">B</span>
              </div>
              <h1 className="text-2xl font-black font-display mb-2">Welcome Back!</h1>
              <p className="text-white/80 text-sm">Login to your student dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" {...register('email')} className={`input-field ${errors.email ? 'error' : ''}`} placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#FF8C00] font-medium hover:underline">Forgot Password?</Link>
                </div>
                <input type="password" {...register('password')} className={`input-field ${errors.password ? 'error' : ''}`} placeholder="********" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              
              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6 py-3.5 text-base">
                {isLoading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account? <Link to="/register" className="text-[#001F5E] font-bold hover:underline">Register here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
