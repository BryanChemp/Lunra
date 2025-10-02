import { useRef, useEffect, type FC } from "react"
import { useDrawingStore } from "../../stores/useDrawingStore"
import { useCanvasStore } from "../../stores/useCanvasStore"
import { useLayerStore } from "../../stores/useLayerStore"

type Props = {
  width: number
  height: number
  layerId: string
  style?: React.CSSProperties
}

const DrawingCanvas: FC<Props> = ({ width, height, layerId, style }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  const { scale, isSpace, dragging } = useCanvasStore()
  const { brush, tool } = useDrawingStore();
  const { layers } = useLayerStore();
  const layer = layers.find((l) => l.id === layerId);

  const handMode = tool === "hand";
  const eraseMode = tool === "eraser";
  const fillMode = tool === "fill";
  
  const isPanning = (isSpace || handMode) && dragging;

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
    const cssToCanvasX = c.width / rect.width
    const cssToCanvasY = c.height / rect.height
    return { x: px * cssToCanvasX, y: py * cssToCanvasY, cssToCanvasX, cssToCanvasY }
  }

    const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4
    const d = imageData.data
    return [d[index], d[index + 1], d[index + 2], d[index + 3]]
  }

  const hexToRgba = (hex: string, opacity: number) => {
    const bigint = parseInt(hex.replace("#", ""), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b, Math.round(opacity * 255)]
  }

  const floodFill = (imageData: ImageData, x: number, y: number, targetColor: number[], fillColor: number[]) => {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data
    const stack = [[x, y]]

    const matchColor = (px: number, py: number) => {
      const idx = (py * width + px) * 4
      return (
        data[idx] === targetColor[0] &&
        data[idx + 1] === targetColor[1] &&
        data[idx + 2] === targetColor[2] &&
        data[idx + 3] === targetColor[3]
      )
    }

    const setColor = (px: number, py: number) => {
      const idx = (py * width + px) * 4
      data[idx] = fillColor[0]
      data[idx + 1] = fillColor[1]
      data[idx + 2] = fillColor[2]
      data[idx + 3] = fillColor[3]
    }

    while (stack.length) {
      const [px, py] = stack.pop()!
      if (px < 0 || py < 0 || px >= width || py >= height) continue
      if (!matchColor(px, py)) continue
      setColor(px, py)
      stack.push([px + 1, py])
      stack.push([px - 1, py])
      stack.push([px, py + 1])
      stack.push([px, py - 1])
    }
  }

  const startDrawing = (e: React.MouseEvent) => {
    if (isSpace || !layer?.visible) return
    if ("button" in e && e.button !== 0) return

    if (fillMode && canvasRef.current) {
      const c = canvasRef.current
      const ctx = c.getContext("2d")
      if (!ctx) return
      const { x, y } = getLocalCanvasPoint(e)

      const imageData = ctx.getImageData(0, 0, c.width, c.height)
      const targetColor = getPixelColor(imageData, Math.floor(x), Math.floor(y))
      const fillColor = hexToRgba(brush.color, brush.opacity || 1)
      floodFill(imageData, Math.floor(x), Math.floor(y), targetColor, fillColor)
      ctx.putImageData(imageData, 0, 0)
      return
    }

    isDrawingRef.current = true
    const p = getLocalCanvasPoint(e)
    lastPosRef.current = { x: p.x, y: p.y }
  }


  const stopDrawing = () => {
    isDrawingRef.current = false
    lastPosRef.current = null
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawingRef.current || !canvasRef.current || isPanning || !layer?.visible) return
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

      if (eraseMode) {
        ctx.clearRect(
          ix - brushSizeCanvas / 2,
          iy - brushSizeCanvas / 2,
          brushSizeCanvas,
          brushSizeCanvas
        )
      }
      else if (brush.shape instanceof HTMLImageElement) {
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
