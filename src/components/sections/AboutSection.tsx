"use client"

import { motion } from "framer-motion"

export function AboutSection() {
  return (
    <section className="mt-20 py-20 px-6 md:px-12 bg-gradient-to-b from-[#0A0A0A] to-[#111] overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div>
          <div className="w-16 h-[3px] bg-gradient-to-r from-[#E50914] to-[#B1000E] mb-3" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tentang e-Certificate.</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Certificate Manager merupakan platform pembuatan sertifikat pelatihan berbasis web yang memudahkan Anda
            dalam membuat, mengelola, dan menerbitkan sertifikat secara cepat dan efisien.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white rounded-lg px-6 py-3 font-medium hover:scale-105 transition-all"
          >
            Kontak Kami
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          <div className="shadow-xl rounded-xl rotate-1 overflow-hidden">
            <img
              src="/contoh%20sertifikat.png"
              alt="Contoh sertifikat"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}


