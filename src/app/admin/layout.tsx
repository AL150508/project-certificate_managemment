import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - Certificate Manager',
  description: 'Administrative panel for certificate management system',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
