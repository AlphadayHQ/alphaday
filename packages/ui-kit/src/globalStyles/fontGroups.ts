import { tv, VariantProps } from "tailwind-variants";

export const fontUtilities = {
    ".fontGroup-major": {
        fontSize: "1.5rem",
        fontWeight: "600",
        lineHeight: "1",
        letterSpacing: "0px",
    },
    ".fontGroup-highlight": {
        fontSize: "0.75rem",
        fontWeight: "700",
        lineHeight: "1.5",
        letterSpacing: "0.5px",
    },
    ".fontGroup-highlightSemi": {
        fontSize: "0.75rem",
        fontWeight: "600",
        lineHeight: "1.5",
        letterSpacing: "0.5px",
    },
    ".fontGroup-normal": {
        fontSize: "0.75rem",
        fontWeight: "400",
        lineHeight: "1.5",
        letterSpacing: "0.2px",
    },
    ".fontGroup-support": {
        fontSize: "10px",
        fontWeight: "400",
        lineHeight: "1.5",
        letterSpacing: "0.2px",
        textTransform: "uppercase",
    },
    ".fontGroup-supportBold": {
        fontSize: "10px",
        fontWeight: "600",
        lineHeight: "1.5",
        letterSpacing: "0.2px",
    },
    ".fontGroup-mini": {
        fontSize: "10px",
        fontWeight: "400",
        lineHeight: "1.5",
        letterSpacing: "0.2px",
        textTransform: "none",
    },
};

export const fontVariants = tv({
    variants: {
        variant: {
            major: "text-2xl font-semibold leading-none tracking-[0px]",
            highlight: "text-xs font-bold leading-normal tracking-[0.5px]",
            highlightSemi:
                "text-xs font-semibold leading-normal tracking-[0.5px]",
            normal: "text-xs font-normal leading-normal tracking-[0.2px]",
            support:
                "text-[10px] font-normal leading-normal tracking-[0.2px] uppercase",
            supportBold:
                "text-[10px] font-semibold leading-normal tracking-[0.2px]",
            mini: "text-[10px] font-normal leading-normal tracking-[0.2px] normal-case",
        },
    },
    defaultVariants: {
        variant: "normal",
        uppercase: false,
        disabled: false,
    },
});

export type TFontVariants = VariantProps<typeof fontVariants>;
