import type { FC } from "react";
import styled from "styled-components";
import Toolsbar from "../Toolsbar/Toolsbar";
import Logo from "./components/Logo";

export const MenuLeft: FC = () => {
    return (
        <Container>
            <Logo />
            <ContainerWrapper>
                <Toolsbar />
            </ContainerWrapper>
        </Container>
    )
}

export default MenuLeft;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 58px;
    height: 100%;
    background-color: ${({ theme }) => theme.neutral.surfaceDark};
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: width 0.3s ease;
    padding: 8px;
    gap: 16px;
`;

const ContainerWrapper = styled.div`
    width: 100%;
`;