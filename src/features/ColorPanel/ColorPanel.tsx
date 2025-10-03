import { type FC } from "react"
import styled from "styled-components"
import GradientPanel from "./components/GradientPanel"

const ColorPanel: FC = () => {
  return (
    <Container>
      <GradientPanel/>
    </Container>
  )
}

export default ColorPanel

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  width: 260px;
  background: #252525;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  font-family: sans-serif;
`