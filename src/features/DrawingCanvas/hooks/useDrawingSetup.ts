import { useEffect } from "react"

export function useDrawingSetup(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
  withBackground: boolean
) {
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const dpr = window.devicePixelRatio || 1
    c.style.width = `${width}px`
    c.style.height = `${height}px`
    c.width = Math.round(width * dpr)
    c.height = Math.round(height * dpr)
    const ctx = c.getContext("2d")
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    if (withBackground) {
      ctx.fillStyle = "#ffffffff"
      ctx.fillRect(0, 0, c.width, c.height)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [width, height, canvasRef, withBackground])
}
