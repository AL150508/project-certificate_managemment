"use client"

import { Toggle } from "@/components/ui/toggle"
import { useState } from "react"

interface OrientationToggleProps {
  value: "landscape" | "portrait"
  onChange: (value: "landscape" | "portrait") => void
}

export default function OrientationToggle({ value, onChange }: OrientationToggleProps) {
  return (
    <div className="flex gap-2 items-center">
      <Toggle
        pressed={value === "landscape"}
        onPressedChange={() => onChange("landscape")}
        className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
      >
        Landscape
      </Toggle>
      <Toggle
        pressed={value === "portrait"}
        onPressedChange={() => onChange("portrait")}
        className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
      >
        Portrait
      </Toggle>
    </div>
  )
}
