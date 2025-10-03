// Toolsbar.tsx
import { type FC } from "react"
import styled from "styled-components"
import { useDrawingStore } from "../../stores/useDrawingStore"
import { ToolButton } from "./components/ToolButton"
import { useToolHotkeys } from "./hooks/useToolsHotkeys"
import { tools } from "../../constants/tools"

const Toolsbar: FC = () => {
  const { tool, setTool } = useDrawingStore()
  useToolHotkeys(tools)

  return (
    <Container>
      {tools.map(t => (
        <ToolButton
          key={t.name}
          tool={t}
          isSelected={tool === t.name}
          onSelect={() => setTool(t.name)}
        />
      ))}
      {tools.length % 2 !== 0 && <div style={{ width: 40 }} />}
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