import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import FAQClient from "./FAQClient"

export const metadata: Metadata = {
  title: "FAQ - Certificate Manager",
}

export default function FaqPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <FAQClient />
    </div>
  )
}


