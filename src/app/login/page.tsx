"use client"

import { AppHeader } from "@/components/layouts/AppHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader isLoggedIn={false} />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-semibold">Login</CardTitle>
              <CardDescription className="text-[#AAAAAA]">
                Masuk ke akun Anda untuk mengakses Certificate Manager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#2A2A2A] border-[#444444] text-white placeholder:text-[#888888] focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#2A2A2A] border-[#444444] text-white placeholder:text-[#888888] focus:border-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Login"}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-[#AAAAAA]">
                  Belum punya akun?{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-400 underline">
                    Daftar di sini
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
