import { type FC, useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHand,
  faObjectGroup,
  faFillDrip,
  faEraser,
  faPaintBrush,
  type IconDefinition
} from "@fortawesome/free-solid-svg-icons"
import { useDrawingStore, type Tool } from "../../stores/useDrawingStore"

interface ToolItem {
  icon: IconDefinition
  label: string
  shortcut: string
  name: Tool
}

const mockTools: ToolItem[] = [
  { icon: faHand, label: "Mover", shortcut: "H", name: "hand" },
  { icon: faObjectGroup, label: "Seleção", shortcut: "M", name: "select" },
  { icon: faFillDrip, label: "Preencher", shortcut: "G", name: "fill" },
  { icon: faEraser, label: "Borracha", shortcut: "E", name: "eraser" },
  { icon: faPaintBrush, label: "Pincel", shortcut: "B", name: "brush" }
]

const Toolsbar: FC = () => {
  const { tool, setTool } = useDrawingStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code === "Space" ? "Space" : e.key.toUpperCase()
      const found = mockTools.find(t => t.shortcut.toUpperCase() === key)
      if (found) {
        e.preventDefault()
        setTool(found.name)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setTool])

  return (
    <Container>
      {mockTools.map(t => (
        <ToolButton
          key={t.name}
          onClick={() => setTool(t.name)}
          $isSelected={tool === t.name}
        >
          <IconWrapper>
            <FontAwesomeIcon icon={t.icon} />
          </IconWrapper>
          <ShortcutLabel>{t.shortcut}</ShortcutLabel>
        </ToolButton>
      ))}
      {mockTools.length % 2 !== 0 && <div style={{ width: 40 }} />}
    </Container>
  )
}

export default Toolsbar

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  padding: 4px;
  gap: 8px;
  background-color: #252525;
  border-radius: 8px;
  flex-wrap: wrap;
  justify-content: center;
`

const ToolButton = styled.button<{ $isSelected: boolean }>`
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
