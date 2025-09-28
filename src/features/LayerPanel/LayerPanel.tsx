import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import LayerPreview from "./components/LayerPreview"

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
          <PreviewBox>
            <LayerPreview layerId={layer.id} />
          </PreviewBox>

          <LayerName>{layer.name}</LayerName>

          <VisibilityButton
            $selected={layer.id === selectedLayer}
            onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id) }}
          >
            <FontAwesomeIcon icon={layer.visible ? faEye : faEyeSlash}/>
          </VisibilityButton>
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
  justify-content: space-between;
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

const PreviewBox = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid #666;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
`

const LayerName = styled.div`
  flex: 1;
  font-size: 14px;
`

const VisibilityButton = styled.button<{ $selected: boolean }>`
  background: none;
  border: none;
  color: ${({ $selected }) => $selected ? "#ffffff" : "#cccccc"};
  cursor: pointer;
  font-size: 14px;
`
