"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as XLSX from "xlsx"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

type ImportType = "template" | "category" | "member" | "certificate"

export default function ImportClient() {
  const { register, handleSubmit, watch, setValue } = useForm<{ importType: ImportType | ""; file: FileList | null }>()
  const [uploading, setUploading] = useState(false)
  const [logs, setLogs] = useState<Array<{ id: string; type: string; filename: string; status: string; created_at: string; total_rows?: number; error_log?: string }>>([])

  async function loadLogs() {
    const { data } = await supabase.from("imports").select("*").order("created_at", { ascending: false }).limit(20)
    setLogs(data ?? [])
  }

  useEffect(() => { loadLogs() }, [])

  async function onSubmit(vals: { importType: ImportType | ""; file: FileList | null }) {
    if (!vals.importType) { toast.error("Pilih jenis import"); return }
    const file = vals.file?.[0]
    if (!file) { toast.error("Pilih file .xlsx"); return }

    setUploading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(sheet)

      let table = ""
      if (vals.importType === "member") table = "members"
      else if (vals.importType === "category") table = "categories"
      else if (vals.importType === "template") table = "templates"
      else if (vals.importType === "certificate") table = "certificates"

      if (!table) throw new Error("Jenis import tidak dikenal")

      const { error } = await supabase.from(table).insert(jsonData as Record<string, unknown>[])
      if (error) throw error

      await supabase.from("imports").insert({
        type: vals.importType,
        filename: file.name,
        total_rows: jsonData.length,
        status: "success",
        summary_json: { sheet: workbook.SheetNames[0], rows: jsonData.length },
      })
      await supabase.from("activity_logs").insert({
        action: "IMPORT_DATA",
        related_table: table,
        description: `Imported ${jsonData.length} records into ${table}`,
      })

      toast.success(`Import berhasil (${jsonData.length} data)`) 
      loadLogs()
      setValue("file", null)
    } catch (e) {
      await supabase.from("imports").insert({
        type: vals.importType,
        filename: vals.file?.[0]?.name ?? "",
        total_rows: 0,
        status: "failed",
        summary_json: null,
        error_log: e instanceof Error ? e.message : String(e),
      })
      toast.error(e instanceof Error ? e.message : "Import gagal")
      loadLogs()
    } finally {
      setUploading(false)
    }
  }

  function downloadTemplate(type: ImportType) {
    const map: Record<ImportType, Record<string, unknown>[]> = {
      member: [{ name: "", organization: "", phone: "", email: "", job: "", date_of_birth: "", address: "", city: "", notes: "" }],
      category: [{ name: "", description: "", template_id: "", is_active: true }],
      template: [{ name: "", orientation: "portrait", width_px: 800, height_px: 600, background_url: "", thumbnail_url: "" }],
      certificate: [{ certificate_no: "", member_id: "", category_id: "", template_id: "", issued_at: "2025-01-01", status: "draft" }],
    }
    const ws = XLSX.utils.json_to_sheet(map[type])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, `template_${type}.xlsx`)
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-3xl font-semibold">Import Data</h1>
          <p className="text-[#AAAAAA]">Unggah file Excel untuk menambahkan data baru ke sistem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => loadLogs()}>Lihat Riwayat Import</Button>
        </div>
      </div>

      <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Import Type</label>
              <Select onValueChange={(v) => setValue("importType", v as ImportType | "")}>
                <SelectTrigger className="bg-[#111] text-white border-[#333]">
                  <SelectValue placeholder="Pilih jenis import" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] text-white border-[#333]">
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/80">File (.xlsx)</label>
              <input type="file" accept=".xlsx" className="block w-full text-white" {...register("file")}/>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={uploading} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white">{uploading ? 'Processing…' : 'Upload & Import'}</Button>
              <Button type="button" variant="outline" className="border-[#333] text-white hover:bg-[#333] hover:text-white" onClick={() => { const t = (watch("importType") as ImportType) || 'member'; downloadTemplate(t) }}>Download Template Excel</Button>
            </div>
          </div>
        </form>
      </Card>

      <div className="mt-8">
        <h3 className="text-white text-lg font-semibold mb-3">Riwayat Import Terbaru</h3>
        <Card className="bg-[#0F0F0F] border border-[#1f1f1f] p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1f1f1f]">
                  <TableHead className="text-white">File Name</TableHead>
                  <TableHead className="text-white">Import Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Total Records</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} className="border-[#1f1f1f]">
                    <TableCell className="text-white">{l.filename}</TableCell>
                    <TableCell className="text-white">{l.type}</TableCell>
                    <TableCell className={l.status === 'success' ? 'text-[#22c55e]' : 'text-[#dc2626]'}>{l.status}</TableCell>
                    <TableCell className="text-white">{l.total_rows ?? '-'}</TableCell>
                    <TableCell className="text-white">{l.created_at ? new Date(l.created_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow className="border-[#1f1f1f]"><TableCell colSpan={5} className="text-white/70 text-center py-6">Belum ada riwayat import.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}


