import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 1 },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: { iconTheme: { primary: '#0B7F3B', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
)
