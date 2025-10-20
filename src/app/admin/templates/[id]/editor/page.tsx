"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer } from "react-konva"

// Simple image loader hook (avoid installing extra deps)
function useImg(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!src) return
    const image = new window.Image()
    image.crossOrigin = "anonymous"
    image.src = src
    const onLoad = () => setImg(image)
    image.addEventListener("load", onLoad)
    return () => image.removeEventListener("load", onLoad)
  }, [src])
  return img
}

export type TemplateField = {
  key: string
  label: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  align?: "left" | "center" | "right"
  color?: string
}

type TemplateRow = {
  id: string
  name: string
  orientation: "landscape" | "portrait" | null
  fields: TemplateField[] | null
  background_url: string | null
}

export default function TemplateEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tpl, setTpl] = useState<TemplateRow | null>(null)
  const [fields, setFields] = useState<TemplateField[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const trRef = useRef<any>(null)
  const stageRef = useRef<any>(null)
  const [previewDataUrl, setPreviewDataUrl] = useState<string>("")
  const grid = 10
  const fontList = ["Poppins","Roboto","Open Sans","Montserrat","Lato","Inter"]
  const img = useImg(tpl?.background_url ?? undefined)

  const stageW = 900
  const stageH = 600

  useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("certificate_templates")
          .select("id, name, orientation, fields, background_url")
          .eq("id", params.id)
          .maybeSingle()
        if (error) throw error
        if (!data) { toast.error("Template not found"); router.push("/templates"); return }
        const row: TemplateRow = {
          id: data.id,
          name: data.name,
          orientation: data.orientation,
          fields: (data.fields ?? []) as TemplateField[],
          background_url: data.background_url,
        }
        setTpl(row)
        setFields(row.fields ?? [])
      } catch (e: any) {
        toast.error(e.message ?? "Failed to load template")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params.id, router])

  function addField() {
    const idx = fields.length + 1
    const f: TemplateField = {
      key: `field_${idx}`,
      label: `Field ${idx}`,
      x: stageW / 2 - 50,
      y: stageH / 2,
      fontSize: 24,
      fontFamily: "Poppins",
      align: "center",
      color: "#000000",
    }
    setFields((p) => [...p, f])
    setSelectedKey(f.key)
  }

  function removeField(k: string) {
    setFields((p) => p.filter((f) => f.key !== k))
    if (selectedKey === k) setSelectedKey(null)
  }

  async function saveLayout() {
    if (!tpl) return
    const { error } = await supabase
      .from("certificate_templates")
      .update({ fields })
      .eq("id", tpl.id)
    if (error) { toast.error(error.message); return }
    toast.success("Layout saved")
    // generate preview image locally dan tampilkan di panel kanan
    try {
      const uri = stageRef.current?.toDataURL({ pixelRatio: 2 }) as string
      if (uri) setPreviewDataUrl(uri)
      if (uri) await uploadPreviewToStorage(uri)
    } catch {}
  }

  const selected = useMemo(() => fields.find((f) => f.key === selectedKey) ?? null, [fields, selectedKey])

  // Bind transformer to the selected text node
  useEffect(() => {
    if (!stageRef.current || !trRef.current) return
    const layer = stageRef.current.getLayers?.()[0]
    if (!layer) return
    const node = layer.findOne(`.${selectedKey}`)
    if (node && trRef.current) {
      trRef.current.nodes([node])
      trRef.current.getLayer()?.batchDraw()
    } else if (trRef.current) {
      trRef.current.nodes([])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [selectedKey])

  async function uploadPreviewToStorage(uri: string) {
    try {
      if (!tpl) return
      const res = await fetch(uri)
      const blob = await res.blob()
      const path = `templates/${tpl.id}/preview.png`
      const up = await supabase.storage.from("certificates").upload(path, blob, { contentType: "image/png", upsert: true })
      if (up.error) throw up.error
      const pub = supabase.storage.from("certificates").getPublicUrl(path)
      await supabase.from("certificate_templates").update({ preview_url: pub.data.publicUrl }).eq("id", tpl.id)
    } catch (err: any) {
      console.warn("Upload preview failed", err?.message)
    }
  }

  return (
    <div className="min-h-dvh w-full bg-[#0A0A0A] text-white">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Template Editor</h1>
            <p className="text-white/60">{tpl?.name ?? "Loading..."}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => router.back()}>Back</Button>
            <Button className="bg-rose-600 hover:bg-rose-500" onClick={saveLayout} disabled={loading}>Save Layout</Button>
            {tpl && (
              <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => router.push(`/certificates?templateId=${tpl.id}`)}>Use Template</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
          {/* Fields Panel */}
          <Card className="2xl:col-span-3 bg-[#0F0F0F] border border-[#1f1f1f] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Fields</h3>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-500" onClick={addField}>+ Add</Button>
            </div>
            <div className="space-y-2">
              {fields.map((f) => (
                <div key={f.key} className={`flex items-center justify-between rounded-md border px-3 py-2 ${selectedKey === f.key ? 'border-rose-500' : 'border-[#333]'}`}>
                  <button className="text-left text-sm" onClick={() => setSelectedKey(f.key)}>
                    <div className="font-medium">{f.label}</div>
                    <div className="text-white/60">{f.key} • ({Math.round(f.x)},{Math.round(f.y)})</div>
                  </button>
                  <Button variant="outline" size="sm" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => removeField(f.key)}>Delete</Button>
                </div>
              ))}
              {fields.length === 0 && <div className="text-sm text-white/60">No fields. Click Add to create one.</div>}
            </div>

            {selected && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Style</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-white/60">Label</label>
                    <Input value={selected.label} onChange={(e) => setFields((arr) => arr.map((f) => f.key === selected.key ? { ...f, label: e.target.value } : f))} className="bg-[#111] text-white border-[#333] h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Font</label>
                    <Select value={selected.fontFamily ?? "Poppins"} onValueChange={(v) => setFields((arr) => arr.map((f) => f.key === selected.key ? { ...f, fontFamily: v } : f))}>
                      <SelectTrigger className="bg-[#111] text-white border-[#333] h-8"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0A0A0A] text-white border-[#333] max-h-64">
                        {fontList.map(ff => <SelectItem key={ff} value={ff}>{ff}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Font Size</label>
                    <Input type="number" value={selected.fontSize ?? 24} onChange={(e) => setFields((arr) => arr.map((f) => f.key === selected.key ? { ...f, fontSize: Number(e.target.value) } : f))} className="bg-[#111] text-white border-[#333] h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Color</label>
                    <Input type="color" value={selected.color ?? "#000000"} onChange={(e) => setFields((arr) => arr.map((f) => f.key === selected.key ? { ...f, color: e.target.value } : f))} className="bg-[#111] text-white border-[#333] h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Align</label>
                    <Select value={selected.align ?? "center"} onValueChange={(v) => setFields((arr) => arr.map((f) => f.key === selected.key ? { ...f, align: v as any } : f))}>
                      <SelectTrigger className="bg-[#111] text-white border-[#333] h-8"><SelectValue /></SelectTrigger>
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
          </Card>

          {/* Canvas + Preview */}
          <Card className="2xl:col-span-9 bg-[#0F0F0F] border border-[#1f1f1f] p-3">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 rounded-lg overflow-auto">
                <Stage ref={stageRef} width={stageW} height={stageH} className="mx-auto bg-black/40 rounded-lg">
                  <Layer>
                    {img && <KonvaImage image={img} width={stageW} height={stageH} />}
                    {fields.map((f) => (
                      <KonvaText
                        key={f.key}
                        name={f.key}
                        text={f.label ?? f.key}
                        x={f.x}
                        y={f.y}
                        draggable
                        dragBoundFunc={(pos) => ({ x: Math.round(pos.x / grid) * grid, y: Math.round(pos.y / grid) * grid })}
                        fontSize={f.fontSize ?? 24}
                        fill={f.color ?? "#000000"}
                        fontFamily={f.fontFamily ?? "Poppins"}
                        align={f.align ?? "center"}
                        onDragEnd={(e) => {
                          const { x, y } = e.target.position()
                          setFields((arr) => arr.map((it) => it.key === f.key ? { ...it, x, y } : it))
                        }}
                        onClick={() => setSelectedKey(f.key)}
                        onTap={() => setSelectedKey(f.key)}
                      />
                    ))}
                    <Transformer
                      ref={trRef}
                      rotateEnabled
                      enabledAnchors={["middle-left","middle-right"]}
                      boundBoxFunc={(oldBox, newBox) => {
                        // batasi resize agar tidak terlalu kecil
                        if (newBox.width < 20) return oldBox
                        return newBox
                      }}
                    />
                  </Layer>
                </Stage>
              </div>
              <div className="xl:col-span-1">
                <h3 className="text-sm font-semibold mb-2">Preview</h3>
                <div className="rounded-md overflow-hidden border border-[#1f1f1f] bg-black/30">
                  {previewDataUrl ? (
                    <img src={previewDataUrl} alt="Preview" className="w-full h-auto" />
                  ) : (
                    <div className="p-6 text-white/60 text-sm">Simpan layout untuk menampilkan preview.</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
