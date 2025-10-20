"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import CertificateCanvas from "@/components/certificates/CertificateCanvas"
import EditorPanel, { type Member, type Category } from "@/components/certificates/EditorPanel"
import { useCertificateEditor, type LayoutSnapshot, type TemplateField } from "@/hooks/useCertificateEditor"
import { Button } from "@/components/ui/button"

export default function CreateCertificatePage() {
  const [members, setMembers] = useState<Member[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; layout?: LayoutSnapshot | null; fields?: TemplateField[]; background_url?: string | null }>>([])
  const [picking, setPicking] = useState<{ categoryId?: string; templateId?: string; memberId?: string }>({})
  const [currentCertId, setCurrentCertId] = useState<string | null>(null)

  const { state, api, getSnapshot } = useCertificateEditor()

  useEffect(() => {
    (async () => {
      try {
        const [membersResp, categoriesResp, templatesResp] = await Promise.all([
          supabase.from("members").select("id, name, email").order("name"),
          supabase.from("certificate_categories").select("id, name").order("name"),
          supabase.from("certificate_templates").select("id, name, fields, layout, background_url").order("name"),
        ])
        setMembers(((membersResp.data ?? []) as any[]).map(m => ({ id: m.id, name: m.name, email: m.email ?? null })))
        setCategories(((categoriesResp.data ?? []) as any[]).map(c => ({ id: c.id, name: c.name })))
        setTemplates(((templatesResp.data ?? []) as any[]).map(t => ({ id: t.id, name: t.name, fields: t.fields ?? [], layout: t.layout ?? null, background_url: t.background_url ?? null })))
      } catch (e: any) {
        toast.error(e.message ?? "Load failed")
      }
    })()
  }, [])

  // Apply template to editor when picked
  useEffect(() => {
    const tpl = templates.find(t => t.id === picking.templateId)
    if (!tpl) return
    const layout: LayoutSnapshot = tpl.layout ?? { width: 1200, height: 850, orientation: "landscape", fields: (tpl.fields ?? []).map(f => ({ ...f })) }
    ;(layout as any).background_url = tpl.background_url ?? null
    const values: Record<string, string> = {}
    if (picking.memberId) {
      const m = members.find(x => x.id === picking.memberId)
      if (m) values["name"] = m.name
    }
    api.init(layout, values)
  }, [picking.templateId])

  // Autofill when member changes
  useEffect(() => {
    if (!picking.memberId) return
    const m = members.find(x => x.id === picking.memberId)
    if (!m) return
    if (state.values["name"] == null) api.setValue("name", m.name)
  }, [picking.memberId])

  async function saveDraft() {
    const snap = getSnapshot()
    try {
      // If certificate not created yet -> create draft with RPC identifiers
      if (!currentCertId) {
        const y = new Date().getFullYear()
        const m = new Date().getMonth() + 1
        const rpc = await supabase.rpc('next_certificate_identifiers', { y, m, code_len: 10 })
        if (rpc.error) throw rpc.error
        const identifiers = rpc.data as { certificate_number: string; verification_code: string }
        const { error, data } = await supabase.from("certificates").insert({
          certificate_number: identifiers.certificate_number,
          verification_code: identifiers.verification_code,
          member_id: picking.memberId ?? null,
          category_id: picking.categoryId ?? null,
          template_id: picking.templateId ?? null,
          issue_date: new Date().toISOString().slice(0,10),
          status: "draft",
          fields_data: snap.values,
          layout: snap.layout,
        }).select("id").single()
        if (error) throw error
        setCurrentCertId((data as any).id)
      } else {
        const { error } = await supabase.from("certificates").update({
          member_id: picking.memberId ?? null,
          category_id: picking.categoryId ?? null,
          template_id: picking.templateId ?? null,
          fields_data: snap.values,
          layout: snap.layout,
          status: "draft",
        }).eq("id", currentCertId)
        if (error) throw error
      }
      toast.success("Saved draft")
    } catch (e: any) {
      toast.error(e.message ?? "Save failed")
    }
  }

  async function generateNow() {
    try {
      if (!currentCertId) {
        await saveDraft()
      }
      const id = currentCertId
      if (!id) throw new Error("No certificate id to generate")
      const res = await fetch(`/api/certificates/${id}/generate`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Generated")
    } catch (e: any) {
      toast.error(e.message ?? "Generate failed")
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 p-4 bg-[#0F0F0F] border-[#1f1f1f]">
          <div className="text-xl font-semibold text-white mb-3">Certificate Preview</div>
          <div className="overflow-auto">
            <CertificateCanvas
              layout={state.layout}
              values={state.values}
              selectedKey={state.selectedKey}
              onSelect={api.select}
              onMove={api.moveField}
            />
          </div>
        </Card>
        <Card className="lg:col-span-5 p-4 bg-[#0F0F0F] border-[#1f1f1f]">
          <EditorPanel
            members={members}
            categories={categories}
            templates={templates}
            selectedKey={state.selectedKey}
            values={state.values}
            layout={state.layout}
            onValue={api.setValue}
            onStyle={(k, patch) => {
              if (typeof patch.x === 'number' || typeof patch.y === 'number') {
                // move handled as style if typed in numeric inputs
                const f = state.layout.fields.find(x => x.key === k)
                api.moveField(k, patch.x ?? f?.x ?? 0, patch.y ?? f?.y ?? 0)
              } else {
                api.styleField(k, patch)
              }
            }}
            onAddField={api.addField}
            onPick={(pick) => setPicking(prev => ({ ...prev, ...pick }))}
            onUndo={api.undo}
            onRedo={api.redo}
            onSave={saveDraft}
            onGenerate={generateNow}
          />
        </Card>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={saveDraft}>Save</Button>
        <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white" onClick={generateNow}>Generate</Button>
      </div>
    </div>
  )
}
