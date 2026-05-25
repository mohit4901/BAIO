import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  class: z.string().min(1, 'Please select a class'),
  schoolName: z.string().min(2, 'School name is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
})

export default function StudentRegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await api.post('/auth/student/register', data)
      login(res.data.data.student, res.data.data.accessToken)
      toast.success(res.data.message)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Student Registration | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-[#F5F5F5] relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-5" />
        
        <div className="container-custom relative z-10 w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-[#001F5E] p-8 text-center text-white">
              <h1 className="text-3xl font-black font-display mb-2">Student Registration</h1>
              <p className="text-white/80">Join India's largest AI competition platform</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input {...register('fullName')} className={`input-field ${errors.fullName ? 'error' : ''}`} placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" {...register('email')} className={`input-field ${errors.email ? 'error' : ''}`} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input {...register('mobile')} className={`input-field ${errors.mobile ? 'error' : ''}`} placeholder="9876543210" />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input type="password" {...register('password')} className={`input-field ${errors.password ? 'error' : ''}`} placeholder="********" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class</label>
                  <select {...register('class')} className={`input-field ${errors.class ? 'error' : ''}`}>
                    <option value="">Select Class</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                  {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">School Name</label>
                  <input {...register('schoolName')} className={`input-field ${errors.schoolName ? 'error' : ''}`} placeholder="Delhi Public School" />
                  {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input {...register('city')} className={`input-field ${errors.city ? 'error' : ''}`} placeholder="New Delhi" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <input {...register('state')} className={`input-field ${errors.state ? 'error' : ''}`} placeholder="Delhi" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>
              
              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6 py-4 text-lg">
                {isLoading ? 'Registering...' : 'Create Account'}
              </button>
              
              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account? <Link to="/login" className="text-[#FF8C00] font-bold hover:underline">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
