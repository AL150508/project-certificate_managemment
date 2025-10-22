"use client"

import { CertificateElement, TemplateSource } from '@/types/certificate'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import TemplateSelector from './TemplateSelector'

interface EditorPanelProps {
  elements: CertificateElement[]
  onElementUpdate: (elementId: string, updates: Partial<CertificateElement>) => void
  onElementAdd: (type: CertificateElement['type']) => void
  onElementDelete: (elementId: string) => void
  onElementDuplicate: (element: CertificateElement) => void
  selectedElementId: string | null
  onElementSelect: (elementId: string | null) => void
  templateSource: TemplateSource | null
  onTemplateSelect: (template: TemplateSource) => void
  onSaveTemplate: () => void
  saving: boolean
}

const FONT_FAMILIES = [
  'Inter',
  'Poppins', 
  'Roboto',
  'Arial',
  'Helvetica',
  'Times New Roman'
]

const ELEMENT_TYPES: { type: CertificateElement['type'], label: string }[] = [
  { type: 'name', label: 'Name' },
  { type: 'description', label: 'Description' },
  { type: 'date', label: 'Date' },
  { type: 'number', label: 'Number' },
  { type: 'tanggal', label: 'Tanggal' },
  { type: 'location', label: 'Location' }
]

// Date format options for tanggal element
const DATE_FORMATS = [
  { value: 'dd-mm-yyyy', label: '20-10-2026 (dd-mm-yyyy)', example: '20-10-2026' },
  { value: 'mm-dd-yyyy', label: '10-20-2026 (mm-dd-yyyy)', example: '10-20-2026' },
  { value: 'yyyy-mm-dd', label: '2026-10-20 (yyyy-mm-dd)', example: '2026-10-20' },
  { value: 'dd-mmm-yyyy', label: '20 Oct 2026 (dd mmm yyyy)', example: '20 Oct 2026' },
  { value: 'dd-mmmm-yyyy', label: '20 October 2026 (dd mmmm yyyy)', example: '20 October 2026' },
  { value: 'mmm-dd-yyyy', label: 'Oct 20, 2026 (mmm dd, yyyy)', example: 'Oct 20, 2026' },
  { value: 'mmmm-dd-yyyy', label: 'October 20, 2026 (mmmm dd, yyyy)', example: 'October 20, 2026' },
  { value: 'dd/mm/yyyy', label: '20/10/2026 (dd/mm/yyyy)', example: '20/10/2026' },
  { value: 'mm/dd/yyyy', label: '10/20/2026 (mm/dd/yyyy)', example: '10/20/2026' },
  { value: 'yyyy/mm/dd', label: '2026/10/20 (yyyy/mm/dd)', example: '2026/10/20' }
]

// Helper function to format date based on selected format
const formatDate = (dateString: string, format: string): string => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthNamesFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const monthShort = monthNames[date.getMonth()]
  const monthFull = monthNamesFull[date.getMonth()]
  
  switch (format) {
    case 'dd-mm-yyyy': return `${day}-${month}-${year}`
    case 'mm-dd-yyyy': return `${month}-${day}-${year}`
    case 'yyyy-mm-dd': return `${year}-${month}-${day}`
    case 'dd-mmm-yyyy': return `${day} ${monthShort} ${year}`
    case 'dd-mmmm-yyyy': return `${day} ${monthFull} ${year}`
    case 'mmm-dd-yyyy': return `${monthShort} ${day}, ${year}`
    case 'mmmm-dd-yyyy': return `${monthFull} ${day}, ${year}`
    case 'dd/mm/yyyy': return `${day}/${month}/${year}`
    case 'mm/dd/yyyy': return `${month}/${day}/${year}`
    case 'yyyy/mm/dd': return `${year}/${month}/${day}`
    default: return `${day}-${month}-${year}`
  }
}

