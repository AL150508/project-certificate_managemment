import { LandingNavbar } from "@/components/layouts/LandingNavbar"
import HeroPublic from "@/components/sections/HeroPublic"
import { AboutLanding } from "@/components/sections/AboutLanding"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0A]">
      <LandingNavbar />
      <HeroPublic />
      <AboutLanding />
    </div>
  )
}
