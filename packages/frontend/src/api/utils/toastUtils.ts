import showHotToast from "react-hot-toast";
import { v4 as uuidV4 } from "uuid";

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
};

export const toast = (
    message: string,
    {
        id = uuidV4(),
        type = EToastRole.Success,
        status = "status",
    }: TToastConfig = {}
): string =>
    showHotToast(`${EToastIcons[type]} ${message}`, {
        id,
        ariaProps: {
            role: status,
            "aria-live": "assertive",
        },
    });
