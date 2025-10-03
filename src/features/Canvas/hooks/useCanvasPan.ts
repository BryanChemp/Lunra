import { useRef } from "react"
import { useDrawingStore } from "../../../stores/useDrawingStore"
import { useCanvasStore } from "../../../stores/useCanvasStore"

export function useCanvasPan() {
  const { dragging, isSpace, setDragging, moveOffset } = useCanvasStore()
  const { tool } = useDrawingStore()

  const handMode = tool === "hand"
  const lastPos = useRef({ x: 0, y: 0 })

  const startDrag = (e: React.MouseEvent) => {
    if (isSpace || handMode) {
      setDragging(true)
      lastPos.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
  }

  const stopDrag = () => setDragging(false)

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    moveOffset(dx, dy)
  }

  return { startDrag, stopDrag, onDrag }
}
