import { WelcomeHeader } from "@/components/layouts/WelcomeHeader"
import { WelcomeHero } from "@/components/sections/WelcomeHero"
import { WelcomeActivities } from "@/components/sections/WelcomeActivities"
import { WelcomeAbout } from "@/components/sections/WelcomeAbout"
import { WelcomeStats } from "@/components/sections/WelcomeStats"
import { WelcomeFooter } from "@/components/sections/WelcomeFooter"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <WelcomeHeader />
      <WelcomeHero />
      <WelcomeActivities />
      <WelcomeAbout />
      <WelcomeStats />
      <WelcomeFooter />
    </div>
  )
}
