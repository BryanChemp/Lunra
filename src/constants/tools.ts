import { faHand, faObjectGroup, faFillDrip, faEraser, faPaintBrush } from "@fortawesome/free-solid-svg-icons"
import type { ToolItem } from "../types/ToolsTypes"

export const tools: ToolItem[] = [
  { icon: faHand, label: "Mover", shortcut: "H", name: "hand" },
  { icon: faObjectGroup, label: "Seleção", shortcut: "M", name: "select" },
  { icon: faFillDrip, label: "Preencher", shortcut: "G", name: "fill" },
  { icon: faEraser, label: "Borracha", shortcut: "E", name: "eraser" },
  { icon: faPaintBrush, label: "Pincel", shortcut: "B", name: "brush" }
]
