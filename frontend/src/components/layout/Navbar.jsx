import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiGrid, FiUsers, FiAward } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { student, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {}
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      {/* Floating Logo and Auth Header for Desktop (floats on the left, independent of fixed vertical sidebar) */}
      <header className="fixed top-0 left-0 right-0 md:right-[24rem] h-20 z-40 bg-transparent pointer-events-none">
        <div className="container-custom h-full flex items-center justify-between px-6 pointer-events-auto">
          {/* Logo - floating on left */}
          <Link to="/" className="flex items-center gap-3 group bg-[#001040]/45 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg transition-all hover:bg-[#001040]/60">
            <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow shadow-orange/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight tracking-wide font-display">
                BHARAT AI
              </div>
              <div className="text-[#FF8C00] text-[9px] font-bold tracking-widest uppercase">
                OLYMPIAD
              </div>
            </div>
          </Link>

          {/* Desktop Auth Buttons (floating on top right before sidebar) */}
          <div className="hidden md:flex items-center gap-3">
            {student ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001040]/80 backdrop-blur-md text-white border border-white/10 shadow-lg hover:bg-[#001040]/95 transition-all"
                >
                  <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-xs font-bold shadow-sm">
                    {student.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold max-w-[120px] truncate">{student.fullName}</span>
                  <FiChevronDown className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-52 bg-[#001040]/98 border border-white/15 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiGrid size={14} /> My Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/10 text-sm font-medium transition-colors border-t border-white/5"
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-2 bg-[#001040]/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
                <Link to="/login" className="px-4 py-2 text-xs font-bold text-white hover:text-[#FF8C00] transition-colors rounded-xl">
                  Student Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-xs font-bold text-white bg-orange hover:bg-orange-dark shadow-sm transition-colors rounded-xl">
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Sidebar Wrapper Container */}
      <div className="order-2 md:order-none md:fixed md:inset-y-0 md:right-0 md:w-[24rem] md:z-50">
        
        {/* Desktop Fixed Vertical Bar Nav */}
        <nav className="hidden md:block h-full w-full relative">
          
          {/* Central Overlapping Floating Highlight Cards */}
          <div className="absolute top-[67%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center pointer-events-none">
            
            {/* BAIO 2025 Card */}
            <div className="absolute pointer-events-auto" style={{ transform: 'translateX(-85px)' }}>
              <div className="group relative flex h-48 w-48 cursor-pointer flex-col justify-start rounded-xl bg-white p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2" style={{ zIndex: 10 }}>
                <div className="z-10">
                  <h2 className="mt-1 text-base text-black font-display font-black leading-tight">BAIO 2025</h2>
                  <p className="mt-1 text-xs text-gray-500 font-sans font-semibold">50,000+ Students Registered</p>
                </div>
                <div className="absolute bottom-0 right-0 h-48 w-full overflow-hidden rounded-xl">
                  <div className="absolute bottom-[-10px] -right-2 h-28 w-28 rounded-lg border-4 border-white gradient-navy flex items-center justify-center shadow-md transform rotate-[-6deg]">
                    <FiUsers size={36} className="text-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* BAIO 2026 Card */}
            <div className="absolute rounded-xl pointer-events-auto" style={{ transform: 'translateX(75px)', boxShadow: '-20px 0 40px rgba(0,0,0,0.15)' }}>
              <div className="group relative flex h-48 w-48 cursor-pointer flex-col justify-start rounded-xl bg-white p-4 shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2" style={{ zIndex: 0 }}>
                <div className="z-10">
                  <h2 className="mt-1 text-base text-black font-display font-black leading-tight">BAIO 2026</h2>
                  <p className="mt-1 text-xs text-gray-500 font-sans font-semibold">National-Level Competition</p>
                </div>
                <div className="absolute bottom-0 right-0 h-48 w-full overflow-hidden rounded-xl">
                  <div className="absolute bottom-[-10px] -right-2 h-28 w-28 rounded-lg border-4 border-white gradient-orange flex items-center justify-center shadow-md transform rotate-[6deg]">
                    <FiAward size={36} className="text-white/80" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 5 Vertical Column Links */}
          <div className="flex flex-row h-full w-full">
            
            {/* Column 1: ABOUT */}
            <Link className="block h-full group" style={{ width: 'calc(100% / 5)' }} to="/about">
              <div className="relative flex w-full h-full items-start justify-center py-6 transition-all border-r border-white/20 duration-500 bg-fivenary overflow-hidden group-hover:brightness-110">
                <span className="text-[52px] font-display font-black uppercase tracking-widest text-white transform rotate-180 select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>ABOUT</span>
                <span className="pointer-events-none absolute left-1/2 bottom-10 -translate-x-1/2 block w-[2px] h-[0px] bg-white transition-[height] duration-500 group-hover:h-[280px]" aria-hidden="true"></span>
                <span className="pointer-events-none absolute z-40 left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-[300px] text-[48px] font-display font-bold text-white -rotate-90 transition-all duration-500">01</span>
              </div>
            </Link>

            {/* Column 2: OLYMPIADS */}
            <Link className="block h-full group" style={{ width: 'calc(100% / 5)' }} to="/olympiads">
              <div className="relative flex w-full h-full items-start justify-center py-6 transition-all border-r border-white/20 duration-500 bg-quaternary overflow-hidden group-hover:brightness-110">
                <span className="text-[52px] font-display font-black uppercase tracking-widest text-white transform rotate-180 select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>OLYMPIADS</span>
                <span className="pointer-events-none absolute left-1/2 bottom-10 -translate-x-1/2 block w-[2px] h-[0px] bg-white transition-[height] duration-500 group-hover:h-[280px]" aria-hidden="true"></span>
                <span className="pointer-events-none absolute z-40 left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-[300px] text-[48px] font-display font-bold text-white -rotate-90 transition-all duration-500">02</span>
              </div>
            </Link>

            {/* Column 3: RESULTS */}
            <Link className="block h-full group" style={{ width: 'calc(100% / 5)' }} to="/results">
              <div className="relative flex w-full h-full items-start justify-center py-6 transition-all border-r border-white/20 duration-500 bg-eightnary overflow-hidden group-hover:brightness-110">
                <span className="text-[52px] font-display font-black uppercase tracking-widest text-white transform rotate-180 select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>RESULTS</span>
                <span className="pointer-events-none absolute left-1/2 bottom-10 -translate-x-1/2 block w-[2px] h-[0px] bg-white transition-[height] duration-500 group-hover:h-[280px]" aria-hidden="true"></span>
                <span className="pointer-events-none absolute z-40 left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-[300px] text-[48px] font-display font-bold text-white -rotate-90 transition-all duration-500">03</span>
              </div>
            </Link>

            {/* Column 4: ANNOUNCEMENTS */}
            <Link className="block h-full group" style={{ width: 'calc(100% / 5)' }} to="/announcements">
              <div className="relative flex w-full h-full items-start justify-center py-6 transition-all border-r border-white/20 duration-500 bg-tertiary overflow-hidden group-hover:brightness-110">
                <span className="text-[52px] font-display font-black uppercase tracking-widest text-white transform rotate-180 select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>NOTICES</span>
                <span className="pointer-events-none absolute left-1/2 bottom-10 -translate-x-1/2 block w-[2px] h-[0px] bg-white transition-[height] duration-500 group-hover:h-[280px]" aria-hidden="true"></span>
                <span className="pointer-events-none absolute z-40 left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-[300px] text-[48px] font-display font-bold text-white -rotate-90 transition-all duration-500">04</span>
              </div>
            </Link>

            {/* Column 5: CONTACT */}
            <Link className="block h-full group" style={{ width: 'calc(100% / 5)' }} to="/contact">
              <div className="relative flex w-full h-full items-start justify-center py-6 transition-all border-r border-white/20 duration-500 bg-sixthary overflow-hidden group-hover:brightness-110">
                <span className="text-[52px] font-display font-black uppercase tracking-widest text-white transform rotate-180 select-none" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>CONTACT</span>
                <span className="pointer-events-none absolute left-1/2 bottom-10 -translate-x-1/2 block w-[2px] h-[0px] bg-white transition-[height] duration-500 group-hover:h-[280px]" aria-hidden="true"></span>
                <span className="pointer-events-none absolute z-40 left-1/2 -translate-x-1/2 bottom-10 opacity-0 group-hover:opacity-100 group-hover:bottom-[300px] text-[48px] font-display font-bold text-white -rotate-90 transition-all duration-500">05</span>
              </div>
            </Link>

          </div>
        </nav>

        {/* Mobile Burger Menu Button */}
        <button 
          aria-label="Toggle menu" 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed right-4 top-4 z-50 flex items-center justify-center rounded-full border-2 bg-white p-3 shadow-lg border-navy text-navy transition-all duration-200 active:scale-95"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Menu Slide-in Drawer */}
        <div 
          className={`md:hidden fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
        ></div>

        <div 
          className={`md:hidden fixed inset-0 z-40 overflow-y-auto bg-[#f6f6f6] px-5 py-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col rounded-[28px] border border-black/10 bg-[#f3f3f3] p-5 pb-7 shadow-xl">
            
            {/* Mobile Drawer Header */}
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center shadow">
                  <span className="text-white font-black text-sm">B</span>
                </div>
                <div>
                  <div className="text-navy font-black text-sm leading-tight tracking-wide font-display">BHARAT AI</div>
                  <div className="text-orange text-[9px] font-bold tracking-wider uppercase -mt-0.5">OLYMPIAD</div>
                </div>
              </Link>
              <button 
                aria-label="Close menu" 
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy text-navy active:scale-95 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Mobile Navigation Drawer Links */}
            <nav className="flex flex-col gap-1.5">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-primary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">HOME</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">00</span>
                </div>
              </Link>
              <Link to="/about" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-fivenary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">ABOUT</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">01</span>
                </div>
              </Link>
              <Link to="/olympiads" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-quaternary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">OLYMPIADS</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">02</span>
                </div>
              </Link>
              <Link to="/results" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-eightnary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">RESULTS</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">03</span>
                </div>
              </Link>
              <Link to="/announcements" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-tertiary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">NOTICES</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">04</span>
                </div>
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <div className="flex items-center rounded-[24px] px-5 py-2.5 transition-all bg-sixthary hover:scale-[0.99] active:scale-95 shadow">
                  <span className="text-[1.3rem] font-black font-display uppercase leading-none text-white">CONTACT</span>
                  <span className="mx-4 h-[2px] flex-1 bg-white/85" aria-hidden="true"></span>
                  <span className="text-[2rem] font-bold tracking-wide font-display leading-none text-white">05</span>
                </div>
              </Link>
            </nav>

            {/* Mobile Drawer Auth Actions */}
            <div className="mt-4 pt-4 border-t border-black/10 flex gap-3">
              {student ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="btn-navy !text-xs !py-3 flex-1 text-center font-bold" 
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }} 
                    className="btn-secondary !text-xs !py-3 flex-1 !border-rose-400 !text-rose-600 font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn-secondary !text-xs !py-3 flex-1 text-center !text-navy !border-navy font-bold" 
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary !text-xs !py-3 flex-1 text-center font-bold" 
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Drawer Radial Graphic Footer */}
            <div className="mt-4 flex flex-1 min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] bg-radial p-4 relative shadow-lg">
              
              {/* Spinning Tech / AI Element Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none scale-75 animate-rotate-slow">
                <svg width="400" height="400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.2" />
                  <path d="M50 0 L50 100 M0 50 L100 50 M15 15 L85 85 M15 85 L85 15" stroke="white" strokeWidth="0.3" />
                </svg>
              </div>

              {/* Small BAIO 2025 Card */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 rotate-[-8deg] scale-[0.80] z-10 shadow-lg">
                <div className="flex flex-col justify-start rounded-xl bg-white p-3 shadow-md h-32 w-32 relative overflow-hidden">
                  <h3 className="text-xs font-black text-black font-display leading-tight">BAIO 2025</h3>
                  <p className="text-[10px] text-gray-500 font-sans font-semibold">50k+ Registered</p>
                  <div className="absolute bottom-[-10px] -right-2 h-16 w-16 bg-navy text-white rounded-lg flex items-center justify-center shadow rotate-[-6deg]">
                    <FiUsers size={20} />
                  </div>
                </div>
              </div>

              {/* Small BAIO 2026 Card */}
              <div className="absolute right-2 top-1/2 mt-4 -translate-y-1/2 rotate-[8deg] scale-[0.80] z-10 shadow-lg">
                <div className="flex flex-col justify-start rounded-xl bg-white p-3 shadow-md h-32 w-32 relative overflow-hidden">
                  <h3 className="text-xs font-black text-black font-display leading-tight">BAIO 2026</h3>
                  <p className="text-[10px] text-gray-500 font-sans font-semibold">Register Today!</p>
                  <div className="absolute bottom-[-10px] -right-2 h-16 w-16 bg-orange text-white rounded-lg flex items-center justify-center shadow rotate-[6deg]">
                    <FiAward size={20} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </>
  )
}
