export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center gradient-navy">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF8C00] animate-spin" />
          <div className="absolute inset-2 rounded-full gradient-orange flex items-center justify-center">
            <span className="text-white font-black text-2xl">B</span>
          </div>
        </div>
        <p className="text-white font-semibold text-lg font-display tracking-wide">BHARAT AI OLYMPIAD</p>
        <p className="text-white/50 text-sm mt-1">Loading...</p>
      </div>
    </div>
  )
}
