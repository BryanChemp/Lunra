// hooks/useToolHotkeys.ts
import { useEffect } from "react"
import { useDrawingStore } from "../../../stores/useDrawingStore"
import type { ToolItem } from "../../../types/ToolsTypes"


export function useToolHotkeys(tools: ToolItem[]) {
  const { setTool } = useDrawingStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code === "Space" ? "Space" : e.key.toUpperCase()
      const found = tools.find(t => t.shortcut.toUpperCase() === key)
      if (found) {
        e.preventDefault()
        setTool(found.name)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [tools, setTool])
}
