import { FC, HTMLProps } from "react";

interface IProps extends HTMLProps<HTMLDivElement> {
    hide?: boolean;
    children?: React.ReactNode;
}

export const TextOverlay: FC<IProps> = ({ hide, children, ...props }) => {
    if (hide) {
        return null;
    }

    return (
        <div
            className="absolute h-[calc(100%-45px)] left-0 transform w-full bg-background"
            {...props}
        >
            <div className="flex overflow-auto h-full flex-col flex-wrap">
                {children}
            </div>
        </div>
    );
};
