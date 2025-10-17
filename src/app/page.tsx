import { AppHeader } from "@/components/layouts/AppHeader"
import { Hero } from "@/components/sections/Hero"
import { Activities } from "@/components/sections/Activities"
import { AboutLanding } from "@/components/sections/AboutLanding"

export default function Home() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <Hero />
      <Activities />
      <AboutLanding />
      <footer className="py-12 border-t border-[#1a1a1a] bg-[#0A0A0A]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white text-xl font-semibold mb-2">Kontak Kami</h4>
            <ul className="space-y-2 text-[#AAAAAA]">
              <li>+6281380935185</li>
              <li>@nurtiyas.id</li>
              <li>Jakarta Timur, Indonesia</li>
              <li>Syarat & Ketentuan</li>
              <li>Kebijakan Privasi</li>
            </ul>
          </div>
          <div className="text-[#AAAAAA] md:text-right self-end">Dikembangkan untuk demo Certificate Manager</div>
        </div>
      </footer>
    </div>
  )
}
