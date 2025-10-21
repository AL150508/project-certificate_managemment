"use client"

import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer } from "react-konva"
import useImage from "use-image"
import type { LayoutSnapshot } from "@/hooks/useCertificateEditor"

const GRID = 10

export default function CertificateCanvas({
  layout,
  values,
  selectedKey,
  onSelect,
  onMove,
}: {
  layout: LayoutSnapshot
  values: Record<string, string>
  selectedKey: string | null
  onSelect: (key: string | null) => void
  onMove: (key: string, x: number, y: number) => void
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layerRef = useRef<any>(null)
  const [bgUrl, setBgUrl] = useState<string | null>(null)

  const [image] = useImage(bgUrl ?? "")

  useEffect(() => {
    // expect background saved in layout via a pseudo-field key '__background__' or width/height only
    // if template stored background_url in layout as property, we read it
    const layoutWithBg = layout as typeof layout & { background_url?: string | null }
    setBgUrl(layoutWithBg.background_url ?? null)
  }, [layout])

  useEffect(() => {
    if (!layerRef.current || !trRef.current) return
    const node = layerRef.current.findOne(`.${selectedKey}`)
    if (node) {
      trRef.current.nodes([node])
      trRef.current.getLayer()?.batchDraw()
    } else {
      trRef.current.nodes([])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [selectedKey, layout])

  return (
    <div className="w-full">
      <Stage width={layout.width} height={layout.height} className="border border-[#222] bg-black">
        <Layer ref={layerRef}>
          {image && <KonvaImage image={image} width={layout.width} height={layout.height} listening={false} />}
          {layout.fields.map((f) => (
            <KonvaText
              key={f.key}
              name={f.key}
              text={values[f.key] ?? f.label ?? f.key}
              x={f.x}
              y={f.y}
              draggable
              dragBoundFunc={(pos) => ({ x: Math.round(pos.x / GRID) * GRID, y: Math.round(pos.y / GRID) * GRID })}
              fontSize={f.fontSize ?? 24}
              fill={f.color ?? "#000"}
              fontFamily={f.fontFamily ?? "Poppins"}
              align={(f.align as 'left' | 'center' | 'right') ?? "left"}
              onDragEnd={(e) => {
                const { x, y } = e.target.position()
                onMove(f.key, x, y)
              }}
              onClick={() => onSelect(f.key)}
              onTap={() => onSelect(f.key)}
            />
          ))}
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={["middle-left", "middle-right"]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20) return oldBox
              return newBox
            }}
          />
        </Layer>
      </Stage>
    </div>
  )
}
