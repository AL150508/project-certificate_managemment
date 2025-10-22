import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Team Dashboard - Certificate Manager",
  description: "Team member dashboard for certificate management",
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
