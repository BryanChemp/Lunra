import { useEffect, useRef, type FC } from "react"
import type { Layer } from "../../../stores/useLayerStore"

interface Props {
    index: number;
    layer: Layer;
}

const LayerPreview: FC<Props> = ({ index, layer }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#18a77a"
    ctx.fillRect(10, 10, 40, 40)

    ctx.fillStyle = "white"
    ctx.font = "10px sans-serif"
    ctx.fillText((index + 1).toString(), 5, 12)
  }, [layer])

  return <canvas ref={canvasRef} width={60} height={60} />
}

export default LayerPreview;