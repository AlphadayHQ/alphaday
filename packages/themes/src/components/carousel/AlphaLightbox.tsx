import { useState, FC, ReactNode } from "react";
import { AlphaCarousel } from "./AlphaCarousel";
import { Modal } from "../modal/modal";

export interface AlphaLightboxProps {
    speed?: number;
    children: ReactNode;
}

const triggerId = "open-carousel-modal" // TODO: id's should be unique. Maybe use a regeistry if they become  much

export const AlphaLightbox: FC<AlphaLightboxProps> = ({ speed, children }) => {
    const [index, setIndex] = useState(0);

    return (
        <>
            <AlphaCarousel
                triggerId={triggerId}
                showPointers
                speed={speed}
                onItemClick={(currentIndex) => {
                    setIndex(currentIndex);
                }}
            >
                {children}
            </AlphaCarousel>

            <Modal triggerId={triggerId}>
                <AlphaCarousel
                    speed={0}
                    showPointers={false}
                    startIndex={index}
                >
                    {children}
                </AlphaCarousel>
            </Modal>
        </>
    );
};
