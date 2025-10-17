import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import ImportClient from "./ImportClient"

export const metadata: Metadata = {
  title: "Import Data - Certificate Manager",
}

export default function ImportPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <ImportClient />
    </div>
  )
}


