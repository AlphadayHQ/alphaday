import { FC, MouseEventHandler, useState } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { EFeedItemType } from "src/api/types";
import { ReactComponent as BellSVG } from "src/assets/icons/bell.svg";
import { ReactComponent as CloseSVG } from "src/assets/icons/close2.svg";
import { computeDuration } from "src/utils/dateUtils";
import { feedItemIconMap } from "../feed/types";

type TNotification = {
    id: string;
    title: string;
    description: string;
    date: string;
    isRead: boolean;
    contentType: EFeedItemType;
    source: string;
};

interface INotifications {
    notifications: TNotification[] | undefined;
    isAuthenticated: boolean;
    markAsRead: (id: string) => void;
    removeNotification: (id: string) => void;
}

const NoNotifications = () => {
    return (
        <div className="w-full mx-5 flex flex-col justify-center items-center">
            <div className="p-5 rounded-full bg-primaryVariant100 mx-auto flex-wrap">
                <BellSVG className="w-8 h-8 text-background" />
            </div>
            <p className="fontGroup-highlightSemi m-5">No notifications yet</p>
            <p className="fontGroup-normal whitespace-normal break-words max-w-screen-single-col text-center">
                You’ll get notifications on new trending posts, when people
                interact with your comments, and more.
            </p>
        </div>
    );
};

const NotificationItem: FC<
    TNotification & {
        onMarkAsRead: (id: string) => void;
        removeNotification: (id: string) => void;
    }
> = ({
    id,
    title,
    description,
    date,
    isRead,
    contentType,
    source,
    onMarkAsRead,
    removeNotification,
}) => {
    const [showDesc, setShowDesc] = useState(false);

    const handleShowDesc = () => {
        setShowDesc(true);
        onMarkAsRead(id);
    };

    const handleClose: MouseEventHandler<SVGSVGElement> = (e) => {
        e.stopPropagation();
        removeNotification(id);
    };
    return (
        <div
            onClick={handleShowDesc}
            role="button"
            tabIndex={0}
            className={twMerge(
                "flex flex-col w-full p-4 rounded-lg mb-3 cursor-pointer",
                isRead ? "bg-backgroundVariant100" : "bg-backgroundVariant200"
            )}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={feedItemIconMap[contentType]}
                        alt="feed icon"
                        className="w-8 h-8 mr-2"
                    />
                    <div className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                        <p className="text-primaryVariant100 fontGroup-mini leading-[18px] flex flex-wrap whitespace-nowrap">
                            {computeDuration(date)}
                            <span className="mx-1.5 my-0 self-center">•</span>
                            <span>
                                <span className="capitalize">{source}</span>
                            </span>
                        </p>
                    </div>
                </div>
                <CloseSVG
                    onClick={handleClose}
                    className="w-4 h-4 text-primary"
                />
            </div>
            <div className="flex justify-between">
                <p className="fontGroup-highlightSemi m-0 mt-2">{title}</p>
                {!isRead && (
                    <div
                        onClick={handleShowDesc}
                        role="button"
                        tabIndex={0}
                        className="fontGroup-normal text-primary border-b border-accentVariant100 self-end m-0"
                    >
                        view
                    </div>
                )}
            </div>
            {showDesc && <p className="fontGroup-normal">{description}</p>}
        </div>
    );
};
const Notifications: FC<INotifications> = ({
    notifications,
    markAsRead,
    removeNotification,
}) => {
    if (notifications === undefined) {
        return <NoNotifications />;
    }
    return (
        <div className="w-full flex flex-col px-4">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={markAsRead}
                    removeNotification={removeNotification}
                />
            ))}
        </div>
    );
};

export default Notifications;
