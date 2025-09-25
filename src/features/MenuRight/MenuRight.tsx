import type { FC } from "react";
import styled from "styled-components";

export const MenuRight: FC = () => {
    return (
        <Container>
        </Container>
    )
}

export default MenuRight;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0.2;
    height: 100%;
    background-color: ${({ theme }) => theme.neutral.surfaceAlt};
    padding: 1rem;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    transition: width 0.3s ease;
`;