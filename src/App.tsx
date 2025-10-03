import styled, { ThemeProvider } from 'styled-components';
import { theme } from './constants/theme';
import Canvas from './features/Canvas/Canvas';
import MenuLeft from './features/MenuLeft/MenuLeft';
import MenuRight from './features/MenuRight/MenuRight';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <MenuLeft />
        <Canvas/>
        <MenuRight />
      </Container>
    </ThemeProvider>
  )
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex; 
`;