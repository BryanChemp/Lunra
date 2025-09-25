import type { FC } from "react";
import styled from "styled-components"
import Logo from "./components/Logo";

const MenuAbsolute: FC = () => {
    return (
        <Container>
            <Logo />
        </Container>
    )
}

export default MenuAbsolute;

const Container = styled.div`
    position: absolute;
    margin: 8px;
`;

