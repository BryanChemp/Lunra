// components/ToolButton.tsx
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { ToolItem } from "../../../types/ToolsTypes"

interface Props {
  tool: ToolItem
  isSelected: boolean
  onSelect: () => void
}

export const ToolButton = ({ tool, isSelected, onSelect }: Props) => (
  <Button onClick={onSelect} $isSelected={isSelected}>
    <IconWrapper>
      <FontAwesomeIcon icon={tool.icon} />
    </IconWrapper>
    <ShortcutLabel>{tool.shortcut}</ShortcutLabel>
  </Button>
)

const Button = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: ${p => (p.$isSelected ? "#4a4a4a" : "transparent")};
  color: ${p => (p.$isSelected ? "#ffffff" : "#cccccc")};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${p => (p.$isSelected ? "#4a4a4a" : "#3a3a3a")};
    color: #ffffff;
  }
  &:active {
    transform: scale(0.95);
  }
`

const IconWrapper = styled.div`
  font-size: 16px;
  margin-bottom: 4px;
`

const ShortcutLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  opacity: 0.8;
`