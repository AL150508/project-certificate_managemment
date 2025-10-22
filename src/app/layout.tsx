import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Certificate Manager",
  description: "Dashboard dan manajemen sertifikat berbasis web",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create server client to read session from cookies
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // Get initial session from server
  const { data: { session: initialSession } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-[#0A0A0A] text-white overflow-x-hidden`}>
        <ClientProviders initialSession={initialSession}>{children}</ClientProviders>
      </body>
    </html>
  );
}
