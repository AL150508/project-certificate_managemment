"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/providers/LanguageProvider"

export function AboutLanding() {
  const { t } = useLanguage()
  
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#111] overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-12">
        <div>
          <div className="w-16 h-[3px] bg-gradient-to-r from-[#E50914] to-[#B1000E] mb-3" />
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('landing.aboutTitle')}</h3>
          <p className="text-[#AAAAAA] leading-relaxed mb-6">
            {t('landing.aboutDescription')}
          </p>
          <a href="#contact" className="inline-block bg-gradient-to-r from-[#E50914] to-[#B1000E] text-white rounded-lg px-6 py-3 font-medium hover:scale-[1.02] transition-all">{t('landing.contactUs')}</a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <div className="rounded-xl shadow-xl rotate-1 overflow-hidden">
            <img src="/contoh%20sertifikat.png" alt="Contoh sertifikat" className="w-full h-auto" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}


