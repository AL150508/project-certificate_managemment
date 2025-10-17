export function WelcomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#E50914]/20 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#B1000E]/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-[#E50914]/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Ikuti Seminar & Training Online Bersertifikat
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            <span className="text-[#E50914]">DENGAN PEMATERI</span> PROFESIONAL
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Anda juga dapat menikmati software akuntansi online secara gratis di akuntanmu.com
          </p>
        </div>
        
        <a href="#activities" className="inline-block">
          <button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] hover:opacity-90 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            COBA SEKARANG
          </button>
        </a>
      </div>
    </section>
  )
}
