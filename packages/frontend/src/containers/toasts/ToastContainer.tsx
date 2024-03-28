import { FC, memo } from "react";
import { Button } from "@alphaday/ui-kit";
import { ToastOptions, ToastBar, Toaster, toast } from "react-hot-toast";
import { ReactComponent as CloseSVG } from "src/assets/icons/close2.svg";

interface ToastContainerProps extends ToastOptions {
    containerClassName?: string;
}

const ToastContainer: FC<ToastContainerProps> = ({
    position,
    containerClassName,
    ...toastOptions
}) => {
    return (
        <Toaster
            containerClassName={containerClassName}
            position={position ?? "top-right"}
            toastOptions={toastOptions}
        >
            {(t) => (
                <ToastBar
                    toast={t}
                    style={{
                        background:
                            "var(--colors-secondary-orange, var(--alpha-orange))",
                        color: "var(--colors-text-primary, var(--alpha-white))",
                    }}
                >
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== "loading" && (
                                <Button
                                    onClick={() => toast.dismiss(t.id)}
                                    variant="extraSmall"
                                    className="bg-transparent hover:bg-transparent border-0 text-white"
                                >
                                    <CloseSVG className="w-4 h-4" />
                                </Button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};

export default memo(ToastContainer);
