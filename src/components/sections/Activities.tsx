"use client"

import { motion } from "framer-motion"

const items = [
  { title: "Workshop Penulisan Serta Penerbitan Buku Ajar Dan Referensi", date: "22 September 2025" },
  { title: "Bimbingan Belajar — Skill & Akademik untuk Generasi Hebat", date: "30 Agustus 2025" },
  { title: "HUT RI ke 80 — Bersatu Berdaulat, Rakyat Sejahtera, Indonesia Maju", date: "17 Agustus 2025" },
]

export function Activities() {
  return (
    <section id="activities" className="py-16 bg-[#0A0A0A]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <h3 className="text-white text-2xl font-semibold mb-6">Ikuti Kegiatan Terbaru:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-xl p-5 bg-gradient-to-b from-[#111] to-[#0F0F0F] border border-[#1f1f1f]"
            >
              <p className="text-white font-medium mb-2">{it.title}</p>
              <p className="text-[#AAAAAA] text-sm mb-4">Dilaksanakan pada {it.date}</p>
              <div className="flex gap-2">
                <a href="#" className="px-4 py-2 rounded-md bg-[#E50914] text-white text-sm hover:scale-[1.02] transition-all">Lihat e-Certificate</a>
                <a href="#" className="px-4 py-2 rounded-md bg-[#222] text-white text-sm hover:bg-[#333]">Cari</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


