"use client"

import Image from "next/image"
import QRCode from "react-qr-code"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

interface CertificatePreviewProps {
  certificate: {
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
  isEditable?: boolean
  onPositionChange?: (field: string, position: { x: number; y: number; size: number }) => void
}

export default function CertificatePreview({ 
  certificate, 
  isEditable = false, 
  onPositionChange 
}: CertificatePreviewProps) {
  const positions = certificate.text_positions || {}
  const isLandscape = certificate.orientation === "landscape"

  const handleDrag = (field: string, e: React.MouseEvent) => {
    if (!isEditable || !onPositionChange) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const currentSize = positions[field as keyof typeof positions]?.size || 24
    onPositionChange(field, { x, y, size: currentSize })
  }

  const handleWheel = (field: string, e: React.WheelEvent) => {
    if (!isEditable || !onPositionChange) return
    
    e.preventDefault()
    const currentPos = positions[field as keyof typeof positions] || { x: 0, y: 0, size: 24 }
    const newSize = Math.max(12, Math.min(72, currentPos.size + (e.deltaY > 0 ? -2 : 2)))
    
    onPositionChange(field, { ...currentPos, size: newSize })
  }

  return (
    <div
      id="certificate"
      className={`relative border shadow-lg mx-auto bg-white ${
        isLandscape ? "w-[1123px] h-[794px]" : "w-[794px] h-[1123px]"
      }`}
      style={{ maxWidth: "100%", maxHeight: "80vh" }}
    >
      {/* Template Background */}
      {certificate.template_url && (
        <Image
          src={certificate.template_url}
          alt="Certificate Template"
          fill
          className="object-cover rounded-lg"
        />
      )}

      {/* Nama Peserta */}
      <div
        className={`absolute font-bold text-center text-gray-800 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.name?.y ?? 200,
          left: positions.name?.x ?? 400,
          fontSize: positions.name?.size ?? 32,
          fontFamily: playfair.style.fontFamily,
        }}
        onMouseDown={(e) => isEditable && handleDrag('name', e)}
        onWheel={(e) => isEditable && handleWheel('name', e)}
      >
        {certificate.name || "Nama Peserta"}
      </div>

      {/* Judul Pelatihan */}
      <div
        className={`absolute text-center text-gray-700 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.training_title?.y ?? 300,
          left: positions.training_title?.x ?? 400,
          fontSize: positions.training_title?.size ?? 24,
          fontFamily: playfair.style.fontFamily,
        }}
        onMouseDown={(e) => isEditable && handleDrag('training_title', e)}
        onWheel={(e) => isEditable && handleWheel('training_title', e)}
      >
        {certificate.training_title || "Judul Pelatihan"}
      </div>

      {/* Tanggal */}
      <div
        className={`absolute text-center text-gray-600 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.date?.y ?? 400,
          left: positions.date?.x ?? 400,
          fontSize: positions.date?.size ?? 18,
        }}
        onMouseDown={(e) => isEditable && handleDrag('date', e)}
        onWheel={(e) => isEditable && handleWheel('date', e)}
      >
        {certificate.date || "Tanggal"}
      </div>

      {/* Lokasi */}
      <div
        className={`absolute text-center text-gray-600 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.location?.y ?? 450,
          left: positions.location?.x ?? 400,
          fontSize: positions.location?.size ?? 18,
        }}
        onMouseDown={(e) => isEditable && handleDrag('location', e)}
        onWheel={(e) => isEditable && handleWheel('location', e)}
      >
        {certificate.location || "Lokasi"}
      </div>

      {/* Tanda Tangan 1 */}
      <div
        className={`absolute text-center text-gray-700 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.signer_1_name?.y ?? (isLandscape ? 600 : 800),
          left: positions.signer_1_name?.x ?? (isLandscape ? 200 : 200),
          fontSize: positions.signer_1_name?.size ?? 16,
          fontFamily: playfair.style.fontFamily,
        }}
        onMouseDown={(e) => isEditable && handleDrag('signer_1_name', e)}
        onWheel={(e) => isEditable && handleWheel('signer_1_name', e)}
      >
        {certificate.signer_1_name || "Nama Penandatangan 1"}
      </div>

      <div
        className={`absolute text-center text-gray-600 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.signer_1_title?.y ?? (isLandscape ? 650 : 850),
          left: positions.signer_1_title?.x ?? (isLandscape ? 200 : 200),
          fontSize: positions.signer_1_title?.size ?? 14,
        }}
        onMouseDown={(e) => isEditable && handleDrag('signer_1_title', e)}
        onWheel={(e) => isEditable && handleWheel('signer_1_title', e)}
      >
        {certificate.signer_1_title || "Jabatan Penandatangan 1"}
      </div>

      {/* Tanda Tangan 2 */}
      <div
        className={`absolute text-center text-gray-700 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.signer_2_name?.y ?? (isLandscape ? 600 : 800),
          left: positions.signer_2_name?.x ?? (isLandscape ? 800 : 500),
          fontSize: positions.signer_2_name?.size ?? 16,
          fontFamily: playfair.style.fontFamily,
        }}
        onMouseDown={(e) => isEditable && handleDrag('signer_2_name', e)}
        onWheel={(e) => isEditable && handleWheel('signer_2_name', e)}
      >
        {certificate.signer_2_name || "Nama Penandatangan 2"}
      </div>

      <div
        className={`absolute text-center text-gray-600 cursor-${isEditable ? 'move' : 'default'} ${
          isEditable ? 'hover:bg-blue-100 hover:bg-opacity-50 rounded p-1' : ''
        }`}
        style={{
          top: positions.signer_2_title?.y ?? (isLandscape ? 650 : 850),
          left: positions.signer_2_title?.x ?? (isLandscape ? 800 : 500),
          fontSize: positions.signer_2_title?.size ?? 14,
        }}
        onMouseDown={(e) => isEditable && handleDrag('signer_2_title', e)}
        onWheel={(e) => isEditable && handleWheel('signer_2_title', e)}
      >
        {certificate.signer_2_title || "Jabatan Penandatangan 2"}
      </div>

      {/* QR Code */}
      <div className="absolute bottom-8 right-8">
        <QRCode 
          value={`https://yourapp.com/verify/${certificate.certificate_number || 'CERT-001'}`} 
          size={80} 
        />
      </div>

      {/* Certificate Number */}
      <div className="absolute bottom-8 left-8 text-sm text-gray-500">
        No: {certificate.certificate_number || 'CERT-001'}
      </div>
    </div>
  )
}
