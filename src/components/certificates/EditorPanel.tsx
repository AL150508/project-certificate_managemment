"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Align, LayoutSnapshot, TemplateField } from "@/hooks/useCertificateEditor"

const FONT_LIST = ["Poppins", "Inter", "Roboto", "Open Sans"]

export type Member = { id: string; name: string; email: string | null }
export type Category = { id: string; name: string }
export type Template = { id: string; name: string; layout?: LayoutSnapshot | null; fields?: TemplateField[]; background_url?: string | null }

export default function EditorPanel({
  members,
  categories,
  templates,
  selectedKey,
  values,
  layout,
  onValue,
  onStyle,
  onAddField,
  onPick,
  onUndo,
  onRedo,
  onSave,
  onGenerate,
  defaultSelections,
}: {
  members: Member[]
  categories: Category[]
  templates: Template[]
  selectedKey: string | null
  values: Record<string, string>
  layout: LayoutSnapshot
  onValue: (k: string, v: string) => void
  onStyle: (k: string, patch: Partial<TemplateField>) => void
  onAddField: (f: TemplateField, defaultValue?: string) => void
  onPick: (pick: { categoryId?: string; templateId?: string; memberId?: string }) => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onGenerate: () => void
  defaultSelections?: { categoryId?: string; templateId?: string; memberId?: string }
}) {
  const [categoryId, setCategoryId] = useState(defaultSelections?.categoryId ?? "")
  const [templateId, setTemplateId] = useState(defaultSelections?.templateId ?? "")
  const [memberId, setMemberId] = useState(defaultSelections?.memberId ?? "")

  useEffect(() => { onPick({ categoryId }) }, [categoryId, onPick])
  useEffect(() => { onPick({ templateId }) }, [templateId, onPick])
  useEffect(() => { onPick({ memberId }) }, [memberId, onPick])

  const activeField = useMemo(() => layout.fields.find(f => f.key === selectedKey) ?? null, [layout.fields, selectedKey])

  function addQuick(key: string, label: string, def?: string) {
    const x = Math.round(layout.width / 2 - 60)
    const y = Math.round(layout.height / 2)
    const f: TemplateField = { key, label, x, y, align: "center", fontFamily: "Poppins", fontSize: 28, color: "#111111" }
    onAddField(f, def)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <label className="text-xs text-white/60">Certificate Category</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="bg-[#111] text-white border-[#333] h-9"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72">
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-xs text-white/60">Choose Template</label>
        <Select value={templateId} onValueChange={setTemplateId}>
          <SelectTrigger className="bg-[#111] text-white border-[#333] h-9"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72">
            {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-xs text-white/60">Member</label>
        <Select value={memberId} onValueChange={setMemberId}>
          <SelectTrigger className="bg-[#111] text-white border-[#333] h-9"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-72">
            {members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-xs text-white/60">Edit Elements</label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => addQuick("name", "Name", "Nama Peserta")}>Name</Button>
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => addQuick("description", "Description", "Deskripsi pelatihan")}>Description</Button>
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => addQuick("date", "Date", new Date().toISOString().slice(0,10))}>Date</Button>
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => addQuick("number", "Number", "SR-001")}>Number</Button>
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => addQuick("expired", "Expired", "2028-12-31")}>Expired</Button>
        </div>
      </div>

      {activeField && (
        <div className="space-y-2 p-3 border border-[#333] rounded-md">
          <div className="text-sm font-medium">{activeField.label ?? activeField.key}</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-white/60">Value</label>
              <Input className="bg-[#111] text-white border-[#333] h-9" value={values[activeField.key] ?? ""} onChange={(e) => onValue(activeField.key, e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-white/60">Font</label>
              <Select value={activeField.fontFamily ?? "Poppins"} onValueChange={(v) => onStyle(activeField.key, { fontFamily: v })}>
                <SelectTrigger className="bg-[#111] text-white border-[#333] h-9"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
                  {FONT_LIST.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-white/60">Font Size</label>
              <Input type="number" className="bg-[#111] text-white border-[#333] h-9" value={activeField.fontSize ?? 24} onChange={(e) => onStyle(activeField.key, { fontSize: Number(e.target.value || 0) })} />
            </div>
            <div>
              <label className="text-xs text-white/60">Color</label>
              <Input type="color" className="bg-[#111] text-white border-[#333] h-9" value={activeField.color ?? "#000000"} onChange={(e) => onStyle(activeField.key, { color: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-white/60">Position X</label>
              <Input type="number" className="bg-[#111] text-white border-[#333] h-9" value={activeField.x} onChange={(e) => onStyle(activeField.key, { x: Number(e.target.value || 0) })} />
            </div>
            <div>
              <label className="text-xs text-white/60">Position Y</label>
              <Input type="number" className="bg-[#111] text-white border-[#333] h-9" value={activeField.y} onChange={(e) => onStyle(activeField.key, { y: Number(e.target.value || 0) })} />
            </div>
            <div>
              <label className="text-xs text-white/60">Align</label>
              <Select value={(activeField.align ?? "left") as Align} onValueChange={(v) => onStyle(activeField.key, { align: v as Align })}>
                <SelectTrigger className="bg-[#111] text-white border-[#333] h-9"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={onUndo}>Undo</Button>
        <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={onRedo}>Redo</Button>
        <div className="flex-1" />
        <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={onSave}>Save</Button>
        <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white" onClick={onGenerate}>Generate</Button>
      </div>
    </div>
  )
}
