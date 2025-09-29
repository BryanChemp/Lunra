import type { FC, WheelEvent } from "react";
import styled from "styled-components";
import { useDrawingStore } from "../../stores/useDrawingStore";


const BrushControllerPanel: FC = () => {
  const brush = useDrawingStore((state) => state.brush);
  const setBrush = useDrawingStore((state) => state.setBrush);

  const handleWheel =
    (
      setter: (val: number) => void,
      step: number,
      min: number,
      max: number
    ) =>
    (e: WheelEvent<HTMLInputElement>) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? step : -step;
      setter((prev) => Math.min(Math.max(prev + delta, min), max));
    };

  return (
    <Container>
      <Field>
        <Label>Tamanho</Label>
        <Input
          type="number"
          value={brush.size}
          min={1}
          max={100}
          onChange={(e) =>
            setBrush({ size: Number(e.target.value) })
          }
          onWheel={handleWheel((val) => setBrush({ size: val }), 1, 1, 100)}
        />
      </Field>
      <Field>
        <Label>Opacidade</Label>
        <Input
          type="number"
          value={brush.opacity ?? 1}
          step={0.1}
          min={0.1}
          max={1}
          onChange={(e) =>
            setBrush({ opacity: Number(e.target.value) })
          }
          onWheel={handleWheel(
            (val) => setBrush({ opacity: val }),
            0.1,
            0.1,
            1
          )}
        />
      </Field>
    </Container>
  );
};

export default BrushControllerPanel;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background-color: #2d2d2d;
  color: white;
  border-bottom: 1px solid #404040;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #3a3a3a;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #4a4a4a;
  transition: all 0.15s ease;

  &:hover {
    background-color: #404040;
    border-color: #555;
  }
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #ccc;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 50px;
  padding: 4px 6px;
  border-radius: 3px;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: white;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #666;
    background-color: #2f2f2f;
    box-shadow: 0 0 0 1px rgba(100, 100, 100, 0.2);
  }

  &:hover {
    border-color: #666;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
