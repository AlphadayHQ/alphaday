import { FC, ReactNode, forwardRef } from "react";
import { ReactComponent as TrashSVG } from "src/assets/svg/trash.svg";
import { twMerge } from "tailwind-merge";
import { Button } from "../buttons/Button";

interface IBaseModuleWrapper {
    children?: ReactNode;
    className?: string;
    height?: number;
    showSettings: boolean | undefined;
}
export const BaseModuleWrapper = forwardRef<
    HTMLDivElement | null,
    IBaseModuleWrapper
>(({ children, className, showSettings, height }, ref) => {
    const style = height ? { height } : {};
    return (
        <div
            ref={ref}
            className={twMerge(
                "border-background bg-backgroundVariant200 text-primary relative flex flex-col overflow-hidden rounded-[5px] border-2 border-solid shadow-[0px_0px_0px_1px_rgba(121,131,162,0.2)] transition-transform duration-[0.8s] [backface-visibility:hidden]",
                className,
                showSettings &&
                    "absolute top-0 origin-top [transform:rotateX(180deg)]"
            )}
            style={style}
        >
            {children}
        </div>
    );
});

export const BaseModuleBody: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="p-0rch flex h-[inherit] min-h-[1px] flex-auto flex-col justify-between overflow-hidden">
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
                "border-b-background bg-backgroundVariant300 text-primaryVariant100 rounded-[3px] border-b-[1.2px] border-solid py-[4.5px] pl-[15px] pr-[9px] bg-blend-soft-light",
                className
            )}
        >
            {children}
        </div>
    );
});

export const BaseModuleOptionsFooter = forwardRef<
    HTMLDivElement | null,
    { removeWidget: () => void }
>(({ removeWidget }, ref) => {
    return (
        <div ref={ref}>
            <div className="text-primaryVariant100 border-t-btnRingVariant500 flex w-full justify-center self-end border-t-[0.8px] border-solid">
                <Button
                    variant="small"
                    onClick={removeWidget}
                    title="Removes this widget from the current board"
                >
                    <TrashSVG className="w-[15px] fill-[inherit]" /> &nbsp;
                    Remove Widget
                </Button>
            </div>
        </div>
    );
});
