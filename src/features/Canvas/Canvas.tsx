import { useRef, useEffect, type FC } from "react"
import styled from "styled-components"
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas"
import MenuAbsolute from "../MenuAbsolute/MenuAbsolute"
import { useCanvasStore } from "../../stores/useCanvasStore"

const Canvas: FC = () => {
  const { offset, scale, dragging, isSpace, setDragging, setIsSpace, moveOffset, zoomAt } = useCanvasStore()

  const lastPos = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomAt(e.clientX - el.getBoundingClientRect().left, e.clientY - el.getBoundingClientRect().top, e.deltaY, el.getBoundingClientRect())
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [zoomAt])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(true)
  }
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(false)
  }

  const startDrag = (e: React.MouseEvent) => {
    if (!isSpace) return
    setDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }

  const stopDrag = () => setDragging(false)

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    moveOffset(dx, dy)
  }

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
      <MenuAbsolute />
      <CanvasWrapper
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <DrawingCanvas
          width={1270}
          height={720}
        />
        
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
`
