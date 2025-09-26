import type { FC } from "react"
import styled from "styled-components"

const Logo: FC = () => {
  return (
    <Container>
      <Image />
    </Container>
  )
}

export default Logo

const Container = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background-color: #252525;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.95);
  }
`

const Image = styled.img.attrs(({ theme }) => ({
  src: theme.brand.logo,
  alt: "Logo"
}))`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
`