"use client"

import { AppHeader } from "@/components/layouts/AppHeader"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CertificatesPage() {
  const { user, isLoading } = useUser()
  
  if (isLoading) {
    return (
      <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Please login first</div>
      </div>
    )
  }

  // Get role display name
  const roleDisplayNames = {
    'admin': 'Administrator',
    'team': 'Team',
    'public': 'Publik'
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] overflow-x-hidden">
      <AppHeader 
        isLoggedIn={true}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar || "",
          role: roleDisplayNames[user.role]
        }}
      />
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-semibold mb-2">Certificates</h1>
            <p className="text-[#AAAAAA]">Manage and view all certificates</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/certificate/editor'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create New Certificate
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Certificate Cards */}
          <Card className="bg-[#1A1A1A] border-[#333333] hover:border-[#555555] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Web Development Certificate</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
              </div>
              <p className="text-[#AAAAAA] text-sm mb-4">Certificate for John Doe</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#888888]">CERT-001</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/certificate/001'}
                  className="border-[#444444] text-white hover:bg-[#333333]"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333] hover:border-[#555555] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">React.js Training</h3>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
              </div>
              <p className="text-[#AAAAAA] text-sm mb-4">Certificate for Jane Smith</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#888888]">CERT-002</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/certificate/002'}
                  className="border-[#444444] text-white hover:bg-[#333333]"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#333333] hover:border-[#555555] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Node.js Fundamentals</h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
              </div>
              <p className="text-[#AAAAAA] text-sm mb-4">Certificate for Mike Johnson</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#888888]">CERT-003</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.href = '/certificate/003'}
                  className="border-[#444444] text-white hover:bg-[#333333]"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


