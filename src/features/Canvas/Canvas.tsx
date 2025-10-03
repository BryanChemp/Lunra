import { useRef, type FC } from "react"
import styled from "styled-components"
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas"
import { useCanvasStore } from "../../stores/useCanvasStore"
import { useLayerStore } from "../../stores/useLayerStore"
import { useCanvasZoom } from "./hooks/useCanvasZoom"
import { useCanvasShortcuts } from "./hooks/useCanvasShortcuts"
import { useCanvasPan } from "./hooks/useCanvasPan"

const Canvas: FC = () => {
  const { offset, scale } = useCanvasStore()
  const { layers, selectedLayerId } = useLayerStore()

  const containerRef = useRef<HTMLDivElement>(null)

  useCanvasZoom(containerRef)
  const { handleKeyDown, handleKeyUp } = useCanvasShortcuts()
  const { startDrag, stopDrag, onDrag } = useCanvasPan()

  return (
    <Container
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={onDrag}
    >
      <CanvasWrapper
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        {layers.map(layer => (
          <DrawingCanvas
            key={layer.id}
            width={2400}
            height={1270}
            layerId={layer.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: layer.zIndex,
              pointerEvents: layer.id === selectedLayerId ? "auto" : "none",
            }}
          />
        ))}
      </CanvasWrapper>
    </Container>
  )
}

export default Canvas

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  outline: none;
  background-color: ${({ theme }) => theme.neutral.surface};
`

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffffff;
  width: 1270px;
  height: 720px;
`
