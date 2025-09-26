import { useRef, useEffect, type FC } from "react"
import { useDrawingStore } from "../../stores/useDrawingStore"
import { useCanvasStore } from "../../stores/useCanvasStore"

type Props = {
  width: number
  height: number
}

const DrawingCanvas: FC<Props> = ({
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const {
    scale,
    isSpace,
    dragging
  } = useCanvasStore();
  const brush = useDrawingStore((s) => s.brush)

  const isPanning = isSpace && dragging;

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = window.devicePixelRatio || 1
    c.style.width = `${width}px`
    c.style.height = `${height}px`
    c.width = Math.round(width * dpr)
    c.height = Math.round(height * dpr)
    const ctx = c.getContext("2d")
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [width, height])

  useEffect(() => {
    if (isPanning) {
      isDrawingRef.current = false
      lastPosRef.current = null
    }
  }, [isPanning])

  const getLocalCanvasPoint = (e: MouseEvent | React.MouseEvent) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const px = (e as MouseEvent).clientX - rect.left
    const py = (e as MouseEvent).clientY - rect.top
    const wrapper = c.parentElement!
    const style = window.getComputedStyle(wrapper)
    const t = style.transform === "none" ? new DOMMatrix() : new DOMMatrix(style.transform)
    const inv = t.inverse()
    const pt = new DOMPoint(px, py).matrixTransform(inv)
    const cssToCanvasX = c.width / rect.width
    const cssToCanvasY = c.height / rect.height
    return { x: pt.x * cssToCanvasX, y: pt.y * cssToCanvasY, cssToCanvasX, cssToCanvasY }
  }

  const startDrawing = (e: React.MouseEvent) => {
    if (isSpace) return
    if ("button" in e && e.button !== 0) return
    isDrawingRef.current = true
    const p = getLocalCanvasPoint(e)
    lastPosRef.current = { x: p.x, y: p.y }
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
    lastPosRef.current = null
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current || !canvasRef.current || isPanning) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    const p = getLocalCanvasPoint(e)
    const last = lastPosRef.current
    if (!last) {
      lastPosRef.current = { x: p.x, y: p.y }
      return
    }
    const dx = p.x - last.x
    const dy = p.y - last.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001

    const spacingCanvas = (brush.spacing || 1) * p.cssToCanvasX
    const brushSizeCanvas = brush.size * scale * p.cssToCanvasX

    for (let i = 0; i < dist; i += spacingCanvas) {
      const t = i / dist
      const ix = last.x + dx * t
      const iy = last.y + dy * t
      ctx.globalAlpha = brush.opacity || 1
      if (brush.shape instanceof HTMLImageElement) {
        ctx.drawImage(
          brush.shape,
          ix - brushSizeCanvas / 2,
          iy - brushSizeCanvas / 2,
          brushSizeCanvas,
          brushSizeCanvas
        )
      } else if (brush.shape === "square") {
        ctx.fillStyle = brush.color
        ctx.fillRect(
          ix - brushSizeCanvas / 2,
          iy - brushSizeCanvas / 2,
          brushSizeCanvas,
          brushSizeCanvas
        )
      } else {
        ctx.fillStyle = brush.color
        ctx.beginPath()
        ctx.arc(ix, iy, brushSizeCanvas / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    lastPosRef.current = { x: p.x, y: p.y }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  )
}

export default DrawingCanvas
