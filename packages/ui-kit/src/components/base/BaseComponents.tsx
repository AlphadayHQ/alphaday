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
            className={twMerge(
                "absolute top-0 origin-center w-full h-full",
                className
            )}
            style={style}
        >
            <div className="w-full h-full border-background bg-backgroundVariant200 text-primary flex flex-col overflow-hidden rounded-[5px] border-2 border-solid shadow-[0px_0px_0px_1px_rgba(121,131,162,0.2)]">
                {children}
            </div>
        </div>
    );
});

export const BaseModuleBody: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="p-0rch flex h-[inherit] max-h-[500px] min-h-[1px] flex-auto flex-col justify-between overflow-hidden">
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
            <div className="py-2 text-primaryVariant100 border-t-btnRingVariant500 flex w-full justify-center self-end border-t-[0.8px] border-solid">
                <Button
                    variant="small"
                    onClick={removeWidget}
                    title="Removes this widget from the current board"
                    className="hover:border-btnRingVariant500 focus:border-btnRingVariant500 border-btnRingVariant500"
                >
                    <TrashSVG className="w-[15px] fill-[inherit]" /> &nbsp;
                    Remove Widget
                </Button>
            </div>
        </div>
    );
});
