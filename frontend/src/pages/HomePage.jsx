import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiCalendar, FiMapPin, FiAward, FiUsers, FiCpu, FiMessageSquare, FiExternalLink, FiArrowRight } from 'react-icons/fi'

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 19, minutes: 47, seconds: 42 })

  // Real-time Countdown Timer to the BAIO 2026 Exam Date (Sept 10, 2026)
  useEffect(() => {
    const targetDate = new Date('2026-09-10T10:00:00')
    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate - now

      if (difference <= 0) {
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Helmet>
        <title>Bharat AI Olympiad | India's Premier AI Olympiad Platform</title>
        <meta name="description" content="Join 50,000+ students in India's most prestigious AI olympiad. Register for national-level competitions in AI, Science, Mathematics and more." />
        <meta property="og:title" content="Bharat AI Olympiad - Register Now" />
        <meta property="og:description" content="India's premier AI olympiad for students of class 1-12. Win medals, certificates and scholarships." />
      </Helmet>

      <div className="relative min-h-0 bg-white" style={{ opacity: 1 }}>
        <div className="relative min-h-screen bg-white overflow-hidden">
          
          {/* Main Hero Section */}
          <section className="relative bg-transparent px-4 pb-6 md:px-8 md:pb-24 3xl:pb-36 pt-24">
            
            {/* Left Decorative Tech Flower SVG/Image */}
            <div className="pointer-events-none absolute md:-top-12 md:-left-60 -top-7 select-none">
              <div className="absolute z-30 pointer-events-none flex md:flex items-center" style={{ transform: 'rotate(10.926deg)' }}>
                <img 
                  alt="Decorative AI Grid Graphic" 
                  loading="lazy" 
                  width="1000" 
                  height="1000" 
                  className="opacity-20 md:w-[500px] 3xl:w-[600px] w-full"
                  src="/images/elements/tech_flower_blue.png" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* Right Decorative Tech Flower SVG/Image */}
            <div className="pointer-events-none absolute md:-top-12 md:-right-[76%] hidden md:block select-none">
              <div className="absolute z-30 pointer-events-none flex md:flex items-center" style={{ transform: 'rotate(-10.926deg)' }}>
                <img 
                  alt="Decorative AI Grid Graphic" 
                  loading="lazy" 
                  width="1000" 
                  height="1000" 
                  className="opacity-20 md:w-[500px] 3xl:w-[600px] w-full"
                  src="/images/elements/tech_flower_blue.png"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            <div className="mx-auto w-full items-center md:mt-24 mt-12 justify-center relative z-10">
              <div className="flex h-full flex-col items-center justify-center">
                
                {/* Location Badge */}
                <a 
                  href="https://maps.app.goo.gl/rb92hysFVshZMy2J6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mb-6 flex items-center gap-2 rounded-full bg-navy px-4 py-2 font-display text-sm md:text-base font-bold uppercase tracking-wider text-white hover:bg-navy-light transition-all shadow-md group active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="rotate-90 rounded-full border-2 p-0.5 group-hover:bg-white group-hover:text-navy transition-all duration-300">
                    <path d="M237.33,106.21,61.41,41l-.16-.05A16,16,0,0,0,40.9,61.25a1,1,0,0,0,.05.16l65.26,175.92A15.77,15.77,0,0,0,121.28,248h.3a15.77,15.77,0,0,0,15-11.29l.06-.2,21.84-78,78-21.84.2-.06a16,16,0,0,0,.62-30.38ZM149.84,144.3a8,8,0,0,0-5.54,5.54L121.3,232l-.06-.17L56,56l175.82,65.22.16.06Z"></path>
                  </svg>
                  <span>New Delhi, India (National Finals)</span>
                </a>

                {/* Main Premium Headline */}
                <h1 className="text-center font-display text-5xl uppercase tracking-wider text-navy font-black md:text-[80px] 3xl:text-[140px] mb-0 leading-tight md:leading-[5.5rem] 3xl:leading-[7.5rem]">
                  Build
                </h1>
                
                <h1 className="text-center font-display text-5xl uppercase tracking-wider text-navy font-black md:text-[80px] 3xl:text-[140px] mb-0 leading-tight md:leading-[5.5rem] 3xl:leading-[7.5rem]">
                  <span className="inline-flex items-center align-middle tracking-inherit">
                    <span className="inline-block">F</span>
                    <span className="inline-flex [margin-inline:0.025em] align-middle">
                      <span className="relative inline-flex items-center justify-center align-middle [margin-inline:0.02em] mb-3 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                        <svg className="absolute h-0 w-0" aria-hidden="true">
                          <defs>
                            <filter id="innerShadow-Rdp9u9kq" x="-50%" y="-50%" width="200%" height="200%">
                              <feComponentTransfer in="SourceAlpha">
                                <feFuncA type="table" tableValues="1 0"></feFuncA>
                              </feComponentTransfer>
                              <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                              <feOffset dx="0" dy="2" result="offsetblur"></feOffset>
                              <feFlood floodColor="rgba(255,255,255,0.15)" result="color"></feFlood>
                              <feComposite in2="offsetblur" operator="in"></feComposite>
                              <feComposite in2="SourceAlpha" operator="in"></feComposite>
                              <feMerge>
                                <feMergeNode in="SourceGraphic"></feMergeNode>
                                <feMergeNode></feMergeNode>
                              </feMerge>
                            </filter>
                            <filter id="diamondGlow-Rdp9u9kq" x="-150%" y="-150%" width="400%" height="400%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"></feGaussianBlur>
                              <feFlood floodColor="rgb(255, 255, 255)" floodOpacity="0.3"></feFlood>
                              <feComposite in2="blur" operator="in"></feComposite>
                              <feMerge>
                                <feMergeNode></feMergeNode>
                                <feMergeNode in="SourceGraphic"></feMergeNode>
                              </feMerge>
                            </filter>
                            <radialGradient id="outerShapeGradient-Rdp9u9kq" cx="30%" cy="30%" r="70%">
                              <stop offset="0%" stopColor="#ff9a00"></stop>
                              <stop offset="100%" stopColor="#d35400"></stop>
                            </radialGradient>
                          </defs>
                        </svg>
                        <svg viewBox="0 0 100 100" className="h-[0.75em] w-[0.75em] animate-diamond-rotate">
                          <path d="M50 0 C55 15, 65 15, 75 10 C70 25, 75 35, 90 35 C80 45, 80 55, 90 65 C75 65, 70 75, 75 90 C65 85, 55 85, 50 100 C45 85, 35 85, 25 90 C30 75, 25 65, 10 65 C20 55, 20 45, 10 35 C25 35, 30 25, 25 10 C35 15, 45 15, 50 0Z" fill="url(#outerShapeGradient-Rdp9u9kq)" filter="url(#innerShadow-Rdp9u9kq)"></path>
                          <path d="M50 0 C55 15, 65 15, 75 10 C70 25, 75 35, 90 35 C80 45, 80 55, 90 65 C75 65, 70 75, 75 90 C65 85, 55 85, 50 100 C45 85, 35 85, 25 90 C30 75, 25 65, 10 65 C20 55, 20 45, 10 35 C25 35, 30 25, 25 10 C35 15, 45 15, 50 0Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></path>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-[0.32em] w-[0.38em] animate-pulse" style={{ filter: 'url(#diamondGlow-Rdp9u9kq)' }}>
                            <path d="M24 4L28.4 16.8L41 24L28.4 31.2L24 44L19.6 31.2L7 24L19.6 16.8L24 4Z" fill="rgb(255, 255, 255)"></path>
                          </svg>
                        </span>
                      </span>
                    </span>
                    <span className="inline-block">r</span>
                  </span>
                </h1>
                
                <h1 className="mb-4 text-center font-display text-5xl uppercase tracking-wider text-navy font-black md:text-[80px] 3xl:text-[140px] leading-[4.0rem] md:leading-[5.5rem] 3xl:leading-[7.5rem]">
                  Better
                </h1>
                
                <p className="text-center font-sans text-lg font-semibold text-orange-dark mb-10 max-w-lg">
                  India's absolute premier national level AI and technology olympiad platform for future leaders.
                </p>
              </div>

              {/* Dynamic Interactive Timeline Slider */}
              <div className="md:mt-24 3xl:mt-32 mt-16 max-w-5xl mx-auto">
                <div className="mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-16" aria-label="BAIO 2026 Journey Timeline">
                  <div className="flex min-w-0 w-full items-center gap-2 sm:gap-3 md:gap-5 lg:gap-8">
                    <h3 className="shrink-0 max-w-[42%] text-2xl md:text-4xl font-black leading-none text-navy font-display tabular-nums">
                      15.06
                    </h3>
                    
                    {/* Horizontal Timeline Track */}
                    <div className="relative z-0 min-w-0 flex-1 [flex-basis:0]">
                      <div className="relative h-10 w-full min-w-0 min-h-0 touch-manipulation md:h-12 flex items-center">
                        
                        {/* Background bar */}
                        <div className="absolute left-0 right-0 h-[3px] bg-navy/10 rounded-full"></div>
                        
                        {/* Progressive active bar */}
                        <div className="absolute left-0 right-[40%] h-[3px] gradient-orange rounded-full"></div>
                        
                        {/* Timeline Points */}
                        <div className="relative w-full h-full">
                          
                          {/* Point 1: 15.06 (10%) */}
                          <div className="group absolute top-1/2 z-20 -translate-y-1/2" style={{ left: '10%' }}>
                            <div className="cursor-pointer transition-transform duration-300 hover:scale-125 w-4 h-4 rounded-full bg-navy border-4 border-white shadow shadow-navy/30"></div>
                            
                            {/* Card Tooltip */}
                            <div className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 shadow-2xl">
                              <div className="overflow-hidden rounded-2xl border border-navy/20 bg-white">
                                <div className="p-2 text-center bg-gray-50 border-b border-gray-100">
                                  <p className="font-sans text-xs font-bold text-navy">June 15, 2026</p>
                                </div>
                                <div className="relative h-24 w-full bg-navy flex items-center justify-center overflow-hidden">
                                  <FiUsers size={48} className="text-white/40 animate-pulse" />
                                </div>
                                <div className="bg-navy p-2 rounded-b-2xl">
                                  <p className="text-center font-display text-xs font-black uppercase text-white leading-none">Registrations Open</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Point 2: 30.07 (30%) */}
                          <div className="group absolute top-1/2 z-20 -translate-y-1/2" style={{ left: '30%' }}>
                            <div className="cursor-pointer transition-transform duration-300 hover:scale-125 w-4 h-4 rounded-full bg-navy border-4 border-white shadow shadow-navy/30"></div>
                            
                            {/* Card Tooltip */}
                            <div className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 shadow-2xl">
                              <div className="overflow-hidden rounded-2xl border border-navy/20 bg-white">
                                <div className="p-2 text-center bg-gray-50 border-b border-gray-100">
                                  <p className="font-sans text-xs font-bold text-navy">July 30, 2026</p>
                                </div>
                                <div className="relative h-24 w-full bg-navy-light flex items-center justify-center overflow-hidden">
                                  <FiCpu size={48} className="text-white/40" />
                                </div>
                                <div className="bg-navy-light p-2 rounded-b-2xl">
                                  <p className="text-center font-display text-xs font-black uppercase text-white leading-none">Mock Prep Tests</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Point 3: 15.08 (50%) */}
                          <div className="group absolute top-1/2 z-20 -translate-y-1/2" style={{ left: '50%' }}>
                            <div className="cursor-pointer transition-transform duration-300 hover:scale-125 w-5 h-5 rounded-full bg-orange border-4 border-white shadow shadow-orange/40"></div>
                            
                            {/* Card Tooltip */}
                            <div className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 shadow-2xl">
                              <div className="overflow-hidden rounded-2xl border border-orange/20 bg-white">
                                <div className="p-2 text-center bg-gray-50 border-b border-gray-100">
                                  <p className="font-sans text-xs font-bold text-orange-dark">August 15, 2026</p>
                                </div>
                                <div className="relative h-24 w-full bg-orange flex items-center justify-center overflow-hidden">
                                  <FiCalendar size={48} className="text-white/40" />
                                </div>
                                <div className="bg-orange p-2 rounded-b-2xl">
                                  <p className="text-center font-display text-xs font-black uppercase text-white leading-none">Last Date to Apply</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Point 4: 10.09 (70%) */}
                          <div className="group absolute top-1/2 z-20 -translate-y-1/2" style={{ left: '70%' }}>
                            <div className="cursor-pointer transition-transform duration-300 hover:scale-125 w-4 h-4 rounded-full bg-navy border-4 border-white shadow shadow-navy/30"></div>
                            
                            {/* Card Tooltip */}
                            <div className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 shadow-2xl">
                              <div className="overflow-hidden rounded-2xl border border-navy/20 bg-white">
                                <div className="p-2 text-center bg-gray-50 border-b border-gray-100">
                                  <p className="font-sans text-xs font-bold text-navy">Sept 10, 2026</p>
                                </div>
                                <div className="relative h-24 w-full bg-[#1c6fff] flex items-center justify-center overflow-hidden">
                                  <FiAward size={48} className="text-white/40" />
                                </div>
                                <div className="bg-[#1c6fff] p-2 rounded-b-2xl">
                                  <p className="text-center font-display text-xs font-black uppercase text-white leading-none">National Exam Day</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Point 5: 25.09 (90%) */}
                          <div className="group absolute top-1/2 z-20 -translate-y-1/2" style={{ left: '90%' }}>
                            <div className="cursor-pointer transition-transform duration-300 hover:scale-125 w-4 h-4 rounded-full bg-navy border-4 border-white shadow shadow-navy/30"></div>
                            
                            {/* Card Tooltip */}
                            <div className="invisible pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 shadow-2xl">
                              <div className="overflow-hidden rounded-2xl border border-navy/20 bg-white">
                                <div className="p-2 text-center bg-gray-50 border-b border-gray-100">
                                  <p className="font-sans text-xs font-bold text-navy">Sept 25, 2026</p>
                                </div>
                                <div className="relative h-24 w-full bg-green flex items-center justify-center overflow-hidden">
                                  <FiMessageSquare size={48} className="text-white/40" />
                                </div>
                                <div className="bg-green p-2 rounded-b-2xl">
                                  <p className="text-center font-display text-xs font-black uppercase text-white leading-none">Results & Answer Key</p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <h3 className="shrink-0 max-w-[42%] text-right text-2xl md:text-4xl font-black leading-none text-navy font-display tabular-nums">
                      25.09
                    </h3>
                  </div>
                </div>
              </div>

              {/* Sub-Hero Contacts Bar */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between md:mt-20 mt-12 pt-6 border-t border-gray-100 max-w-5xl mx-auto">
                <div className="flex items-center justify-center">
                  <a 
                    href="mailto:partner@baio.in" 
                    className="text-center text-xs font-display text-navy md:text-sm font-semibold hover:text-[#FF8C00] transition-colors"
                  >
                    Interested in institutional or school partnerships? <span className="underline">Reach out to us!</span>
                  </a>
                </div>
                
                {/* Social Icons matching original visual weight */}
                <div className="flex items-center justify-center gap-6 text-navy/70">
                  <a href="https://discord.gg/baio" target="_blank" rel="noopener noreferrer" className="hover:text-navy hover:scale-110 transition-all" aria-label="BAIO Discord">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm60-12a12,12,0,1,0,12,12A12,12,0,0,0,164,128Zm74.45,64.9-67,29.71a16.17,16.17,0,0,1-21.71-9.1l-8.11-22q-6.72.45-13.63.46t-13.63-.46l-8.11,22a16.18,16.18,0,0,1-21.71,9.1l-67-29.71a15.93,15.93,0,0,1-9.06-18.51L38,58A16.07,16.07,0,0,1,51,46.14l36.06-5.93a16.22,16.22,0,0,1,18.26,11.88l3.26,12.84Q118.11,64,128,64t19.4.93l3.26-12.84a16.21,16.21,0,0,1,18.26-11.88L205,46.14A16.07,16.07,0,0,1,218,58l29.53,116.38A15.93,15.93,0,0,1,238.45,192.9ZM232,178.28,202.47,62s0,0-.08,0L166.33,56a.17.17,0,0,0-.17,0l-2.83,11.14c5,.94,10,2.06,14.83,3.42A8,8,0,0,1,176,86.31a8.09,8.09,0,0,1-2.16-.3A172.25,172.25,0,0,0,128,80a172.25,172.25,0,0,0-45.84,6,8,8,0,1,1-4.32-15.4c4.82-1.36,9.78-2.48,14.82-3.42L89.83,56s0,0-.12,0h0L53.61,61.93a.17.17,0,0,0-.09,0L24,178.33,91,208a.23.23,0,0,0,.22,0L98,189.72a173.2,173.2,0,0,1-20.14-4.32A8,8,0,0,1,82.16,170,171.85,171.85,0,0,0,128,176a171.85,171.85,0,0,0,45.84-6,8,8,0,0,1,4.32,15.41A173.2,173.2,0,0,1,158,189.72L164.75,208a.22.22,0,0,0,.21,0Z"></path>
                    </svg>
                  </a>
                  <a href="https://instagram.com/baio_olympiad" target="_blank" rel="noopener noreferrer" className="hover:text-navy hover:scale-110 transition-all" aria-label="BAIO Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                    </svg>
                  </a>
                  <a href="https://twitter.com/baio_olympiad" target="_blank" rel="noopener noreferrer" className="hover:text-navy hover:scale-110 transition-all" aria-label="BAIO X (Twitter)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/company/baio" target="_blank" rel="noopener noreferrer" className="hover:text-navy hover:scale-110 transition-all" aria-label="BAIO LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Countdown Banner Section */}
          <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 bg-navy shadow-inner" aria-label="Countdown timer">
            
            {/* Tilted Graphic Contour background */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-10 select-none">
              <img src="/gifs/contour_lines_fat1.gif" alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-white">
              <h2 className="grid w-full grid-cols-[1fr_auto_1fr] items-baseline text-center font-display text-3xl md:text-6xl font-black uppercase leading-[0.95] tracking-wide">
                <span className="col-start-2">REGISTRATION CLOSES IN</span>
                <span aria-hidden="true" className="col-start-3 justify-self-start pl-2 text-left text-[#FF8C00] animate-pulse">...</span>
              </h2>

              {/* Dynamic Counters grid */}
              <div className="mt-8 grid w-full grid-cols-4 gap-2 sm:mt-12 sm:gap-6 md:gap-8 max-w-3xl">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-lg">
                  <p className="font-display text-[2.5rem] sm:text-[4rem] md:text-[6rem] font-black leading-none tracking-normal tabular-nums text-white">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-xs md:text-sm font-bold uppercase tracking-wider text-orange">Days</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-lg">
                  <p className="font-display text-[2.5rem] sm:text-[4rem] md:text-[6rem] font-black leading-none tracking-normal tabular-nums text-white">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-xs md:text-sm font-bold uppercase tracking-wider text-orange">Hours</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-lg">
                  <p className="font-display text-[2.5rem] sm:text-[4rem] md:text-[6rem] font-black leading-none tracking-normal tabular-nums text-white">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-xs md:text-sm font-bold uppercase tracking-wider text-orange">Minutes</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-lg">
                  <p className="font-display text-[2.5rem] sm:text-[4rem] md:text-[6rem] font-black leading-none tracking-normal tabular-nums text-white animate-pulse">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-xs md:text-sm font-bold uppercase tracking-wider text-orange">Seconds</p>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white px-4 py-14 sm:px-6 md:px-8 md:py-24" id="about">
            <div className="mx-auto w-full max-w-6xl">
              
              {/* Pill Badge */}
              <div className="mx-auto mb-6 w-fit rounded-full bg-navy px-5 py-2 shadow-md">
                <p className="font-display text-xs md:text-sm font-bold uppercase tracking-wide text-white">About BAIO Platform</p>
              </div>
              
              <h2 className="mx-auto max-w-4xl text-center font-display text-3xl md:text-6xl font-black uppercase leading-[0.95] tracking-normal text-navy">
                Empowering India's students with futuristic AI literacy and national ranks.
              </h2>

              {/* Tilted Photo Cards Grid (Desktop) */}
              <div className="relative mx-auto mt-16 hidden w-full max-w-[980px] md:block h-[380px] select-none">
                
                {/* Left Card */}
                <div className="absolute -left-4 top-14 z-20 -rotate-6 transition-all duration-300 hover:scale-105 hover:-translate-y-4">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] h-[250px] w-[340px] border-4 border-white">
                    <img src="/images/regular/github_expert.png" alt="Olympiad Student Prep" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"; }} />
                  </div>
                </div>

                {/* Center Main Card */}
                <div className="absolute inset-x-0 top-0 z-30 flex justify-center transition-all duration-300 hover:scale-105 hover:-translate-y-4">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] h-[330px] w-[560px] border-4 border-white">
                    <img src="/images/regular/bonfire_night.png" alt="AI Seminar Event" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"; }} />
                  </div>
                </div>

                {/* Right Card */}
                <div className="absolute right-1 top-14 z-40 rotate-[6deg] transition-all duration-300 hover:scale-105 hover:-translate-y-4">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] h-[250px] w-[340px] border-4 border-white">
                    <img src="/images/regular/hacker_coding.png" alt="Coding Competition" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500"; }} />
                  </div>
                </div>

              </div>

              {/* Tilted Photo Cards Grid (Mobile Stacked) */}
              <div className="relative mx-auto mt-12 h-[690px] w-full max-w-[440px] md:hidden">
                <div className="absolute left-1/2 top-0 z-10 w-[min(100%,440px)] -translate-x-1/2 -rotate-6">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-xl h-[200px] w-[80vw] mx-auto border-4 border-white">
                    <img src="/images/regular/github_expert.png" alt="Olympiad Prep" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"; }} />
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-[185px] z-20 w-[min(100%,440px)] -translate-x-1/2">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-xl h-[260px] w-[88vw] mx-auto border-4 border-white">
                    <img src="/images/regular/bonfire_night.png" alt="AI Event" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"; }} />
                  </div>
                </div>
                
                <div className="absolute left-1/2 top-[460px] z-30 w-[min(100%,440px)] -translate-x-1/2 rotate-6">
                  <div className="overflow-hidden rounded-[30px] bg-white shadow-xl h-[200px] w-[80vw] mx-auto border-4 border-white">
                    <img src="/images/regular/hacker_coding.png" alt="Coding" className="h-full w-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500"; }} />
                  </div>
                </div>
              </div>

              {/* Date & City columns (Desktop) */}
              <div className="mx-auto mt-12 hidden max-w-5xl items-end text-navy md:grid md:grid-cols-[1fr_minmax(220px,0.9fr)_1fr]">
                <div className="justify-self-start text-center">
                  <p className="text-xl font-semibold font-display">Exam Date:</p>
                  <p className="text-5xl font-black font-display leading-none text-orange">10 Sept 2026</p>
                </div>
                <div className="mb-3 h-1 w-full bg-navy/15 rounded-full"></div>
                <div className="justify-self-end text-center">
                  <p className="text-xl font-semibold font-display">Platform Status:</p>
                  <p className="text-5xl font-black font-display uppercase leading-none text-green-light">ONLINE EXAM</p>
                </div>
              </div>

              {/* Date & City columns (Mobile) */}
              <div className="mx-auto mt-8 max-w-md space-y-6 text-center text-navy md:hidden">
                <div className="h-px bg-navy/10"></div>
                <div>
                  <p className="text-lg font-bold font-display text-navy/70">Exam Date:</p>
                  <p className="text-3xl font-black font-display uppercase leading-none text-orange">10 Sept 2026</p>
                </div>
                <div className="h-px bg-navy/10"></div>
                <div>
                  <p className="text-lg font-bold font-display text-navy/70">Platform Status:</p>
                  <p className="text-3xl font-black font-display uppercase leading-none text-green-light">ONLINE EXAM</p>
                </div>
              </div>

              {/* Read More Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                <div className="group inline-flex items-center gap-2">
                  <Link to="/about" className="inline-flex rounded-full border-2 border-navy px-6 py-2.5 font-display text-sm font-black uppercase text-navy hover:bg-navy hover:text-white transition-all shadow-sm active:scale-95">
                    Read More About BAIO
                  </Link>
                  <span className="inline-flex rounded-full border-2 border-navy p-2.5 text-navy group-hover:bg-navy group-hover:text-white transition-all duration-300">
                    <FiArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </span>
                </div>
                
                <div className="group inline-flex items-center gap-2">
                  <Link to="/olympiads" className="inline-flex rounded-full border-2 border-navy px-6 py-2.5 font-display text-sm font-black uppercase text-navy hover:bg-navy hover:text-white transition-all shadow-sm active:scale-95">
                    Explore Active Olympiads
                  </Link>
                  <span className="inline-flex rounded-full border-2 border-navy p-2.5 text-navy group-hover:bg-navy group-hover:text-white transition-all duration-300">
                    <FiArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* CTA Devfolio Register Now Section */}
          <div className="group w-full overflow-hidden px-4 py-6 bg-orange shadow-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-6 sm:gap-8">
              <span className="inline-flex shrink-0 items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-90 text-white">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M24 5L24 43"></path>
                  <path d="M7.5 14L40.5 34"></path>
                  <path d="M40.5 14L7.5 34"></path>
                </svg>
              </span>
              <Link to="/register" className="text-center font-display text-xl sm:text-3xl md:text-5xl font-black uppercase leading-none text-white hover:underline transition-all tracking-wider">
                Register For BAIO 2026 Now
              </Link>
              <span className="inline-flex shrink-0 items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-90 text-white">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M24 5L24 43"></path>
                  <path d="M7.5 14L40.5 34"></path>
                  <path d="M40.5 14L7.5 34"></path>
                </svg>
              </span>
            </div>
          </div>

          {/* Top Picks / What's Expected Section */}
          <section className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-10 md:py-24 bg-transparent">
            
            {/* Decorative Grid Overlays */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-navy/5 select-none" aria-hidden="true"></div>
            <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
              <img src="/gifs/contour_lines_fat1.gif" alt="" className="h-full w-full object-cover opacity-20" draggable="false" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-7xl">
              
              <div className="mx-auto w-fit rounded-full px-5 py-2 bg-navy shadow-md">
                <p className="font-display text-xs md:text-sm font-bold uppercase leading-none text-white">Platform Benefits</p>
              </div>
              
              <h2 className="mx-auto mt-6 max-w-3xl text-center font-display text-3xl md:text-6xl font-black uppercase leading-[0.9] text-navy">
                Key Features of BAIO 2026
              </h2>

              {/* Grid (Desktop) */}
              <div className="mt-16 hidden grid-cols-3 items-center gap-x-10 gap-y-12 md:grid select-none">
                
                <div className="text-center">
                  <p className="font-display text-[60px] font-black uppercase leading-[0.9] text-orange">₹5,00,000+</p>
                  <p className="mt-2 font-display text-[22px] font-bold uppercase leading-none text-navy">Prize & Scholarship Pool</p>
                </div>
                
                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] -rotate-[4deg] border-navy/20 transition-all duration-300 hover:rotate-0 hover:scale-105">
                  <div className="px-6 pb-5 pt-7 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">Registration Timeline</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">Online & In-Person</h3>
                  </div>
                  <div className="px-4 py-3.5 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Class 1 to 12 Eligible</p>
                  </div>
                </article>

                <div className="text-center">
                  <p className="font-display text-[60px] font-black uppercase leading-[0.9] text-orange">50,000+</p>
                  <p className="mt-2 font-display text-[22px] font-bold uppercase leading-none text-navy">Active Competitors</p>
                </div>

                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] rotate-[5deg] border-navy/20 transition-all duration-300 hover:rotate-0 hover:scale-105">
                  <div className="px-6 pb-5 pt-7 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">National Level Ranking</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">AI Certifications</h3>
                  </div>
                  <div className="px-4 py-3.5 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Skill Verification</p>
                  </div>
                </article>

                <div className="text-center">
                  <p className="font-display text-[60px] font-black uppercase leading-[0.9] text-orange">100%</p>
                  <p className="mt-2 font-display text-[22px] font-bold uppercase leading-none text-navy">Transparent Scoring</p>
                </div>

                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] -rotate-[5deg] border-navy/20 transition-all duration-300 hover:rotate-0 hover:scale-105">
                  <div className="px-6 pb-5 pt-7 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">Prep & Resources</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">AI Study Kits</h3>
                  </div>
                  <div className="px-4 py-3.5 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Free Practice Papers</p>
                  </div>
                </article>

              </div>

              {/* Grid (Mobile Stacked Layout) */}
              <div className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-10 md:hidden select-none">
                
                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-md -rotate-[4deg] border-navy/20">
                  <div className="px-6 pb-4 pt-6 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">Olympiad Categories</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">Online & In-Person</h3>
                  </div>
                  <div className="px-4 py-3 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Class 1 to 12 Eligible</p>
                  </div>
                </article>

                <div className="text-center">
                  <p className="font-display text-5xl font-black uppercase leading-[0.9] text-orange">₹5,00,000+</p>
                  <p className="mt-2 font-display text-lg font-bold uppercase leading-none text-navy">Prize & Scholarship Pool</p>
                </div>

                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-md rotate-[4deg] border-navy/20">
                  <div className="px-6 pb-4 pt-6 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">National Level Ranking</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">AI Certifications</h3>
                  </div>
                  <div className="px-4 py-3 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Skill Verification</p>
                  </div>
                </article>

                <div className="text-center">
                  <p className="font-display text-5xl font-black uppercase leading-[0.9] text-orange">50,000+</p>
                  <p className="mt-2 font-display text-lg font-bold uppercase leading-none text-navy">Active Competitors</p>
                </div>

                <article className="w-full max-w-[460px] overflow-hidden rounded-[22px] border bg-white shadow-md -rotate-[4deg] border-navy/20">
                  <div className="px-6 pb-4 pt-6 text-center sm:px-8">
                    <p className="font-display text-xs font-bold uppercase text-orange-dark">Prep & Resources</p>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.9] text-navy">AI Study Kits</h3>
                  </div>
                  <div className="px-4 py-3 text-center bg-navy">
                    <p className="font-display text-sm font-bold uppercase leading-none text-white">Free Practice Papers</p>
                  </div>
                </article>

                <div className="text-center">
                  <p className="font-display text-5xl font-black uppercase leading-[0.9] text-orange">100%</p>
                  <p className="mt-2 font-display text-lg font-bold uppercase leading-none text-navy">Transparent Scoring</p>
                </div>
              </div>

              {/* Explore Agenda Route */}
              <div className="mt-12 flex justify-center md:mt-16">
                <Link to="/olympiads" className="rounded-full px-8 py-3.5 font-display text-lg sm:text-2xl font-black uppercase leading-none text-white bg-navy hover:bg-navy-light transition-all shadow-md active:scale-95 tracking-wide">
                  Explore Active Olympiads
                </Link>
              </div>

            </div>
          </section>

          {/* Running Ticker Tape Marquee Section */}
          <div className="relative w-full overflow-hidden h-14 bg-navy flex items-center select-none shadow-md">
            <div className="animate-marquee flex whitespace-nowrap items-center py-2">
              
              {/* Ticker Batch 1 */}
              <div className="flex shrink-0 items-center gap-12 text-white/90">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Build For Future</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Innovate with AI</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Compete & Excel</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">National Rank Certificates</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Ticker Batch 2 (Duplicate for Seamless Infinite Loop) */}
              <div className="flex shrink-0 items-center gap-12 text-white/90 ml-12">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Build For Future</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Innovate with AI</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">Compete & Excel</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl font-black uppercase tracking-wide">National Rank Certificates</span>
                  <span className="inline-flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M24 5L24 43"></path>
                      <path d="M7.5 14L40.5 34"></path>
                      <path d="M40.5 14L7.5 34"></path>
                    </svg>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
