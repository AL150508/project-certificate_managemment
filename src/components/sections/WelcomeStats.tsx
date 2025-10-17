export function WelcomeStats() {
  const stats = [
    { number: "6374", label: "Partisipan" },
    { number: "77", label: "Kegiatan" },
    { number: "611", label: "Lembaga" }
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-[#B1000E] to-[#E50914]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-medium opacity-90">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
