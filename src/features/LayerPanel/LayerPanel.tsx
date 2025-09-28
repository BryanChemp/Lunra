import { faEye, faEyeSlash, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { FC } from "react"
import styled from "styled-components"
import LayerPreview from "./components/LayerPreview"
import { useLayerStore } from "../../stores/useLayerStore"

const LayerPanel: FC = () => {
  const { layers, selectedLayerId, selectLayer, toggleVisibility, addLayer } = useLayerStore()

  return (
    <Container>
      <AddLayerButton onClick={() => addLayer()}>
        <FontAwesomeIcon icon={faPlus} /> Nova camada
      </AddLayerButton>

      {layers.map((layer, index) => (
        <LayerItem
          key={layer.id}
          $selected={layer.id === selectedLayerId}
          onClick={() => selectLayer(layer.id)}
        >
          <PreviewBox>
            <LayerPreview index={index} layer={layer} />
          </PreviewBox>

          <LayerName>{layer.name}</LayerName>

          <VisibilityButton
            $selected={layer.id === selectedLayerId}
            onClick={(e) => { e.stopPropagation(); toggleVisibility(layer.id) }}
          >
            <FontAwesomeIcon icon={layer.visible ? faEye : faEyeSlash} />
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

const AddLayerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: #18a77a;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #149563;
  }
`

const LayerItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#cccccc")};
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
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#cccccc")};
  cursor: pointer;
  font-size: 14px;
`
