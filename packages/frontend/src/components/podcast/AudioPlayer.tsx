import React, {
    FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAudioPosition } from "react-use-audio-player";
import { TPodcastItem } from "src/api/types";
import { ReactComponent as PauseSVG } from "src/assets/icons/pause.svg";
import { ReactComponent as PlaySVG } from "src/assets/icons/play2.svg";

interface IAudioPlayer {
    podcast: TPodcastItem | null;
    isAudioReady: boolean;
    isAudioLoading: boolean;
    isAudioPlaying: boolean;
    togglePlayPause: () => void;
    closePlayer: () => void;
}

const PlayPauseButton: FC<{
    isAudioPlaying: boolean;
    togglePlayPause: () => void;
    isAudioReady: boolean;
}> = ({ isAudioPlaying, togglePlayPause, isAudioReady }) => {
    const buttonClass = isAudioPlaying
        ? "flex items-center justify-center cursor-pointer rounded-full h-9 w-9 bg-secondaryOrange [&>svg]:w-[26.4px]"
        : "flex items-center justify-center cursor-pointer rounded-full h-9 w-9 bg-transparent border-2 border-solid border-btnRingVariant100 [&>svg]:w-[13.2px] [&>svg]:h-[15.24px] [&>svg]:fill-btnRingVariant100";
    const buttonTitle = isAudioPlaying
        ? "flex items-center justify-center cursor-pointer rounded-full h-9 w-9 bg-secondaryOrange [&>svg]:w-[26.4px]"
        : "flex items-center justify-center cursor-pointer rounded-full h-9 w-9 bg-transparent border-2 border-solid border-btnRingVariant100 [&>svg]:w-[13.2px] [&>svg]:h-[15.24px] [&>svg]:fill-btnRingVariant100";
    const buttonIcon = isAudioPlaying ? <PauseSVG /> : <PlaySVG />;

    const onPlayPauseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePlayPause();
    };

    if (!isAudioReady) {
        return (
            <div className="flex flex-col justify-center w-9 h-9 p-[3px] text-center">
                <div className="bg-primary w-full">
                    <div
                        className="float-left w-[10px] h-0.5 rounded-full bg-btnRingVariant100"
                        style={{
                            animation:
                                "bounce 2s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite",
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onPlayPauseClick}
            tabIndex={-1}
            role="button"
            title={buttonTitle}
            className={buttonClass}
        >
            {buttonIcon}
        </div>
    );
};

const parseProgressTime = (count: number) =>
    `${Math.floor(count / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })}:${Math.floor(count % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })}`;

const AudioPlayer: FC<IAudioPlayer> = ({
    isAudioReady,
    isAudioLoading,
    isAudioPlaying,
    togglePlayPause,
    podcast,
    closePlayer,
}) => {
    const audioPlayerRef = useRef<HTMLDivElement | null>(null);
    // Could happen if the link is broken
    const cantPlayAudio = useMemo(
        () => !isAudioReady && !isAudioLoading,
        [isAudioLoading, isAudioReady]
    );

    const { duration, percentComplete, position, seek, speed } =
        useAudioPosition();

    const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

    const togglePlaybackSpeed = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            const allowedSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];
            const currentSpeedIndex = allowedSpeeds.findIndex(
                (val) => val === playbackSpeed
            );
            const nextSpeed =
                // cycle through alowed speeds
                allowedSpeeds[(currentSpeedIndex + 1) % allowedSpeeds.length];

            speed(nextSpeed);
            setPlaybackSpeed(nextSpeed);
        },
        [playbackSpeed, speed]
    );

    const setPlaybackPosition = useCallback(
        (event: React.MouseEvent) => {
            if (!audioPlayerRef.current) return;
            const { x: playerXPos, width: playerWidth } =
                audioPlayerRef.current.getBoundingClientRect();
            const { clientX: eventXPos } = event;
            seek(((eventXPos - playerXPos) / playerWidth) * duration);
        },
        [duration, seek]
    );

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cantPlayAudio) {
            timer = setTimeout(() => {
                closePlayer();
            }, 1000);
        }
        return () => clearTimeout(timer);
    }, [cantPlayAudio, closePlayer]);

    if (speed() !== playbackSpeed) {
        speed(playbackSpeed);
    }

    if (!isAudioReady && !isAudioLoading) {
        return (
            <div className="w-full flex items-center justify-center">
                Something went wrong.
            </div>
        );
    }

    return (
        <div ref={audioPlayerRef} style={{ width: "100%" }}>
            <div
                role="button"
                tabIndex={-1}
                className="w-full flex items-center justify-between"
                onClick={setPlaybackPosition}
            >
                <div
                    role="button"
                    tabIndex={-1}
                    className="h-full absolute bg-backgroundVariant400 rounded-tl-[5px] rounded-bl-[5px]"
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setPlaybackPosition(e);
                    }}
                    style={{ width: `${percentComplete}%` }}
                />
                <div className="z-[1] flex py-1.5 pl-1.5">
                    <img
                        src={podcast?.sourceIcon}
                        className="w-10 h-10"
                        alt={podcast?.sourceName}
                    />
                    <div className="self-start pt-1 flex flex-col pl-[9px] cursor-default">
                        <span className="fontGroup-highlightSemi one-liner">
                            {podcast?.title}
                        </span>
                        <span className="fontGroup-mini">
                            {isAudioLoading
                                ? "Buffering..."
                                : `${parseProgressTime(
                                      position
                                  )} / ${parseProgressTime(duration)}`}
                        </span>
                    </div>
                </div>
                <div className="flex items-center py-2 px-[9px] z-[1]">
                    <span
                        className="fontGroup-highlightSemi text-right pr-4 cursor-pointer"
                        onClick={togglePlaybackSpeed}
                        role="button"
                        tabIndex={-1}
                    >
                        {playbackSpeed.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                        })}
                        x
                    </span>
                    <PlayPauseButton
                        isAudioPlaying={isAudioPlaying}
                        togglePlayPause={togglePlayPause}
                        isAudioReady={isAudioReady}
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
