"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type FAQ = {
  id: string
  question: string
  answer: string
  category: string | null
  is_published: boolean
  created_at: string
}

const fallbackFaqs: FAQ[] = [
  { id: "1", question: "Bagaimana cara membuat sertifikat?", answer: "Masuk sebagai admin, buka menu Certificates lalu klik + New Certificate.", category: "Sertifikat", is_published: true, created_at: new Date().toISOString() },
  { id: "2", question: "Apakah bisa impor data dari Excel?", answer: "Bisa. Gunakan halaman Import, pilih tipe data, unggah file .xlsx, lalu proses.", category: "Teknis", is_published: true, created_at: new Date().toISOString() },
]

export default function FAQClient() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | "all">("all")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("faq")
          .select("id, question, answer, category, is_published, created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        setFaqs((data as FAQ[]) ?? [])
      } catch {
        setFaqs(fallbackFaqs)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    faqs.forEach((f) => { if (f.category) set.add(f.category) })
    return Array.from(set)
  }, [faqs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs.filter((f) => {
      const matchesQ = q ? (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) : true
      const matchesC = category === "all" ? true : (f.category ?? "") === category
      return matchesQ && matchesC
    })
  }, [faqs, query, category])

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-24">
      <header className="mb-6">
        <h1 className="text-white text-3xl md:text-4xl font-semibold">Frequently Asked Questions (FAQ)</h1>
        <p className="text-[#AAAAAA] mt-2">Temukan jawaban dari pertanyaan umum seputar sistem Certificate Manager.</p>
      </header>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 sticky top-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <Input
            placeholder="Cari pertanyaan di sini..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-[#111] text-white border-[#333] md:col-span-2"
          />
          <Select value={category} onValueChange={(v) => setCategory(v as any)}>
            <SelectTrigger className="bg-[#111] text-white border-[#333]">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72 overflow-auto">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <section className="mt-6 space-y-3">
        {loading && (
          <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-4 text-white/70">Memuat FAQ...</Card>
        )}

        {!loading && filtered.length === 0 && (
          <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-6 text-white/80">Tidak ada pertanyaan yang ditemukan. Silakan coba kata kunci lain.</Card>
        )}

        <AnimatePresence initial={false}>
          {!loading && filtered.map((f) => (
            <AccordionItem key={f.id} question={f.question} answer={f.answer} category={f.category ?? "Umum"} />
          ))}
        </AnimatePresence>
      </section>

      <footer className="mt-10">
        <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Masih membutuhkan bantuan?</h3>
            <p className="text-[#AAAAAA]">Hubungi tim kami di: support@certificatemanager.com</p>
          </div>
          <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white" asChild>
            <a href="mailto:support@certificatemanager.com">Kirim Pesan</a>
          </Button>
        </Card>
      </footer>
    </div>
  )
}

function AccordionItem({ question, answer, category }: { question: string; answer: string; category: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-0 overflow-hidden">
      <button
        className="w-full text-left px-4 py-4 hover:bg-[#121212] transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <p className="text-xs text-[#AAAAAA] mb-1">{category}</p>
        <h4 className="text-white font-medium">{question}</h4>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 text-[#DDDDDD]"
          >
            <p className="leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}


