import type { FC } from "react";
import styled from "styled-components";
import DrawingCanvas from "../DrawingCanvas/DrawingCanvas";

const Canvas: FC = () => {
    return (
        <Container>
            <DrawingCanvas/>
        </Container>
    )
}

export default Canvas;

const Container = styled.div`
    display: flex;
    flex: 4;
`;