import { FC, useState, useRef } from "react";
import styled from "styled-components";
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas";
import MenuAbsolute from "../MenuAbsolute/MenuAbsolute";

const Canvas: FC = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [isSpace, setIsSpace] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(true);
  };
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.code === "Space") setIsSpace(false);
  };

  const startDrag = (e: React.MouseEvent) => {
    if (!isSpace) return;
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  };
  const stopDrag = () => setDragging(false);

  const onDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale(s => {
      const next = s * factor;
      return Math.min(Math.max(next, 0.1), 5);
    });
  };

  return (
    <Container
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={onDrag}
      onWheel={onWheel}
    >
      <MenuAbsolute />
      <CanvasWrapper
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center"
        }}
      >
        <DrawingCanvas
          width={4000}
          height={3000}
          scale={scale}
          offset={offset}
          isPanning={isSpace && dragging}
          isSpace={isSpace}
        />
      </CanvasWrapper>
    </Container>
  );
};

export default Canvas;

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative; 
  outline: none;
  background-color: ${({ theme }) => theme.neutral.surface }; 
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffffff;
`;
