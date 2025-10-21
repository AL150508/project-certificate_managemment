"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Text, Transformer, Circle } from 'react-konva'
import { CertificateElement } from '@/types/certificate'
import Konva from 'konva'

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

interface TextTransformBoxProps {
  elements: CertificateElement[]
  onElementUpdate: (elementId: string, updates: Partial<CertificateElement>) => void
  onElementDelete: (elementId: string) => void
  onElementSelect: (elementId: string | null) => void
  selectedElementId: string | null
  templateDimensions: { width: number; height: number }
  scaleFactor: number
}

export default function TextTransformBox({
  elements,
  onElementUpdate,
  onElementDelete,
  onElementSelect,
  selectedElementId,
  templateDimensions,
  scaleFactor
}: TextTransformBoxProps) {
  const transformerRef = useRef<Konva.Transformer>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const layerRef = useRef<Konva.Layer>(null)

  // Calculate stage dimensions based on template and scale
  const stageWidth = templateDimensions.width * scaleFactor
  const stageHeight = templateDimensions.height * scaleFactor

  useEffect(() => {
    if (transformerRef.current && selectedElementId) {
      const selectedNode = stageRef.current?.findOne(`#${selectedElementId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer()?.batchDraw()
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedElementId])

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Check if clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      onElementSelect(null)
    }
  }

  const handleTextClick = (elementId: string) => {
    onElementSelect(elementId)
  }

  const handleDragEnd = (elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    const newX = node.x() / scaleFactor // Convert back to original scale
    const newY = node.y() / scaleFactor

    console.log(`Element ${elementId} moved to:`, { x: newX, y: newY })

    onElementUpdate(elementId, {
      position: { x: newX, y: newY }
    })
  }

  const handleTransformEnd = (elementId: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Text
    const scaleY = node.scaleY()
    const rotation = node.rotation()

    // Calculate new font size based on scale
    const element = elements.find(el => el.id === elementId)
    if (!element) return

    const newFontSize = Math.round(element.style.fontSize * scaleY)
    const newX = node.x() / scaleFactor
    const newY = node.y() / scaleFactor

    console.log(`Element ${elementId} transformed:`, {
      x: newX,
      y: newY,
      fontSize: newFontSize,
      rotation
    })

    // Reset scale to 1 and update font size instead
    node.scaleX(1)
    node.scaleY(1)

    onElementUpdate(elementId, {
      position: { x: newX, y: newY },
      style: {
        ...element.style,
        fontSize: newFontSize
      },
      rotation: rotation
    })
  }

  const handleDeleteClick = (elementId: string, e: Konva.KonvaEventObject<Event>) => {
    e.cancelBubble = true
    onElementDelete(elementId)
    onElementSelect(null)
  }

  return (
    <div className="absolute inset-0 pointer-events-auto" style={{ zIndex: 1 }}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        ref={stageRef}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
      >
        <Layer ref={layerRef}>
          {/* Render text elements */}
          {elements.map((element) => {
            if (!element.visible) return null

            const x = element.position.x * scaleFactor
            const y = element.position.y * scaleFactor
            const fontSize = element.style.fontSize * scaleFactor
            const rotation = element.rotation || 0

            // Format text based on element type
            let displayText = element.value || element.label || `[${element.type}]`
            if (element.type === 'tanggal' && element.value && element.dateFormat) {
              displayText = formatDate(element.value, element.dateFormat)
            }

            return (
              <Text
                key={element.id}
                id={element.id}
                text={displayText}
                x={x}
                y={y}
                fontSize={fontSize}
                fontFamily={element.style.fontFamily}
                fill={element.style.color}
                align={element.style.alignment}
                rotation={rotation}
                draggable
                onClick={() => handleTextClick(element.id)}
                onTap={() => handleTextClick(element.id)}
                onDragEnd={(e) => handleDragEnd(element.id, e)}
                onTransformEnd={(e) => handleTransformEnd(element.id, e)}
                // Visual feedback for selected element
                stroke={selectedElementId === element.id ? '#3B82F6' : undefined}
                strokeWidth={selectedElementId === element.id ? 1 : 0}
                // Cursor styles
                onMouseEnter={(e) => {
                  const stage = e.target.getStage()
                  if (stage) {
                    stage.container().style.cursor = 'move'
                  }
                }}
                onMouseLeave={(e) => {
                  const stage = e.target.getStage()
                  if (stage) {
                    stage.container().style.cursor = 'default'
                  }
                }}
              />
            )
          })}

          {/* Transformer for selected element */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={[
              'top-left',
              'top-center', 
              'top-right',
              'middle-right',
              'bottom-right',
              'bottom-center',
              'bottom-left',
              'middle-left'
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize to reasonable bounds
              if (newBox.width < 20 || newBox.height < 10) {
                return oldBox
              }
              return newBox
            }}
            // Custom transformer styling
            borderStroke="#3B82F6"
            borderStrokeWidth={2}
            anchorFill="#3B82F6"
            anchorStroke="#1E40AF"
            anchorStrokeWidth={1}
            anchorSize={8}
            rotateAnchorOffset={20}
          />

          {/* Delete button for selected element */}
          {selectedElementId && (() => {
            const selectedElement = elements.find(el => el.id === selectedElementId)
            if (!selectedElement || !selectedElement.visible) return null

            const x = selectedElement.position.x * scaleFactor
            const y = selectedElement.position.y * scaleFactor

            return (
              <>
                {/* Delete button background */}
                <Circle
                  x={x - 15}
                  y={y - 15}
                  radius={12}
                  fill="#EF4444"
                  stroke="#DC2626"
                  strokeWidth={2}
                  onClick={(e) => {
                    e.cancelBubble = true
                    handleDeleteClick(selectedElementId, e)
                  }}
                  onTap={(e) => {
                    e.cancelBubble = true
                    handleDeleteClick(selectedElementId, e)
                  }}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'pointer'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'default'
                    }
                  }}
                />
                {/* Delete button X */}
                <Text
                  x={x - 20}
                  y={y - 20}
                  text="×"
                  fontSize={16}
                  fontFamily="Arial"
                  fill="white"
                  align="center"
                  verticalAlign="middle"
                  onClick={(e) => {
                    e.cancelBubble = true
                    handleDeleteClick(selectedElementId, e)
                  }}
                  onTap={(e) => {
                    e.cancelBubble = true
                    handleDeleteClick(selectedElementId, e)
                  }}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'pointer'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage()
                    if (stage) {
                      stage.container().style.cursor = 'default'
                    }
                  }}
                />
              </>
            )
          })()}
        </Layer>
      </Stage>
    </div>
  )
}
