export function WelcomeActivities() {
  const activities = [
    {
      id: 1,
      title: "Workshop Penulisan Serta Penerbitan Buku Ajar Dan Referensi",
      subtitle: "Integrasi AI Peran C0- Author Untuk Penulisan Buku Ajar",
      date: "22 September 2025",
      type: "Workshop"
    },
    {
      id: 2,
      title: "Bimbingan Belajar",
      subtitle: "Skill & Akademik untuk Generasi Hebat",
      date: "30 Agustus 2025",
      type: "Bimbingan"
    },
    {
      id: 3,
      title: "Penyelenggaraan Peringatan Hari Ulang Tahun (HUT) RI ke 80",
      subtitle: "Bersatu Berdaulat, Rakyat Sejahtera, Indonesia Maju",
      date: "17 Agustus 2025",
      type: "Peringatan"
    }
  ]

  return (
    <section id="activities" className="py-16 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Ikuti Kegiatan Terbaru:
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-[#121212] rounded-lg border border-[#1f1f1f] p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-4">
                <span className="inline-block bg-[#E50914]/15 text-[#FF6B73] text-xs font-semibold px-2.5 py-0.5 rounded-full">{activity.type}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
                {activity.title}
              </h3>
              
              <p className="text-white/70 mb-4 italic">
                "{activity.subtitle}"
              </p>
              
              <p className="text-sm text-white/60 mb-4">
                <strong className="text-white/80">Dilaksanakan pada {activity.date}</strong>
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-[#E50914] font-medium text-sm">e-Certificate</span>
                <div className="flex space-x-2">
                  <button className="text-white/80 hover:text-white text-sm font-medium">Lihat e-Certificate</button>
                  <button className="text-white/40 hover:text-white/70">×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
