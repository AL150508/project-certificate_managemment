"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface DownloadButtonProps {
  targetId: string
  orientation: "landscape" | "portrait"
  filename?: string
}

export default function DownloadButton({ 
  targetId, 
  orientation, 
  filename = "certificate" 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Dynamic import untuk html2canvas dan jsPDF
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default
      
      const el = document.getElementById(targetId)
      if (!el) {
        alert("Certificate element not found")
        return
      }

      const canvas = await html2canvas(el, { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL("image/png")
      
      // Set PDF dimensions based on orientation
      const pdfWidth = orientation === "landscape" ? 1123 : 794
      const pdfHeight = orientation === "landscape" ? 794 : 1123
      
      const pdf = new jsPDF(
        orientation === "landscape" ? "l" : "p",
        "pt",
        [pdfWidth, pdfHeight]
      )
      
      // Calculate image dimensions to fit the PDF
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`${filename}.pdf`)
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      {isDownloading ? "Generating PDF..." : "Download PDF"}
    </Button>
  )
}
