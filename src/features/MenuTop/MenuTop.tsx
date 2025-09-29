import type { FC } from "react";
import styled from "styled-components";
import BrushControllerPanel from "../BrushControllerPanel/BrushControllerPanel";

const MenuTop: FC = () => {
    return (
        <Container>
            <div></div>
            <BrushControllerPanel/>
        </Container>
    )
}

export default MenuTop;

const Container = styled.div`
    width: 100%;
    padding: 8px; 
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0px;
    z-index: 1000; 
    background-color: ${({ theme }) => theme.neutral.surfaceDark}
`;