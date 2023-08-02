/* eslint-disable react/button-has-type */
import { FC } from "react";
import { ReactComponent as ArrowDown } from "../../../assets/icons/chevron-down.svg";
import { ReactComponent as ArrowLeft } from "../../../assets/icons/chevron-left.svg";
import { ReactComponent as ArrowRight } from "../../../assets/icons/chevron-right.svg";
import { ReactComponent as BellSVG } from "../../../assets/icons/bell.svg";
import { ReactComponent as CloseIconSVG } from "../../../assets/icons/closeIcon.svg";
import { ReactComponent as CloseIcon2SVG } from "../../../assets/icons/closeIcon2.svg";
import { ReactComponent as InfoSVG } from "../../../assets/icons/info.svg";
import { ReactComponent as StarSVG } from "../../../assets/icons/star.svg";
import { ReactComponent as StarFilledSVG } from "../../../assets/icons/starFilled.svg";
import { ReactComponent as TrashSVG } from "../../../assets/icons/trash.svg";
import { ReactComponent as UserSVG } from "../../../assets/icons/user.svg";
import { StyledButton, TVariant } from "./AlphaIconButton.style";

export interface ButtonProps {
    variant?: TVariant;
    disabled?: boolean;
    label?: string;
    title?: string;
    children?: React.ReactNode;
    onClick?: () => void | (() => Promise<void>);
    onMouseOver?: () => void | (() => Promise<void>);
    onMouseLeave?: () => void | (() => Promise<void>);
}
interface StarProps extends Omit<ButtonProps, "variant"> {
    selected: boolean;
}

/**
 *
 * variant info button should not be disabled. No style set for it
 * variant star/favorite should be exported with AlphaIconStarButton
 */

const iconSelector = (variant: TVariant) => {
    switch (variant) {
        case "info":
            return <InfoSVG />;
        case "close":
            return <CloseIconSVG />;
        case "closeWithBg":
            return <CloseIcon2SVG />;
        case "notification":
            return <BellSVG />;
        case "profile":
            return <UserSVG />;
        case "trash":
            return <TrashSVG />;
        case "leftArrow":
            return <ArrowLeft />;
        case "rightArrow":
            return <ArrowRight />;
        case "downArrow":
            return <ArrowDown />;
        default:
            break;
    }
    return null;
};

export const AlphaIconButton: FC<ButtonProps> = ({
    variant = "info",
    disabled,
    label,
    children,
    ...restProps
}) => {
    return (
        <StyledButton
            $variant={variant}
            disabled={disabled}
            aria-label={label}
            {...restProps}
        >
            {iconSelector(variant)}
            {children}
        </StyledButton>
    );
};
export const AlphaIconStarButton: FC<StarProps> = ({
    disabled,
    selected,
    label,
    ...restProps
}) => {
    return (
        <StyledButton
            $variant="star"
            disabled={disabled}
            aria-label={label}
            {...restProps}
        >
            {selected ? <StarFilledSVG /> : <StarSVG />}
        </StyledButton>
    );
};

AlphaIconButton.defaultProps = {
    disabled: false,
    label: "button",
};
