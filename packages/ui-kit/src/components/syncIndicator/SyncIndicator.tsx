import { FC } from "react";
import CheckedSVG from "src/assets/svg/checkmark.svg?react";
import RedCrossSVG from "src/assets/svg/red-x.svg?react";
import { Spinner } from "../spinner/Spinner";

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
                <div
                    className="w-full h-8 flex items-center justify-center"
                    title="Error retrieving server data"
                >
                    <RedCrossSVG
                        className="fill-secondaryOrangeSoda"
                        title="Error retrieving server data"
                    />
                </div>
            );
        case EIndicatorState.loading:
            return (
                <div
                    className="w-full h-8 flex items-center justify-center"
                    title="Loading..."
                >
                    <Spinner size="xs" />
                </div>
            );
        case EIndicatorState.synced:
            return (
                <div
                    className="w-full h-8 flex items-center justify-center"
                    title="Your boards are up-to-date"
                >
                    <CheckedSVG />
                </div>
            );
        default:
            return (
                <div
                    className="w-full h-8 flex items-center justify-center"
                    title="Your boards are up-to-date"
                >
                    <CheckedSVG />
                </div>
            );
    }
};

export default SyncIndicator;
