import { FC, ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as TrashSVG } from "../../assets/svg/trash.svg";
import { Button } from "../buttons/Button";

interface IBaseModuleWrapper {
    children?: ReactNode;
    className?: string;
    height?: number;
}
export const BaseModuleWrapper = forwardRef<
    HTMLDivElement | null,
    IBaseModuleWrapper
>(({ children, className, height }, ref) => {
    const style = height ? { height } : {};
    return (
        <div
            ref={ref}
            className={twMerge("origin-center w-full", className)}
            style={style}
        >
            <div className="w-full h-full border-borderLine bg-background text-primary flex flex-col overflow-hidden rounded-[5px] border border-solid">
                {children}
            </div>
        </div>
    );
});

export const BaseModuleBody: FC<{
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}> = ({ children, className, style }) => {
    return (
        <div
            className={twMerge(
                "p-0 flex h-[inherit] max-h-[calc(100%_-_40px)] min-h-[1px] flex-auto flex-col justify-between overflow-hidden",
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
};

export const BaseModuleHeader = forwardRef<
    HTMLDivElement | null,
    { children?: ReactNode; className?: string }
>(({ children, className }, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge(
                "border-b-background bg-background text-primaryVariant100 rounded-[3px] border-b-[1.2px] border-solid py-[4.5px] pl-3 pr-[3px] bg-blend-soft-light",
                className
            )}
        >
            {children}
        </div>
    );
});

export const BaseModuleOptionsFooter = forwardRef<
    HTMLDivElement | null,
    { text: string; removeWidget: () => void }
>(({ removeWidget, text }, ref) => {
    return (
        <div ref={ref}>
            <div className="py-2 text-primaryVariant100 border-t-borderLine flex w-full justify-center self-end border-t-[0.8px] border-solid">
                <Button
                    variant="small"
                    onClick={removeWidget}
                    title="Removes this widget from the current board"
                    className="hover:border-borderLine focus:border-borderLine border-borderLine"
                >
                    <TrashSVG className="w-4 fill-[inherit]" /> &nbsp; R {text}
                </Button>
            </div>
        </div>
    );
});
