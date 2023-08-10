import { FC, ReactNode } from "react";

export const SwitchWrap: FC<{
    $height: number;
    $isLoading: boolean;
    children: ReactNode;
}> = ({ $height, $isLoading, children }) => (
    <div
        className={`m-0 flex p-0 h-${$height} items-center ${
            $isLoading ? "bg-transparent" : "bg-backgroundVariant800"
        } border-btnRingVariant500 border-b border-solid`}
    >
        {children}
    </div>
);
