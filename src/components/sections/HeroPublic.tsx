"use client"

import { useState } from "react"

export default function HeroPublic() {
  const [q, setQ] = useState("")
  return (
    <section className="bg-gradient-to-b from-[#0A0A0A] to-[#111111] text-center flex flex-col items-center justify-center py-32 px-6">
      <h1 className="text-3xl md:text-5xl font-bold text-white">Cek Sertifikat Anda</h1>
      <p className="mt-3 text-[#AAAAAA] max-w-2xl">Masukkan nomor sertifikat atau nama peserta untuk memeriksa keasliannya.</p>
      <div className="mt-6 flex w-full max-w-2xl items-center justify-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Masukkan nomor sertifikat atau nama peserta..."
          className="w-full md:w-[400px] px-4 py-3 rounded-lg bg-[#1A1A1A] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-[#E50914]"
        />
        <button
          onClick={() => console.log("Cari:", q)}
          className="px-6 py-3 bg-[#E50914] text-white rounded-lg font-semibold hover:bg-[#B1000E] transition-all duration-300"
        >
          Cek Sertifikat
        </button>
      </div>
    </section>
  )
}


