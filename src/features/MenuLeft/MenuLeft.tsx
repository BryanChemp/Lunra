import type { FC } from "react";
import styled from "styled-components";
import Toolsbar from "../Toolsbar/Toolsbar";

export const MenuLeft: FC = () => {
    return (
        <Container>
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
    width: 140px;
    height: 100%;
    background-color: ${({ theme }) => theme.neutral.surfaceAlt};
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: width 0.3s ease;
    background-color: #2d2d2d;
    padding: 8px;
`;

const ContainerWrapper = styled.div`
    width: 100%;
`;