"use client"

import HeroPublic from "@/components/sections/HeroPublic"
import HeroAdmin from "@/components/sections/HeroAdmin"
import HeroTeam from "@/components/sections/HeroTeam"
import { useRole } from "@/context/RoleContext"

export default function ClientHero() {
  const { role } = useRole()
  if (role === "public") return <HeroPublic />
  if (role === "team") return <HeroTeam />
  return <HeroAdmin />
}



