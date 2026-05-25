import axios from 'axios'
import useAdminStore from '../store/adminAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const { accessToken } = useAdminStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
