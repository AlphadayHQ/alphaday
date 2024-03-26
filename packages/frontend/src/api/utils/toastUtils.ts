import showHotToast from "react-hot-toast";
import { v4 as uuidV4 } from "uuid";
import { Logger } from "./logging";

export enum EToastRole {
    Success = "Success",
    Error = "Error",
    Warning = "Warning",
}

export enum EToastIcons {
    Success = "✓",
    Error = "✗",
    Warning = "⚠",
}

export type TToastConfig = {
    id?: string;
    type?: EToastRole;
    status?: "status" | "alert";
    /**
     * Defaults to 4000
     */
    duration?: number;
};

/**
 * Creates a very basic, simple toast message.
 */
export const toast = (
    message: string,
    {
        id = uuidV4(),
        type = EToastRole.Success,
        status = "status",
        duration,
    }: TToastConfig = {}
): string =>
    showHotToast(`${EToastIcons[type]} ${message}`, {
        id,
        duration,
        ariaProps: {
            role: status,
            "aria-live": "assertive",
        },
    });

type TDeferredToastOption = {
    delay?: number;
    messages: {
        initial: string;
        success: string;
        error?: string;
    };
    callback?: () => void;
};

export const deferredToast = (
    option: TDeferredToastOption,
    { id = uuidV4(), status = "status", duration }: TToastConfig = {}
): void => {
    const handle = option.callback ?? (() => {});
    const toastPrompise = new Promise((resolve, error) => {
        const handler = () => {
            try {
                resolve(handle());
            } catch (e) {
                error(e);
            }
        };
        if (option.delay) {
            setTimeout(handler, option.delay);
        } else {
            handler();
        }
    });
    showHotToast
        .promise(
            toastPrompise,
            {
                loading: option.messages.initial,
                success: option.messages.success,
                error: option.messages.error ?? "",
            },
            {
                id,
                duration,
                ariaProps: {
                    role: status,
                    "aria-live": "assertive",
                },
            }
        )
        .catch((e) => {
            Logger.error("deferredToast::promise", e);
        });
};
