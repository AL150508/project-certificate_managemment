import { redirect } from "next/navigation"

export default function Home() {
  // Redirect root to public dashboard
  redirect("/dashboard")
}
