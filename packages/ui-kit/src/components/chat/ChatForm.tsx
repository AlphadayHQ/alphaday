import {
    ChangeEvent,
    FC,
    KeyboardEvent,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { ReactComponent as Send } from "src/assets/svg/send.svg";

interface IForm {
    handleSend: (m: string) => void;
    isAuthenticated: boolean;
}
export const ChatForm: FC<IForm> = ({ handleSend, isAuthenticated }) => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [message, setMessage] = useState("");

    const isMessageInvalid = useMemo(() => message === "\n" || message === "", [
        message,
    ]);

    const autoGrow = useCallback(() => {
        if (!textAreaRef.current) {
            return;
        }
        if (message === "") {
            textAreaRef.current.style.height = "auto";
        } else {
            textAreaRef.current.style.height = "5px";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        autoGrow();
    };

    const handleSubmit = useCallback(() => {
        if (isMessageInvalid) {
            return;
        }
        handleSend(message);
        setMessage("");
        if (!textAreaRef.current) {
            return;
        }
        textAreaRef.current.style.height = "auto";
    }, [handleSend, isMessageInvalid, message]);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && message !== "") {
                if (e.shiftKey || e.ctrlKey) {
                    return;
                }
                handleSubmit();
            }
        },
        [handleSubmit, message]
    );

    return (
        <div className="h-[50px] w-full flex justify-between bg-backgroundVariant200 border-t border-background">
            <textarea
                ref={textAreaRef}
                className="font-normal border-0 bg-transparent self-center text-primary w-full resize-none overflow-hidden min-h-auto px-4 transition-none"
                name="message"
                placeholder={
                    isAuthenticated
                        ? "Message..."
                        : "Connect your wallet to chat"
                }
                rows={1}
                onInput={autoGrow}
                value={message}
                onChange={handleMessage}
                onKeyUp={handleKeyPress}
            />

            <button
                type="button"
                disabled={isMessageInvalid}
                title={
                    isAuthenticated
                        ? "Send Message"
                        : "Verify your wallet to chat"
                }
                onClick={handleSubmit}
                className={`w-12 p-3 flex items-center justify-center bg-backgroundVariant500 border-none border-l border-background ${
                    isAuthenticated && !isMessageInvalid
                        ? "cursor-pointer"
                        : "opacity-40 cursor-auto !important"
                }`}
            >
                <Send />
            </button>
        </div>
    );
};
