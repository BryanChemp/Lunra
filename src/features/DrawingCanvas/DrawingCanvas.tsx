import { useRef, type FC, useLayoutEffect, useState, useCallback } from "react"
import { useDrawingStore } from "../../stores/useDrawingStore"
import { useCanvasStore } from "../../stores/useCanvasStore"
import { useLayerStore } from "../../stores/useLayerStore"
import { useKeyboardKeyListener } from "../../hooks/useKeyboardKeyListener"
import { DefaultShortcutKeymap } from "../../constants/keymap"
import { useStateStack } from "./hooks/useStateStack"
import { useFloodFill } from "./hooks/useFloodFill"
import { useBrushDrawing } from "./hooks/useBrushDrawing"
import { useDrawingSetup } from "./hooks/useDrawingSetup"
import { hexToRgbaArray } from "../../utils/colorsUtils"
import type { PressureSettings } from "../../types/CanvasTypes"

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

  const [pressureSettings, setPressureSettings] = useState<PressureSettings>({
    enablePressure: true,
    minPressure: 0.3,
    maxPressure: 1.0,
    pressureSensitivity: 0.7,
    taperStart: false,
    taperEnd: true,
    velocityInfluence: 0.4
  })

  const [forceStrongPressure, setForceStrongPressure] = useState(false)
  const [disablePressure, setDisablePressure] = useState(false)

  const { undo, redo, saveState } = useStateStack(canvasRef)
  const { getPixelColor, floodFillScanline } = useFloodFill()
  
  const { lastPosRef, drawStroke, resetStroke, getStrokeDebugInfo } = useBrushDrawing(
    canvasRef, 
    brush, 
    scale, 
    tool === "eraser",
    pressureSettings,
    forceStrongPressure,
    disablePressure
  )

  useKeyboardKeyListener({
    [DefaultShortcutKeymap.UNDO]: undo,
    [DefaultShortcutKeymap.REDO]: redo,
    [DefaultShortcutKeymap.SAVE]: () => {},
    "Control+y": redo,
    "Meta+z": redo,
    
    "Shift": () => {
      console.log("Shift pressionado - Pressão forte ativada");
      setForceStrongPressure(true);
    },
    "Control": () => {
      console.log("Ctrl pressionado - Pressão desativada");
      setDisablePressure(true);
    },
    "Alt": () => {
      console.log("Alt pressionado - Modo suave ativado");
      setPressureSettings(prev => ({
        ...prev,
        minPressure: 0.2,
        maxPressure: 0.7,
        sensitivity: 0.3
      }));
    },
    "Control+Shift": () => {
      console.log("Ctrl+Shift - Pressão máxima constante");
      setPressureSettings(prev => ({
        ...prev,
        minPressure: 1.0,
        maxPressure: 1.0,
        enablePressure: true
      }));
    },
    "Control+Alt": () => {
      console.log("Ctrl+Alt - Reset configurações de pressão");
      setPressureSettings({
        enablePressure: true,
        minPressure: 0.3,
        maxPressure: 1.0,
        pressureSensitivity: 0.7,
        taperStart: false,
        taperEnd: true,
        velocityInfluence: 0.4
      });
    }
  })

  useKeyboardKeyListener({
    "Shift": () => {
      console.log("Shift solto - Pressão forte desativada");
      setForceStrongPressure(false);
    },
    "Control": () => {
      console.log("Ctrl solto - Pressão reativada");
      setDisablePressure(false);
    },
    "Alt": () => {
      console.log("Alt solto - Configurações normais");
      setPressureSettings(prev => ({
        ...prev,
        minPressure: 0.3,
        maxPressure: 1.0,
        sensitivity: 0.7
      }));
    }
  }, "keyup")

  const handMode = tool === "hand"
  const fillMode = tool === "fill"
  const isPanning = (isSpace || handMode) && dragging

  useLayoutEffect(() => {
    if (!layer) return
    if (!layer.canvasRef) {
      updateLayerCanvasRef(layer.id, canvasRef)
    }
  }, [layer, canvasRef, updateLayerCanvasRef])

  useDrawingSetup(canvasRef, width, height, layer?.zIndex == 0)

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
      const fillColor = hexToRgbaArray(brush.color, brush.opacity ?? 1);
      if (!targetColor.every((v, i) => v === fillColor[i])) {
        floodFillScanline(imageData, Math.floor(x), Math.floor(y), targetColor, fillColor);
        ctx.putImageData(imageData, 0, 0);
      }
      return
    }

    isDrawingRef.current = true
    const p = getLocalCanvasPoint(e)
    lastPosRef.current = { x: p.x, y: p.y }
    
    console.log("Iniciando stroke com pressão simulada", {
      forceStrongPressure,
      disablePressure,
      pressureSettings
    });
  }

  const stopDrawing = () => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    lastPosRef.current = null
    resetStroke()
    
    // Debug opcional
    const debugInfo = getStrokeDebugInfo();
    if (debugInfo) {
      console.log("Stroke finalizado:", debugInfo);
    }
    
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