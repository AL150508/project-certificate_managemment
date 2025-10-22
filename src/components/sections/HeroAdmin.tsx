"use client"

import Image from "next/image"
import { useLanguage } from "@/components/providers/LanguageProvider"

export default function HeroAdmin() {
  const { t } = useLanguage()
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B0B0F] to-[#101016] px-6 md:px-12 py-12">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
            {t('dashboard.adminDashboard')}
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight text-zinc-100">
            {t('dashboard.manageDigitalCertificates').split('Digital')[0]}
            <span className="text-rose-500">Digital</span>
            {t('dashboard.manageDigitalCertificates').split('Digital')[1] || t('dashboard.manageDigitalCertificates').split('Sertifikat')[1]}
          </h1>
          <p className="mt-3 text-zinc-400 max-w-prose">
            {t('dashboard.manageDescription')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 transition-colors" href="/certificates/create">
              {t('dashboard.createCertificate')}
            </a>
            <a className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800 transition-colors" href="/manage/members">
              {t('dashboard.manageMembers')}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(244,63,94,0.18),transparent_60%)]" />
          <div className="rounded-xl border border-zinc-800/80 bg-[rgba(16,16,22,0.8)] backdrop-blur-sm p-3">
            <Image
              src="/contoh%20sertifikat.png"
              alt="Contoh Sertifikat"
              width={920}
              height={600}
              className="rounded-lg ring-1 ring-zinc-800"
              priority
            />
          </div>
        </div>
      </div>
      <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(244,63,94,0.18),rgba(124,58,237,0.12),rgba(244,63,94,0.18))]"></div>
    </section>
  )
}



