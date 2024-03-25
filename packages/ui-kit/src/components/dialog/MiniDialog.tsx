import { Button } from "../buttons/Button";
import { Modal } from "../modal/Modal";

export interface MiniDialogProps {
    title: string;
    actionText?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    show?: boolean;
    onActionClick?: () => void;
    // onCancelClick?: () => void; // TODO: implement cancel button
}

export const MiniDialog: React.FC<MiniDialogProps> = ({
    icon,
    title,
    children,
    actionText,
    onActionClick,
    show,
    // onCancelClick,
}) => {
    return (
        <Modal
            size="xs"
            showModal={show}
            className="w-full gap-2 rounded-xl bg-zinc-800 px-5 py-6"
        >
            <div className="flex flex-col items-center justify-start">
                {icon && <div className="p-2 pb-0">{icon}</div>}
                <div className="flex h-28 flex-col items-center justify-center pt-2 gap-4 self-stretch">
                    <div className="self-stretch text-center text-sm font-semibold uppercase leading-tight tracking-wider text-slate-300">
                        {title}
                    </div>
                    {children}
                    <div className="flex flex-col items-center justify-center gap-2">
                        {onActionClick && (
                            <Button
                                className="rounded-lg bg-blue-600 px-4 py-3"
                                onClick={onActionClick}
                            >
                                {actionText ?? "Continue"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
