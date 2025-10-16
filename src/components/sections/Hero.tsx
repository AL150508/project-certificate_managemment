"use client"

import { motion } from "framer-motion"

export function Hero() {
  return (
    <section id="home" className="pt-24 md:pt-28 pb-16 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#111]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white"
        >
          Ikuti Seminar & Training Online
          <br />
          Bersertifikat
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-2xl md:text-4xl font-extrabold text-white"
        >
          DENGAN PEMATERI PROFESIONAL
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-[#AAAAAA]"
        >
          Anda juga dapat menikmati software akuntansi online secara gratis di akuntanmu.com
        </motion.p>
        <motion.a
          href="#activities"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-[#2A7FFF] text-white font-medium hover:scale-[1.02] transition-all"
        >
          COBA SEKARANG
        </motion.a>
      </div>
    </section>
  )
}


