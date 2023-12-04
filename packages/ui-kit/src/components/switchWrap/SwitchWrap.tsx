import { FC, ReactNode } from "react";

export const SwitchWrap: FC<{
    $height: number;
    $isLoading: boolean;
    children: ReactNode;
}> = ({ $height, $isLoading, children }) => (
    <div
        className={`m-0 flex p-2 h-${$height} items-center ${
            $isLoading ? "bg-transparent" : "bg-background"
        } border-btnRingVariant500 border-b border-solid`}
    >
        {children}
    </div>
);
