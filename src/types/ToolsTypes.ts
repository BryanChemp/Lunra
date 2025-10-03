// types/index.ts
import { type IconDefinition } from "@fortawesome/free-solid-svg-icons"

export type Tool = "brush" | "eraser" | "select" | "fill" | "hand" 

export interface ToolItem {
  icon: IconDefinition
  label: string
  shortcut: string
  name: Tool
}
