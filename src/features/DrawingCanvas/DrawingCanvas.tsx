import { useRef, type FC, useLayoutEffect } from "react"
import { useDrawingStore } from "../../stores/useDrawingStore"
import { useCanvasStore } from "../../stores/useCanvasStore"
import { useLayerStore } from "../../stores/useLayerStore"
import { useKeyboardKeyListener } from "../../hooks/useKeyboardKeyListener"
import { DefaultShortcutKeymap } from "../../constants/keymap"
import { useStateStack } from "./hooks/useStateStack"
import { useFloodFill } from "./hooks/useFloodFill"
import { useBrushDrawing } from "./hooks/useBrushDrawing"
import { useDrawingSetup } from "./hooks/useDrawingSetup"

type Props = {
  width: number
  height: number
  layerId: string
  style?: React.CSSProperties
}

const DrawingCanvas: FC<Props> = ({ width, height, layerId, style }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)

  const { scale, isSpace, dragging } = useCanvasStore()
  const { brush, tool } = useDrawingStore()
  const { layers, updateLayerCanvasRef } = useLayerStore()
  const layer = layers.find((l) => l.id === layerId)

  const { undo, redo, saveState } = useStateStack(canvasRef)
  const { getPixelColor, hexToRgba, floodFillScanline } = useFloodFill()
  const { lastPosRef, drawStroke } = useBrushDrawing(canvasRef, brush, scale, tool === "eraser")

  useKeyboardKeyListener({
    [DefaultShortcutKeymap.UNDO]: undo,
    [DefaultShortcutKeymap.REDO]: redo,
    [DefaultShortcutKeymap.SAVE]: () => {},
    "Control+y": redo,
    "Meta+z": redo,
  })

  const handMode = tool === "hand"
  const fillMode = tool === "fill"
  const isPanning = (isSpace || handMode) && dragging

  useLayoutEffect(() => {
    if (!layer) return
    if (!layer.canvasRef) {
      updateLayerCanvasRef(layer.id, canvasRef)
    }
  }, [layer, canvasRef, updateLayerCanvasRef])

  useDrawingSetup(canvasRef, width, height, layers.length === 1)

  const getLocalCanvasPoint = (e: MouseEvent | React.MouseEvent) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const px = (e as MouseEvent).clientX - rect.left
    const py = (e as MouseEvent).clientY - rect.top
    const cssToCanvasX = c.width / rect.width
    const cssToCanvasY = c.height / rect.height
    return { x: px * cssToCanvasX, y: py * cssToCanvasY, cssToCanvasX, cssToCanvasY }
  }

  const startDrawing = (e: React.MouseEvent) => {
    if (isSpace || !layer?.visible) return
    if ("button" in e && e.button !== 0) return

    saveState()

    if (fillMode && canvasRef.current) {
      const c = canvasRef.current
      const ctx = c.getContext("2d")
      if (!ctx) return
      const { x, y } = getLocalCanvasPoint(e)
      const imageData = ctx.getImageData(0, 0, c.width, c.height)
      const targetColor = getPixelColor(imageData, Math.floor(x), Math.floor(y))
      const fillColor = hexToRgba(brush.color, brush.opacity || 1)
      if (targetColor.join() !== fillColor.join()) {
        floodFillScanline(imageData, Math.floor(x), Math.floor(y), targetColor, fillColor)
        ctx.putImageData(imageData, 0, 0)
      }
      return
    }

    isDrawingRef.current = true
    const p = getLocalCanvasPoint(e)
    lastPosRef.current = { x: p.x, y: p.y }
  }

  const stopDrawing = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    lastPosRef.current = null
    saveState()
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current || !canvasRef.current || isPanning || !layer?.visible) return
    const p = getLocalCanvasPoint(e)
    const last = lastPosRef.current
    if (!last) {
      lastPosRef.current = { x: p.x, y: p.y }
      return
    }
    drawStroke(p, last)
    lastPosRef.current = { x: p.x, y: p.y }
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "crosshair",
        opacity: layer?.visible ? 1 : 0,
        ...style,
      }}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onMouseMove={draw}
    />
  )
}

export default DrawingCanvas