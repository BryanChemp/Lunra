import { useCanvasStore } from "../../../stores/useCanvasStore"

export function useCanvasShortcuts() {
  const { setIsSpace } = useCanvasStore()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(true)
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(false)
  }

  return { handleKeyDown, handleKeyUp }
}
