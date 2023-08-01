import { FC } from "react";
import { StyledModal } from "./AlphaModal.style";

// TODO: this probably needs the parent props and more subcomponents
// (title, footer, etc). See AlphaErrorModal.

interface IModal {
    show: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    contain?: boolean;
}
export const AlphaModal: FC<IModal> = ({ children, contain, ...restProps }) => {
    return (
        <StyledModal $contain={contain} {...restProps}>
            {children}
        </StyledModal>
    );
};
