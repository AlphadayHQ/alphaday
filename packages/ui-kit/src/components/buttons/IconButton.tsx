/* eslint-disable react/button-has-type */
import { FC } from "react";
import { ReactComponent as BellSVG } from "src/assets/svg/bell.svg";
import { ReactComponent as ArrowDown } from "src/assets/svg/chevron-down.svg";
import { ReactComponent as ArrowLeft } from "src/assets/svg/chevron-left.svg";
import { ReactComponent as ArrowRight } from "src/assets/svg/chevron-right.svg";
import { ReactComponent as CloseSVG } from "src/assets/svg/close.svg";
import { ReactComponent as Close2SVG } from "src/assets/svg/close2.svg";
import { ReactComponent as InfoSVG } from "src/assets/svg/info.svg";
import { ReactComponent as StarSVG } from "src/assets/svg/star.svg";
import { ReactComponent as StarFilledSVG } from "src/assets/svg/starFilled.svg";
import { ReactComponent as TrashSVG } from "src/assets/svg/trash.svg";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";
import { tv, VariantProps } from "tailwind-variants";
import styles from "./Button.module.scss";

const buttonVariants = tv({
    base: `${styles.IconButton} inline-flex items-center justify-center tracking-[0.2px] text-center align-middle cursor-pointer leading-normal select-none p-0 border-0`,
    variants: {
        variant: {
            info: styles.info,
            close: styles.close,
            closeWithBg: styles.closeWithBg,
            notification: styles.notification,
            profile: styles.profile,
            trash: styles.trash,
            star: styles.star,
            leftArrow: styles.leftArrow,
            rightArrow: styles.rightArrow,
            downArrow: styles.downArrow,
        },
        disabled: {
            true: styles.disabled,
        },
    },
    defaultVariants: {
        variant: "info",
        disabled: false,
    },
});

type TButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends TButtonVariants {
    disabled?: boolean;
    label?: string;
    title?: string;
    children?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void | (() => Promise<void>);
    onMouseOver?: () => void | (() => Promise<void>);
    onMouseLeave?: () => void | (() => Promise<void>);
}

/**
 *
 * variant info button should not be disabled. No style set for it
 * variant star/favorite should be exported with AlphaIconStarButton
 */

const iconSelector = (
    variant: TButtonVariants["variant"],
    selected: boolean | undefined
) => {
    switch (variant) {
        case "info":
            return <InfoSVG />;
        case "close":
            return <CloseSVG />;
        case "closeWithBg":
            return <Close2SVG />;
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
        case "star":
            return selected ? <StarFilledSVG /> : <StarSVG />;
        default:
            break;
    }
    return null;
};

export const IconButton: FC<ButtonProps> = ({
    variant,
    disabled,
    label,
    children,
    selected,
    ...restProps
}) => {
    return (
        <button
            disabled={disabled}
            aria-label={label}
            className={buttonVariants({ variant, disabled })}
            {...restProps}
        >
            {iconSelector(variant, selected)}
            {children}
        </button>
    );
};
