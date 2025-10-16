"use client"

import { useState } from "react"

type RenderArgs = { open: boolean; setOpen: (v: boolean) => void }

export function ClientSidebarState({ children }: { children: (args: RenderArgs) => React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <>{children({ open, setOpen })}</>
}


