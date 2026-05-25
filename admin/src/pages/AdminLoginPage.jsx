import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAdminStore from '../store/adminAuthStore'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAdminStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await api.post('/auth/admin/login', { email, password })
      login(res.data.data.admin, res.data.data.accessToken)
      toast.success('Login successful')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-[#001F5E] text-white flex items-center justify-center mx-auto mb-4 text-3xl font-black">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-800">BAIO Admin</h1>
          <p className="text-gray-500 text-sm">Secure Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
