import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Button, ScrollBar, IconButton, ChatForm } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { TConversation } from "src/api/types";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import globalMessages from "src/globalMessages";
import QnAGroup from "./ConversationGroup";

const QnAStarter: FC<{ onClick: () => void }> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <div className="p-4">
            <p>{t("qna.intro")}</p>
            <p className="bold">{t("qna.highlight")}</p>
            <div className="ask-button-wrap">
                <Button onClick={onClick} variant="primary">
                    {t("qna.button")}
                </Button>
            </div>
        </div>
    );
};

interface IQnAModule {
    conversation: TConversation;
    handleSend: (m: string) => void;
    isAuthenticated: boolean;
    widgetHeight: number;
    hasReadIntro: boolean;
    onReadIntro: () => void;
}
const QnAModule: FC<IQnAModule> = ({
    conversation,
    handleSend,
    isAuthenticated,
    widgetHeight,
    onReadIntro,
    hasReadIntro,
}) => {
    const [showToBottom, setShowToBottom] = useState<boolean>(false);
    const containerRef = useRef<HTMLElement>(); // scroll Container Ref
    const newestMsgRef = useRef<number>(); // Used to know when the new msgs arrive
    const initialToBottomRef = useRef<boolean>(false); // to scroll to bottom on conversation first load

    // refetch items when scrolling up 90% of container height
    const SCROLL_ITEM_FRACTION = 0.1;
    // show scrollToBottom button when scrolling up 40% of container height
    const SCROLL_TOP_FRACTION = 0.6;

    const handleScroll = ({ currentTarget }: FormEvent<HTMLElement>) => {
        if (
            currentTarget.scrollTop <=
            currentTarget.scrollHeight * SCROLL_ITEM_FRACTION
        ) {
            // getPrevMessages();
        }
        if (
            currentTarget.scrollTop <=
            currentTarget.scrollHeight * SCROLL_TOP_FRACTION
        ) {
            setShowToBottom(true);
        }
    };

    const handleScrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (conversation.length) {
            // scroll to bottom on initial conversation Load
            if (containerRef.current && !initialToBottomRef.current) {
                containerRef.current.scrollTop =
                    containerRef.current.scrollHeight;
                initialToBottomRef.current = true;
            }

            // automatically scroll to bottom when a new message arrives
            if (
                containerRef.current &&
                newestMsgRef.current &&
                newestMsgRef.current !==
                    conversation[conversation.length - 1].id
            ) {
                containerRef.current.scrollTop =
                    containerRef.current.scrollHeight;
            }

            newestMsgRef.current = conversation[conversation.length - 1].id;
        }
    }, [conversation]);

    const onStarterButtonClick = () => {
        if (isAuthenticated) {
            onReadIntro();
        } else {
            toast(globalMessages.error.notAuthenticated, {
                type: EToastRole.Error,
                status: "alert",
            });
        }
    };

    if (!hasReadIntro) {
        return (
            <div className="w-full" style={{ height: widgetHeight }}>
                <ScrollBar>
                    <QnAStarter onClick={onStarterButtonClick} />
                </ScrollBar>
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height: widgetHeight }}>
            <div className="w-full h-[calc(100%-47px)] flex flex-col justify-end">
                <ScrollBar
                    containerRef={(el) => {
                        containerRef.current = el;
                    }}
                    onScroll={handleScroll}
                    onYReachEnd={() => {
                        setShowToBottom(false);
                    }}
                >
                    {conversation.map((qna) => (
                        <QnAGroup key={qna.id} qna={qna} />
                    ))}
                </ScrollBar>
                {showToBottom && (
                    <IconButton
                        disabled
                        variant="downArrow"
                        className="w-[35px] h-[35px] rounded-full p-1.5 absolute bottom-20 right-[25px] flex border-none cursor-pointer bg-secondaryOrange shadow-md hover:opacity-80 active:opacity-90"
                        onClick={handleScrollToBottom}
                        title="Scroll to Bottom"
                    />
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0">
                <ChatForm
                    handleSend={handleSend}
                    isAuthenticated={isAuthenticated}
                />
            </div>
        </div>
    );
};

export default QnAModule;