export default function EditorPanel({
  elements,
  onElementUpdate,
  onElementAdd,
  onElementDelete,
  onElementDuplicate,
  selectedElementId,
  onElementSelect,
  templateSource,
  onTemplateSelect,
  onSaveTemplate,
  saving
}: EditorPanelProps) {
  const selectedElement = elements.find(el => el.id === selectedElementId)

  const handleElementClick = (type: CertificateElement['type']) => {
    // Always add new element, no limit!
    console.log('Adding new element of type:', type)
    onElementAdd(type)
  }

  const updateElement = (updates: Partial<CertificateElement>) => {
    if (selectedElementId) {
      onElementUpdate(selectedElementId, updates)
    }
  }

  const updatePosition = (axis: 'x' | 'y', value: number) => {
    if (selectedElement) {
      updateElement({
        position: {
          ...selectedElement.position,
          [axis]: value
        }
      })
    }
  }

  const updateStyle = (styleUpdates: Partial<CertificateElement['style']>) => {
    if (selectedElement) {
      updateElement({
        style: {
          ...selectedElement.style,
          ...styleUpdates
        }
      })
    }
  }

  const handleElementMove = (elementId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const moveDistance = 10
    const element = elements.find(el => el.id === elementId)
    if (!element) return

    let newX = element.position.x
    let newY = element.position.y

    switch (direction) {
      case 'up':
        newY = Math.max(0, newY - moveDistance)
        break
      case 'down':
        newY = newY + moveDistance
        break
      case 'left':
        newX = Math.max(0, newX - moveDistance)
        break
      case 'right':
        newX = newX + moveDistance
        break
    }

    updateElement({
      position: { x: newX, y: newY }
    })
  }

  return (
    <div className="flex flex-col bg-[#111827] rounded-xl p-5 border border-[#1f2937] overflow-y-auto h-[680px]">
      <h2 className="text-xl font-semibold mb-4 text-[#E2E8F0]">Certificate Editor</h2>

      <TemplateSelector
        onTemplateSelect={onTemplateSelect}
        selectedTemplate={templateSource}
      />

      <Separator className="my-4 bg-[#1f2937]" />
      {/* Edit Elements Section */}
      <div>
        <Label className="text-[#E2E8F0] text-sm mb-3 block">Edit Elements</Label>
        <div className="mt-4 flex flex-wrap justify-between gap-3">
          {ELEMENT_TYPES.map(({ type, label }) => {
            const elementCount = elements.filter(el => el.type === type).length
            
            return (
              <Button
                key={type}
                className={cn(
                  "bg-[#1E293B] border border-[#334155] text-[#E2E8F0] px-4 py-2 rounded-md w-[48%] hover:bg-[#334155] h-10 text-sm font-medium relative"
                )}
                onClick={() => handleElementClick(type)}
              >
                {label}
                {elementCount > 0 && (
                  <span className="ml-2 bg-[#3B82F6] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {elementCount}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      <Separator className="my-4 bg-[#1f2937]" />

      {/* Element Properties Form */}
      {selectedElement && (
        <div className="space-y-4">
          <Label className="text-[#E2E8F0] text-sm block">Element Properties</Label>
          
          {/* Value Input */}
          <div>
            <Label className="text-[#94A3B8] text-xs mb-2 block">
              {selectedElement.label} Value
            </Label>
            <Input
              value={selectedElement.value}
              onChange={(e) => updateElement({ value: e.target.value })}
              className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
              placeholder="Enter value"
            />
          </div>

          {/* Date Format Selector - Only show for tanggal element */}
          {selectedElement.type === 'tanggal' && (
            <div className="space-y-3">
              <div>
                <Label className="text-[#94A3B8] text-xs mb-2 block">Date Format</Label>
                <Select 
                  value={selectedElement.dateFormat || 'dd-mm-yyyy'} 
                  onValueChange={(value) => updateElement({ dateFormat: value })}
                >
                  <SelectTrigger className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-[#334155] max-h-60">
                    {DATE_FORMATS.map(format => (
                      <SelectItem 
                        key={format.value} 
                        value={format.value} 
                        className="text-[#E2E8F0] hover:bg-[#334155] focus:bg-[#334155]"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{format.example}</span>
                          <span className="text-xs text-[#94A3B8]">{format.value}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-[#94A3B8] text-xs mb-2 block">Select Date</Label>
                <Input
                  type="date"
                  value={selectedElement.value || new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateElement({ value: e.target.value })}
                  className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
                />
              </div>
            </div>
          )}

          {/* Location Input - Only show for location element */}
          {selectedElement.type === 'location' && (
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Location Details</Label>
              <Input
                value={selectedElement.value || ''}
                onChange={(e) => updateElement({ value: e.target.value })}
                className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
                placeholder="e.g., Jakarta, Indonesia"
              />
            </div>
          )}

          {/* Position Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Position X</Label>
              <Input
                type="number"
                value={selectedElement.position.x}
                onChange={(e) => updatePosition('x', Number(e.target.value))}
                className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Position Y</Label>
              <Input
                type="number"
                value={selectedElement.position.y}
                onChange={(e) => updatePosition('y', Number(e.target.value))}
                className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
              />
            </div>
          </div>

          {/* Style Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Alignment</Label>
              <Select 
                value={selectedElement.style.alignment} 
                onValueChange={(value: 'left' | 'center' | 'right') => updateStyle({ alignment: value })}
              >
                <SelectTrigger className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  <SelectItem value="left" className="text-[#E2E8F0] hover:bg-[#334155]">Left</SelectItem>
                  <SelectItem value="center" className="text-[#E2E8F0] hover:bg-[#334155]">Center</SelectItem>
                  <SelectItem value="right" className="text-[#E2E8F0] hover:bg-[#334155]">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Font Family</Label>
              <Select 
                value={selectedElement.style.fontFamily} 
                onValueChange={(value) => updateStyle({ fontFamily: value })}
              >
                <SelectTrigger className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-[#334155]">
                  {FONT_FAMILIES.map(font => (
                    <SelectItem key={font} value={font} className="text-[#E2E8F0] hover:bg-[#334155]">
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Font Size</Label>
              <Input
                type="number"
                value={selectedElement.style.fontSize}
                onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                className="w-full h-10 bg-[#1E293B] border border-[#334155] text-[#E2E8F0] rounded-md px-3 text-sm"
                min="8"
                max="72"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8] text-xs mb-2 block">Color</Label>
              <Input
                type="color"
                value={selectedElement.style.color}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="w-full h-10 bg-[#1E293B] border border-[#334155] rounded-md cursor-pointer"
              />
            </div>
          </div>

        </div>
      )}

      <div className="mt-6 flex gap-3 justify-end">
        <Button 
          onClick={onSaveTemplate}
          disabled={saving}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-md px-5 py-2"
        >
          {saving ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
    </div>
  )
}
