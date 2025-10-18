"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      // Login with user data
      login({
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        role: role as 'admin' | 'team' | 'public'
      })
      
      setIsLoading(false)
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden flex items-center justify-center">
      <main className="w-full max-w-md px-6">
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
                  <label htmlFor="role" className="text-sm font-medium text-white">
                    Masuk sebagai
                  </label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger className="bg-[#2A2A2A] border-[#444444] text-white focus:border-blue-500">
                      <SelectValue placeholder="Pilih peran Anda" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#444444]">
                      <SelectItem value="admin" className="text-white hover:bg-[#3A3A3A]">Admin</SelectItem>
                      <SelectItem value="team" className="text-white hover:bg-[#3A3A3A]">Team</SelectItem>
                      <SelectItem value="public" className="text-white hover:bg-[#3A3A3A]">Publik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
