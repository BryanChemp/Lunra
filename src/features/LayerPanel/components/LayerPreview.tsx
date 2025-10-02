import { useEffect, useRef, type FC } from "react"
import type { Layer } from "../../../stores/useLayerStore"

interface Props {
    index: number;
    layer: Layer;
}

const LayerPreview: FC<Props> = ({ layer }) => {
  const previewRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const preview = previewRef.current
    const layerCanvas = layer.canvasRef?.current
    if (!preview || !layerCanvas) return
    const ctx = preview.getContext("2d")
    if (!ctx) return

    const drawPreview = () => {
      const layerCtx = layerCanvas.getContext("2d")
      if (!layerCtx) return
      const pixel = layerCtx.getImageData(0, 0, 1, 1).data
      const isTransparent = pixel[3] === 0

      if (isTransparent) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, preview.width, preview.height)
      } else {
        ctx.clearRect(0, 0, preview.width, preview.height)
      }

      ctx.drawImage(
        layerCanvas,
        0, 0, layerCanvas.width, layerCanvas.height,
        0, 0, preview.width, preview.height
      )
      requestAnimationFrame(drawPreview)
    }

    drawPreview()
  }, [layer])


  return <canvas ref={previewRef} width={60} height={60} />
}

export default LayerPreview;