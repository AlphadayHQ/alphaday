import { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "src/api/hooks";
import { EFeedItemType } from "src/api/types";
import PagedMobileLayout from "src/layout/PagedMobileLayout";
import Notifications from "src/mobile-components/notifications/Notifications";

const mockNotifications = [
    {
        id: "1",
        title: "New post",
        description: "A new post has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTelegraph",
    },
    {
        id: "2",
        title: "New comment",
        description: "A new comment has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "3",
        title: "New post",
        description: "A new post has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "4",
        title: "New comment",
        description: "A new comment has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "5",
        title: "New post",
        description: "A new post has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "6",
        title: "New comment",
        description: "A new comment has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "7",
        title: "New post",
        description: "A new post has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
    {
        id: "8",
        title: "New comment",
        description: "A new comment has been made",
        date: "2021-09-14",
        isRead: false,
        contentType: EFeedItemType.NEWS,
        source: "coinTeleg",
    },
];

const NotificationsPage = () => {
    const history = useHistory();
    const { isAuthenticated } = useAuth();

    const [notifications, setNotifications] = useState(mockNotifications);

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };
    return (
        <PagedMobileLayout
            title="Notifications"
            handleBack={() =>
                history.length > 1 ? history.goBack() : history.push("/")
            }
        >
            <Notifications
                isAuthenticated={isAuthenticated}
                notifications={notifications}
                markAsRead={markAsRead}
            />
        </PagedMobileLayout>
    );
};

export default NotificationsPage;
