import { FC } from "react";
import { ReactComponent as CopySVG } from "src/assets/svg/copy.svg";
import { Dialog } from "./Dialog";

interface IProps {
    viewUrl: string;
    onCopyUrl: () => void;
    onClose: () => void;
    show: boolean;
    title: string;
}
export const ShareViewDialog: FC<IProps> = ({
    viewUrl,
    onCopyUrl,
    onClose,
    show,
    title,
}) => (
    <Dialog
        size="sm"
        title={title}
        onClose={onClose}
        showXButton
        showDialog={show}
    >
        <div className="overflow-auto">
            <p>You can share your board by simply copying this URL:</p>
            <div
                role="button"
                tabIndex={0}
                onClick={onCopyUrl}
                title="Copy board URL"
                className="flex flex-1 flex-row justify-between font-montserrat text-primaryVariant200 bg-background rounded-[5px] p-[11px] my-5 mx-0 hover:bg-background active:bg-background cursor-pointer"
            >
                <span className="flex flex-[5] overflow-hidden">
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                        {viewUrl}
                    </span>
                </span>
                <span className="flex items-center before:[content:'|'] before:my-0 before:mx-[10px] before:text-background font-700" />
                <span className="flex flex-1 cursor-pointer items-center">
                    <CopySVG className="mr-[5px] text-inherit" />
                    Copy
                </span>
            </div>
            <p className="pb-2">
                Users with the link will get read-only access, so they will not
                be able to edit your board.
            </p>
        </div>
    </Dialog>
);
