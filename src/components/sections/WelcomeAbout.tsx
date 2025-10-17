export function WelcomeAbout() {
  return (
    <section id="about" className="py-16 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Tentang e-Certificate.</h2>
            <div className="w-16 h-1 bg-[#E50914] mb-6"></div>

            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              e-certificate.my.id merupakan platform pembuatan sertifikat secara online dan gratis.
              e-certificate.my.id akan memudahkan anda dalam menerbitkan sertifikat dalam jumlah banyak
              dalam hitungan detik.
            </p>

            <button className="bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105">
              Kontak Kami
            </button>
          </div>

          <div className="relative">
            <div className="bg-[#121212] border border-[#1f1f1f] rounded-lg p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#E50914] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">e</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">SERTIFIKAT</h3>
                <p className="text-sm text-white/70 mb-4">FF777E32/JBK/IX/2020</p>
                <p className="text-sm text-white/80 mb-4">
                  Sertifikat ini diberikan kepada : <strong>NURTIYAS</strong> atas partisipasinya sebagai : <strong>PESERTA</strong>
                </p>
                <p className="text-sm text-white/80 mb-4">
                  <strong>SEMINAR AKUNTANSI PERPAJAKAN</strong><br/>
                  "Aspek Akuntansi Perpajakan dalam Transaksi Bisnis UMKM"
                </p>
                <p className="text-xs text-white/60">
                  yang diselenggarakan oleh Jaya Bina Konsultan Grup Jakarta - Via Zoom pada tanggal 01 Agustus 2020
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
