import { useState, FC, ReactNode } from "react";
import { Carousel } from "./Carousel";
import { Modal } from "../modal/modal";

export interface LightboxProps {
    speed?: number;
    children: ReactNode;
}

const triggerId = "open-carousel-modal"; // TODO: id's should be unique. Maybe use a regeistry if they become  much

export const Lightbox: FC<LightboxProps> = ({ speed, children }) => {
    const [index, setIndex] = useState(0);

    return (
        <>
            <Carousel
                triggerId={triggerId}
                showPointers
                speed={speed}
                onItemClick={(currentIndex) => {
                    setIndex(currentIndex);
                }}
            >
                {children}
            </Carousel>

            <Modal triggerId={triggerId}>
                <Carousel speed={0} showPointers={false} startIndex={index}>
                    {children}
                </Carousel>
            </Modal>
        </>
    );
};
