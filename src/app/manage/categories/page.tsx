import type { Metadata } from "next"
import { AppHeader } from "@/components/layouts/AppHeader"
import CategoriesClient from "./CategoriesClient"

export const metadata: Metadata = {
  title: "Categories - Certificate Manager",
}

export default function CategoriesPage() {
  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader />
      <CategoriesClient />
    </div>
  )
}


