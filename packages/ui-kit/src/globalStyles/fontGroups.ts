import { tv, VariantProps } from "tailwind-variants";

export const fontVariants = tv({
  variants: {
    variant: {
      major: "text-2xl font-semibold leading-none tracking-[0px]",
      highlight: "text-xs font-bold leading-normal tracking-[0.5px]",
      highlightSemi: "text-xs font-semibold leading-normal tracking-[0.5px]",
      normal: "text-xs font-normal leading-normal tracking-[0.2px]",
      support: "text-[10px] font-normal leading-normal tracking-[0.2px] uppercase",
      supportBold: "text-[10px] font-semibold leading-normal tracking-[0.2px]",
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