import { FC } from "react";
import { ReactComponent as CheckedSVG } from "src/assets/svg/checkmark.svg";
import { ReactComponent as RedCrossSVG } from "src/assets/svg/red-x.svg";
import { Spinner } from "../../spinner/Spinner";

export enum EIndicatorState {
    error,
    loading,
    synced,
}

interface IProps {
    state: EIndicatorState;
}

const SyncIndicator: FC<IProps> = ({ state }: IProps) => {
    switch (state) {
        case EIndicatorState.error:
            return (
                <RedCrossSVG
                    className="fill-secondaryOrangeSoda"
                    title="Error retrieving server data"
                />
            );
        case EIndicatorState.loading:
            return <Spinner size="xs" />;
        case EIndicatorState.synced:
            return <CheckedSVG title="Your boards are up-to-date" />;
        default:
            return <CheckedSVG title="Your boards are up-to-date" />;
    }
};

export default SyncIndicator;
