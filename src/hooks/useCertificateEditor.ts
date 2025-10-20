"use client"

import { useCallback, useMemo, useReducer } from "react"

export type Align = "left" | "center" | "right"
export type TemplateField = {
  key: string
  label?: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  color?: string
  align?: Align
}

export type LayoutSnapshot = {
  width: number
  height: number
  orientation: "landscape" | "portrait"
  fields: TemplateField[]
}

export type EditorState = {
  layout: LayoutSnapshot
  values: Record<string, string>
  selectedKey: string | null
  past: Array<{ layout: LayoutSnapshot; values: Record<string, string>; selectedKey: string | null }>
  future: Array<{ layout: LayoutSnapshot; values: Record<string, string>; selectedKey: string | null }>
}

export type EditorAction =
  | { type: "init"; payload: { layout: LayoutSnapshot; values: Record<string, string> } }
  | { type: "select"; key: string | null }
  | { type: "set-value"; key: string; value: string }
  | { type: "move-field"; key: string; x: number; y: number }
  | { type: "style-field"; key: string; patch: Partial<TemplateField> }
  | { type: "add-field"; field: TemplateField; defaultValue?: string }
  | { type: "undo" }
  | { type: "redo" }

function cloneLayout(l: LayoutSnapshot): LayoutSnapshot {
  return { ...l, fields: l.fields.map(f => ({ ...f })) }
}

function snapshot(s: EditorState) {
  return { layout: cloneLayout(s.layout), values: { ...s.values }, selectedKey: s.selectedKey }
}

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "init": {
      return { layout: cloneLayout(action.payload.layout), values: { ...action.payload.values }, selectedKey: null, past: [], future: [] }
    }
    case "select": {
      return { ...state, selectedKey: action.key }
    }
    case "set-value": {
      const prev = snapshot(state)
      const values = { ...state.values, [action.key]: action.value }
      return { ...state, values, past: [...state.past, prev], future: [] }
    }
    case "move-field": {
      const prev = snapshot(state)
      const layout = cloneLayout(state.layout)
      layout.fields = layout.fields.map(f => f.key === action.key ? { ...f, x: action.x, y: action.y } : f)
      return { ...state, layout, past: [...state.past, prev], future: [] }
    }
    case "style-field": {
      const prev = snapshot(state)
      const layout = cloneLayout(state.layout)
      layout.fields = layout.fields.map(f => f.key === action.key ? { ...f, ...action.patch } : f)
      return { ...state, layout, past: [...state.past, prev], future: [] }
    }
    case "add-field": {
      const prev = snapshot(state)
      const layout = cloneLayout(state.layout)
      layout.fields = [...layout.fields, action.field]
      const values = { ...state.values }
      if (action.defaultValue !== undefined) values[action.field.key] = action.defaultValue
      return { ...state, layout, values, selectedKey: action.field.key, past: [...state.past, prev], future: [] }
    }
    case "undo": {
      if (state.past.length === 0) return state
      const prev = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, -1)
      const future = [snapshot(state), ...state.future]
      return { ...prev, past: newPast, future }
    }
    case "redo": {
      if (state.future.length === 0) return state
      const next = state.future[0]
      const future = state.future.slice(1)
      const past = [...state.past, snapshot(state)]
      return { ...next, past, future }
    }
    default:
      return state
  }
}

export function useCertificateEditor(initialLayout?: LayoutSnapshot, initialValues?: Record<string, string>) {
  const [state, dispatch] = useReducer(reducer, {
    layout: initialLayout ?? { width: 1200, height: 850, orientation: "landscape", fields: [] },
    values: initialValues ?? {},
    selectedKey: null,
    past: [],
    future: [],
  })

  const api = useMemo(() => ({
    select: (k: string | null) => dispatch({ type: "select", key: k }),
    setValue: (k: string, v: string) => dispatch({ type: "set-value", key: k, value: v }),
    moveField: (k: string, x: number, y: number) => dispatch({ type: "move-field", key: k, x, y }),
    styleField: (k: string, patch: Partial<TemplateField>) => dispatch({ type: "style-field", key: k, patch }),
    addField: (f: TemplateField, defaultValue?: string) => dispatch({ type: "add-field", field: f, defaultValue }),
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    init: (layout: LayoutSnapshot, values: Record<string, string>) => dispatch({ type: "init", payload: { layout, values } }),
  }), [])

  const getSnapshot = useCallback(() => ({ layout: state.layout, values: state.values }), [state.layout, state.values])

  return { state, api, getSnapshot }
}
