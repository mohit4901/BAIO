import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminStore = create(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,

      setAdmin: (admin) => set({ admin }),
      setAccessToken: (token) => set({ accessToken: token }),

      login: (admin, accessToken) => set({ admin, accessToken }),
      logout: () => set({ admin: null, accessToken: null }),
    }),
    {
      name: 'baio-admin-auth',
    }
  )
)

export default useAdminStore
