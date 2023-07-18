import { useState, FC, ReactNode } from "react";
import { AlphaCarousel } from "./AlphaCarousel";
import { Modal } from "../modal/modal";

export interface AlphaLightboxProps {
    speed?: number;
    children: ReactNode;
}


export const AlphaLightbox: FC<AlphaLightboxProps> = ({ speed, children }) => {
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(0);
    return (
        <>
            {!show && (
                <AlphaCarousel
                    showPointers
                    speed={speed}
                    onItemClick={(currentIndex) => {
                        setShow(true);
                        setIndex(currentIndex);
                    }}
                >
                    {children}
                </AlphaCarousel>
            )}
            <Modal show={show} onClose={() => setShow(false)}>
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
