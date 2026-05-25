import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function MainLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen md:pr-[24rem]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
