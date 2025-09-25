import styled, { ThemeProvider } from 'styled-components';
import { theme } from './preferences/theme';
import Menu from './features/Menu/Menu';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Menu />
        <div style={{ display: "flex", flex: 4}}></div>
      </Container>
    </ThemeProvider>
  )
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  border: 2px solid #ffffff;
`;