"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "team" | "public">("admin")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setError("Login timeout. Please check your password and try again.")
      setIsLoading(false)
    }, 5000) // 5 second timeout
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      clearTimeout(timeoutId)
      
      if (error) {
        setError(`${error.message}`)
        setIsLoading(false)
        return
      }
      
      // Redirect based on selected role
      if (selectedRole === "admin") {
        window.location.href = "/admin/dashboard"
      } else if (selectedRole === "team") {
        window.location.href = "/team/dashboard"
      } else {
        window.location.href = "/"
      }
      
    } catch (err: unknown) {
      clearTimeout(timeoutId)
      const message = err instanceof Error ? err.message : "Login failed"
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#111] border-[#262626] shadow-2xl shadow-black/30">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl font-semibold">Login to your account</CardTitle>
              <CardDescription className="text-white/60">
                Masuk untuk mengelola sertifikat Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                  <Input id="email" type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/40 focus:border-[#E50914]" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
                  <div className="relative">
                    <Input id="password" type={showPw ? "text" : "password"} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-white/40 focus:border-[#E50914] pr-10" />
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" onClick={() => setShowPw(s => !s)} aria-label="toggle password">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-white">Login as</label>
                  <Select value={selectedRole} onValueChange={(value: "admin" | "team" | "public") => setSelectedRole(value)}>
                    <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#E50914]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                      <SelectItem value="admin">👑 Admin</SelectItem>
                      <SelectItem value="team">👥 Team</SelectItem>
                      <SelectItem value="public">👤 Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-[#E50914] hover:bg-[#b30810] text-white" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Login"}
                </Button>
              </form>
              <div className="mt-4 space-y-2">
                <Button onClick={() => router.replace('/')} variant="outline" className="w-full border-[#333] bg-transparent text-white hover:bg-[#333] hover:text-white">Continue as Guest</Button>
                <p className="text-xs text-white/50 text-center select-none">Belum punya akun? Hubungi admin. Pendaftaran dinonaktifkan.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
