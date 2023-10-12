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
import {
    StyledAudioPlayer,
    StyledNoAudio,
    StyledProgressBar,
} from "./PodcastModule.style";

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
}> = ({ isAudioPlaying, togglePlayPause }) => {
    const buttonClass = isAudioPlaying ? "pause" : "play";
    const buttonTitle = isAudioPlaying ? "pause" : "play";
    const buttonIcon = isAudioPlaying ? <PauseSVG /> : <PlaySVG />;

    const onPlayPauseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePlayPause();
    };

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

    const parseProgressTime = (count: number) =>
        `${Math.floor(count / 60).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}:${Math.floor(count % 60).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}`;

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
        return <StyledNoAudio>Something went wrong.</StyledNoAudio>;
    }

    return (
        <div ref={audioPlayerRef} style={{ width: "100%" }}>
            <StyledAudioPlayer onClick={setPlaybackPosition}>
                <StyledProgressBar
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setPlaybackPosition(e);
                    }}
                    $width={percentComplete}
                />
                <div className="info">
                    <img
                        src={podcast?.sourceIcon}
                        className="img"
                        alt={podcast?.sourceName}
                    />
                    <div className="details">
                        <span className="title one-liner">
                            {podcast?.title}
                        </span>
                        <span className="time">
                            {isAudioLoading
                                ? "Buffering..."
                                : `${parseProgressTime(
                                      position
                                  )} / ${parseProgressTime(duration)}`}
                        </span>
                    </div>
                </div>
                <div className="controls">
                    <span
                        className="speed"
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
                    />
                    {!isAudioReady && (
                        <div className="buffer">
                            <div className="line">
                                <div className="bar" />
                            </div>
                        </div>
                    )}
                </div>
            </StyledAudioPlayer>
        </div>
    );
};

export default AudioPlayer;
