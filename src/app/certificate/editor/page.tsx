"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layouts/AppHeader"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye } from "lucide-react"
import TemplateUpload from "@/components/certificate/TemplateUpload"
import OrientationToggle from "@/components/certificate/OrientationToggle"
import CertificatePreview from "@/components/certificate/CertificatePreview"
import DownloadButton from "@/components/certificate/DownloadButton"

interface CertificateData {
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
}

export default function CertificateEditorPage() {
  const { user, isLoading } = useUser()
  
  const [certificate, setCertificate] = useState<CertificateData>({
    name: "",
    training_title: "",
    date: "",
    location: "",
    signer_1_name: "",
    signer_1_title: "",
    signer_2_name: "",
    signer_2_title: "",
    certificate_number: `CERT-${Date.now()}`,
    template_url: "",
    orientation: "landscape",
    text_positions: {}
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  const roleDisplayNames = {
    'admin': 'Administrator',
    'team': 'Team',
    'public': 'Publik'
  }

  const handleTemplateUpload = (url: string) => {
    setCertificate(prev => ({ ...prev, template_url: url }))
  }

  const handleOrientationChange = (orientation: "landscape" | "portrait") => {
    setCertificate(prev => ({ ...prev, orientation }))
  }

  const handlePositionChange = (field: string, position: { x: number; y: number; size: number }) => {
    setCertificate(prev => ({
      ...prev,
      text_positions: {
        ...prev.text_positions,
        [field]: position
      }
    }))
  }

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCertificate(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate save to Supabase
      console.log("Saving certificate:", certificate)
      alert("Certificate saved successfully!")
    } catch (error) {
      console.error("Error saving certificate:", error)
      alert("Error saving certificate. Please try again.")
    } finally {
      setIsSaving(false)
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
        <div className="mb-6">
          <h1 className="text-white text-3xl font-semibold mb-2">Certificate Editor</h1>
          <p className="text-[#AAAAAA]">Create and customize certificate templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Upload */}
            <TemplateUpload 
              onTemplateUpload={handleTemplateUpload}
              currentTemplate={certificate.template_url}
            />

            {/* Orientation Toggle */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Orientation</CardTitle>
              </CardHeader>
              <CardContent>
                <OrientationToggle 
                  value={certificate.orientation}
                  onChange={handleOrientationChange}
                />
              </CardContent>
            </Card>

            {/* Certificate Details */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nama Peserta</Label>
                  <Input
                    id="name"
                    value={certificate.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    placeholder="Masukkan nama peserta"
                  />
                </div>

                <div>
                  <Label htmlFor="training_title" className="text-white">Judul Pelatihan</Label>
                  <Input
                    id="training_title"
                    value={certificate.training_title}
                    onChange={(e) => handleInputChange("training_title", e.target.value)}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    placeholder="Masukkan judul pelatihan"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-white">Tanggal</Label>
                  <Input
                    id="date"
                    value={certificate.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-white">Lokasi</Label>
                  <Input
                    id="location"
                    value={certificate.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-[#2A2A2A] border-[#444444] text-white"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signer_1_name" className="text-white">Penandatangan 1</Label>
                    <Input
                      id="signer_1_name"
                      value={certificate.signer_1_name}
                      onChange={(e) => handleInputChange("signer_1_name", e.target.value)}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                      placeholder="Nama"
                    />
                    <Input
                      value={certificate.signer_1_title}
                      onChange={(e) => handleInputChange("signer_1_title", e.target.value)}
                      className="bg-[#2A2A2A] border-[#444444] text-white mt-2"
                      placeholder="Jabatan"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signer_2_name" className="text-white">Penandatangan 2</Label>
                    <Input
                      id="signer_2_name"
                      value={certificate.signer_2_name}
                      onChange={(e) => handleInputChange("signer_2_name", e.target.value)}
                      className="bg-[#2A2A2A] border-[#444444] text-white"
                      placeholder="Nama"
                    />
                    <Input
                      value={certificate.signer_2_title}
                      onChange={(e) => handleInputChange("signer_2_title", e.target.value)}
                      className="bg-[#2A2A2A] border-[#444444] text-white mt-2"
                      placeholder="Jabatan"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant="outline"
                  className="w-full border-[#444444] text-white hover:bg-[#333333]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !certificate.template_url}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Certificate"}
                </Button>

                {certificate.template_url && (
                  <DownloadButton
                    targetId="certificate"
                    orientation={certificate.orientation}
                    filename={`certificate-${certificate.certificate_number}`}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1A1A1A] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Certificate Preview</CardTitle>
                <p className="text-[#AAAAAA] text-sm">
                  {isPreviewMode 
                    ? "Preview mode - Click and drag text elements to reposition" 
                    : "Edit mode - Click and drag text elements to reposition, scroll to resize"
                  }
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center overflow-auto">
                  {certificate.template_url ? (
                    <CertificatePreview
                      certificate={certificate}
                      isEditable={!isPreviewMode}
                      onPositionChange={handlePositionChange}
                    />
                  ) : (
                    <div className="w-[794px] h-[1123px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-lg">Upload a template to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
