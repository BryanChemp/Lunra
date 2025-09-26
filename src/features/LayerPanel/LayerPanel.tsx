import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { FC } from "react"
import { useState } from "react"
import styled from "styled-components"

interface Layer {
  id: string
  name: string
  visible: boolean
}

const LayerPanel: FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", name: "Camada 1", visible: true },
    { id: "2", name: "Camada 2", visible: true },
    { id: "3", name: "Camada 3", visible: true },
  ])
  const [selectedLayer, setSelectedLayer] = useState<string>("1")

  const toggleVisibility = (id: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    )
  }

  return (
    <Container>
      {layers.map(layer => (
        <LayerItem
          key={layer.id}
          $selected={layer.id === selectedLayer}
          onClick={() => setSelectedLayer(layer.id)}
        >
            <VisibilityButton
                $selected={layer.id === selectedLayer}
                onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id) }}
            >
            <FontAwesomeIcon icon={layer.visible ? faEye : faEyeSlash}/>
          </VisibilityButton>
          {layer.name}
        </LayerItem>
      ))}
    </Container>
  )
}

export default LayerPanel

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 260px;
  background: #252525;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-family: sans-serif;
`

const LayerItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  color: ${({ $selected }) => $selected ? "#ffffff" : "#cccccc"};
  background: ${({ $selected }) => ($selected ? "#444" : "transparent")};
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #333;
  }
`

const VisibilityButton = styled.button<{ $selected: boolean }>`
  background: none;
  border: none;
  color: ${({ $selected }) => $selected ? "#ffffff" : "#cccccc"};
  cursor: pointer;
  font-size: 14px;
`

const PreviewCanvas = styled.div`
    width: 100%;
`;