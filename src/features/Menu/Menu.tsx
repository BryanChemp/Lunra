import type { FC } from "react";
import styled from "styled-components";
import Logo from "./components/Logo";

export const Menu: FC = () => {
    return (
        <Container>
            <LogoWrapper>
                <Logo />
            </LogoWrapper>
        </Container>
    )
}

export default Menu;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    background-color: ${({ theme }) => theme.neutral.surfaceAlt};
    padding: 1rem;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: width 0.3s ease;
`;

const LogoWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;