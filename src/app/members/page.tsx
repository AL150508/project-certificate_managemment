import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import MembersClient from "@/app/manage/members/MembersClient"

export const metadata: Metadata = {
  title: "Members - Certificate Manager",
}

export default function MembersPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <MembersClient />
    </div>
  )
}


