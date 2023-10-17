import { FC } from "react";
import UI_CONFIG from "src/config/ui";

const { Z_INDEX_REGISTRY } = UI_CONFIG;

interface IProps {
    hide?: boolean;
    children?: React.ReactNode;
}

const TextOverlay: FC<IProps> = ({ hide, children }) => {
    if (hide) {
        return null;
    }

    return (
        <div
            className="absolute h-[calc(100%-45px)] left-0 transform w-full bg-backgroundVariant1200"
            style={{
                zIndex: Z_INDEX_REGISTRY.OVERLAY,
            }}
        >
            <div className="flex overflow-auto h-full flex-col flex-wrap">
                {children}
            </div>
        </div>
    );
};

export default TextOverlay;
