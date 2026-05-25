import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../services/api'
import { FiCheckCircle } from 'react-icons/fi'

const schema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  principalName: z.string().min(2, 'Principal name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  board: z.string().min(1, 'Please select a board'),
  address: z.object({
    street: z.string().min(2, 'Street is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  }),
})

export default function SchoolRegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      await api.post('/schools/register', data)
      setIsSuccess(true)
      toast.success('Registration submitted successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-[#F5F5F5]">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <FiCheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#001F5E] mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for registering your school with Bharat AI Olympiad. Our team will review your application and get back to you shortly.
          </p>
          <button onClick={() => window.location.href = '/'} className="btn-primary w-full">
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>School Registration | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-screen pt-24 pb-16 bg-[#F5F5F5]">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-[#001F5E] p-10 text-white text-center">
              <h1 className="text-3xl font-black font-display mb-3">Register Your School</h1>
              <p className="text-white/80 max-w-lg mx-auto">
                Partner with BAIO to bring India's leading AI olympiad to your students.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
              {/* Basic Details */}
              <div>
                <h3 className="text-lg font-bold text-[#001F5E] mb-4 border-b pb-2">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">School Name</label>
                    <input {...register('schoolName')} className={`input-field ${errors.schoolName ? 'error' : ''}`} placeholder="Enter full school name" />
                    {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Principal Name</label>
                    <input {...register('principalName')} className={`input-field ${errors.principalName ? 'error' : ''}`} placeholder="Full Name" />
                    {errors.principalName && <p className="text-red-500 text-xs mt-1">{errors.principalName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Board Affiliation</label>
                    <select {...register('board')} className={`input-field ${errors.board ? 'error' : ''}`}>
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB</option>
                      <option value="IGCSE">IGCSE</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.board && <p className="text-red-500 text-xs mt-1">{errors.board.message}</p>}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-bold text-[#001F5E] mb-4 border-b pb-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Official Email</label>
                    <input type="email" {...register('email')} className={`input-field ${errors.email ? 'error' : ''}`} placeholder="school@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                    <input {...register('phone')} className={`input-field ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile/landline" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-bold text-[#001F5E] mb-4 border-b pb-2">School Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                    <input {...register('address.street')} className={`input-field ${errors.address?.street ? 'error' : ''}`} placeholder="Street / Area / Locality" />
                    {errors.address?.street && <p className="text-red-500 text-xs mt-1">{errors.address.street.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input {...register('address.city')} className={`input-field ${errors.address?.city ? 'error' : ''}`} placeholder="City" />
                    {errors.address?.city && <p className="text-red-500 text-xs mt-1">{errors.address.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <input {...register('address.state')} className={`input-field ${errors.address?.state ? 'error' : ''}`} placeholder="State" />
                    {errors.address?.state && <p className="text-red-500 text-xs mt-1">{errors.address.state.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input {...register('address.pincode')} className={`input-field ${errors.address?.pincode ? 'error' : ''}`} placeholder="6-digit PIN" />
                    {errors.address?.pincode && <p className="text-red-500 text-xs mt-1">{errors.address.pincode.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-lg">
                  {isLoading ? 'Submitting...' : 'Submit Registration Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
