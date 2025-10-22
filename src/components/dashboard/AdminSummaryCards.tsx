"use client"

import { Card } from "@/components/ui/card"
import { FileText, Users, FolderKanban, Layers, CalendarDays, Mail } from "lucide-react"
import { useLanguage } from "@/components/providers/LanguageProvider"

export function AdminSummaryCards() {
  const { t } = useLanguage()
  
  const items = [
    { titleKey: "dashboard.totalCertificates", value: "256", descKey: "dashboard.certificatesIssued", icon: FileText },
    { titleKey: "dashboard.totalMembers", value: "122", descKey: "dashboard.registeredParticipants", icon: Users },
    { titleKey: "dashboard.activeCategories", value: "6", descKey: "dashboard.trainingCategories", icon: FolderKanban },
    { titleKey: "dashboard.certificateTemplates", value: "8", descKey: "dashboard.templatesStored", icon: Layers },
    { titleKey: "dashboard.certificatesThisMonth", value: "32", descKey: "dashboard.issuedThisMonth", icon: CalendarDays },
    { titleKey: "dashboard.emailsSent", value: "180", descKey: "dashboard.totalEmailsSent", icon: Mail },
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.titleKey} className="rounded-xl border border-zinc-800/80 bg-[rgba(16,16,22,0.8)] backdrop-blur-sm p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-md bg-zinc-900/70 ring-1 ring-zinc-800">
              <item.icon className="h-5 w-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-zinc-400">{t(item.titleKey)}</p>
              <p className="text-3xl font-semibold text-zinc-100 tracking-tight">{item.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{t(item.descKey)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}


