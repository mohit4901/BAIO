import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      student: null,
      accessToken: null,
      isLoading: false,

      setStudent: (student) => set({ student }),
      setAccessToken: (token) => set({ accessToken: token }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (student, accessToken) => set({ student, accessToken }),
      logout: () => set({ student: null, accessToken: null }),

      updateStudent: (data) =>
        set((state) => ({ student: state.student ? { ...state.student, ...data } : null })),
    }),
    {
      name: 'baio-student-auth',
      partialState: (state) => ({ student: state.student, accessToken: state.accessToken }),
    }
  )
)

export default useAuthStore
