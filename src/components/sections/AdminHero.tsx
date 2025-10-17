"use client"

import { motion } from "framer-motion"

export function AdminHero() {
  return (
    <section className="pt-24 md:pt-28 pb-10 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#111]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white"
        >
          Selamat Datang, Admin 👋
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-2xl md:text-3xl font-extrabold text-white"
        >
          Kelola seluruh data sertifikat, template, dan anggota dari satu tempat
        </motion.h2>
      </div>
    </section>
  )
}


