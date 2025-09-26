import { type FC } from "react";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import { useDrawingStore } from "../../../stores/useDrawingStore";

const GradientPanel: FC = () => {
  const { brush, setBrush } = useDrawingStore();

  return (
    <Container>
      <PickerWrapper>
        <HexColorPicker
          color={brush.color}
          onChange={(newColor) => setBrush({ color: newColor })}
        />
      </PickerWrapper>

      <OpacityWrapper>
        <OpacityLabel>Opacidade</OpacityLabel>
        <OpacityRange
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={brush.opacity ?? 1}
          onChange={(e) => setBrush({ opacity: parseFloat(e.target.value) })}
          $color={brush.color}
        />
      </OpacityWrapper>

      <ColorInfo>
        <ColorPreview $color={brush.color} $opacity={brush.opacity ?? 1} />
        <ColorHex>
          {brush.color.toUpperCase()} - {(brush.opacity ?? 1).toFixed(2)}
        </ColorHex>
      </ColorInfo>
    </Container>
  );
};

export default GradientPanel;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const PickerWrapper = styled.div`
    display: flex;
    width: 100%;
    border-radius: 6px;
    justify-content: center;
    align-items: center;
`;

const OpacityWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    padding: 0px 16px;
`;

const OpacityLabel = styled.span`
    font-size: 12px;
    color: #ccc;
    padding: 0px 16px;
`;

const OpacityRange = styled.input<{ $color: string }>`
  width: 100%;
  height: 12px;
  border-radius: 6px;
  appearance: none;
  background: linear-gradient(
    to right,
    rgba(${p => hexToRgb(p.$color)}, 0) 0%,
    rgba(${p => hexToRgb(p.$color)}, 1) 100%
  );
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #555;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #555;
    cursor: pointer;
  }
`;

const ColorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorPreview = styled.div<{ $color: string; $opacity: number }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 2px solid #555;
  background: ${p => p.$color};
  opacity: ${p => p.$opacity};
`;

const ColorHex = styled.span`
  font-family: monospace;
  font-size: 14px;
  color: #fff;
`;

// Helpers
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};
