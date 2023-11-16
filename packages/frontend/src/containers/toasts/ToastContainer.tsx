import { FC } from "react";
import { Button } from "@alphaday/ui-kit";
import { ToastOptions, ToastBar, Toaster, toast } from "react-hot-toast";

const ToastContainer: FC<ToastOptions> = (options) => {
    return (
        <Toaster position="top-right" toastOptions={options}>
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
                                    X
                                </Button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};

export default ToastContainer;
