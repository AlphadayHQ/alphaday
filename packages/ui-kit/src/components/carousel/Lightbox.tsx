import { useState, FC, ReactNode } from "react";
import { Modal } from "../modal/Modal";
import { Carousel } from "./Carousel";

export interface LightboxProps {
    speed?: number;
    children: ReactNode;
}

const triggerId = "open-carousel-modal"; // TODO (xavier-charles):: id's should be unique. Maybe use a regeistry if they become  much

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

            <Modal>
                <Carousel speed={0} showPointers={false} startIndex={index}>
                    {children}
                </Carousel>
            </Modal>
        </>
    );
};
