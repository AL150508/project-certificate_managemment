"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/layouts/AppHeader"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import CertificatePreview from "@/components/certificate/CertificatePreview"
import DownloadButton from "@/components/certificate/DownloadButton"

interface CertificateData {
  id: string
  name: string
  training_title: string
  date: string
  location: string
  signer_1_name: string
  signer_1_title: string
  signer_2_name: string
  signer_2_title: string
  certificate_number: string
  template_url: string
  orientation: "landscape" | "portrait"
  text_positions: {
    name?: { x: number; y: number; size: number }
    training_title?: { x: number; y: number; size: number }
    date?: { x: number; y: number; size: number }
    location?: { x: number; y: number; size: number }
    signer_1_name?: { x: number; y: number; size: number }
    signer_1_title?: { x: number; y: number; size: number }
    signer_2_name?: { x: number; y: number; size: number }
    signer_2_title?: { x: number; y: number; size: number }
  }
  created_at: string
  is_verified: boolean
}

interface CertificateViewerPageProps {
  params: {
    id: string
  }
}

export default function CertificateViewerPage({ params }: CertificateViewerPageProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true)
        // Simulate API call to fetch certificate
        // In real implementation, this would fetch from Supabase
        const mockCertificate: CertificateData = {
          id: params.id,
          name: "John Doe",
          training_title: "Web Development Fundamentals",
          date: "15/12/2024",
          location: "Jakarta, Indonesia",
          signer_1_name: "Dr. Jane Smith",
          signer_1_title: "Director of Education",
          signer_2_name: "Prof. Michael Johnson",
          signer_2_title: "Head of Technology",
          certificate_number: `CERT-${params.id}`,
          template_url: "/contoh sertifikat.png", // Using existing template
          orientation: "landscape",
          text_positions: {
            name: { x: 400, y: 200, size: 32 },
            training_title: { x: 400, y: 300, size: 24 },
            date: { x: 400, y: 400, size: 18 },
            location: { x: 400, y: 450, size: 18 },
            signer_1_name: { x: 200, y: 600, size: 16 },
            signer_1_title: { x: 200, y: 650, size: 14 },
            signer_2_name: { x: 800, y: 600, size: 16 },
            signer_2_title: { x: 800, y: 650, size: 14 }
          },
          created_at: "2024-12-15T10:00:00Z",
          is_verified: true
        }
        
        setCertificate(mockCertificate)
      } catch (err) {
        setError("Failed to load certificate")
        console.error("Error fetching certificate:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [params.id])

  if (isLoading || loading) {
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

  if (error || !certificate) {
    return (
      <div className="min-h-dvh w-full bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Certificate Not Found</div>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const roleDisplayNames = {
    'admin': 'Administrator',
    'team': 'Team',
    'public': 'Publik'
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.training_title}`,
          text: `View my certificate for ${certificate.training_title}`,
          url: window.location.href
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Certificate link copied to clipboard!")
    }
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
      
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-[#444444] text-white hover:bg-[#333333]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-white text-3xl font-semibold">{certificate.training_title}</h1>
              <p className="text-[#AAAAAA]">Certificate for {certificate.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {certificate.is_verified && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-[#444444] text-white hover:bg-[#333333]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <DownloadButton
              targetId="certificate"
              orientation={certificate.orientation}
              filename={`certificate-${certificate.certificate_number}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Certificate Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-[#AAAAAA]">Certificate Number</label>
                  <p className="text-white font-mono">{certificate.certificate_number}</p>
                </div>
                
                <div>
                  <label className="text-sm text-[#AAAAAA]">Recipient</label>
                  <p className="text-white">{certificate.name}</p>
                </div>
                
                <div>
                  <label className="text-sm text-[#AAAAAA]">Training</label>
                  <p className="text-white">{certificate.training_title}</p>
                </div>
                
                <div>
                  <label className="text-sm text-[#AAAAAA]">Date</label>
                  <p className="text-white">{certificate.date}</p>
                </div>
                
                <div>
                  <label className="text-sm text-[#AAAAAA]">Location</label>
                  <p className="text-white">{certificate.location}</p>
                </div>
                
                <div>
                  <label className="text-sm text-[#AAAAAA]">Issued</label>
                  <p className="text-white">
                    {new Date(certificate.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificate Display */}
          <div className="lg:col-span-3">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-6">
                <div className="flex justify-center overflow-auto">
                  <CertificatePreview
                    certificate={certificate}
                    isEditable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
