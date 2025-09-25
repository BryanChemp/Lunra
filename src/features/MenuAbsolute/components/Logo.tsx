import type { FC } from "react";
import styled from "styled-components";

const Logo: FC = () => {
    return (
        <Container>
            <Image />
            <Texto>
                Lunra
            </Texto>
        </Container>
    )
}

export default Logo;

const Container = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    background-color: ${({ theme }) => theme.neutral.surfaceAlt};
    padding: 8px 16px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(87, 99, 255, 0.15);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(87, 99, 255, 0.25);
    }
`;

const Image = styled.img.attrs(({ theme }) => ({
    src: theme.brand.logo,
    alt: 'Logo',
}))`
    width: 1rem;
    height: 1rem;
    object-fit: contain;
`;

const Texto = styled.span`
    font-family: "Exo 2", sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    line-height: 1;
    background: ${({ theme }) => theme.brand.gradientText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;
