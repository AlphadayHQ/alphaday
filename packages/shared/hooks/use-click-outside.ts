import { useCallback, useEffect, useRef, RefObject } from "react";

export default <T extends HTMLElement>(
    onClose: () => void,
    modalRef?: RefObject<T> // doar modals don't bubble click events to the document
): RefObject<T> => {
    const ref = useRef<T>(null);
    const escapeListener = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );
    const clickListener = useCallback(
        (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose?.();
            }
        },
        [onClose]
    );
    useEffect(() => {
        const elem = modalRef?.current;
        document.addEventListener("click", clickListener);
        document.addEventListener("keyup", escapeListener);
        elem?.addEventListener("click", clickListener);
        elem?.addEventListener("keyup", escapeListener);

        return () => {
            document.removeEventListener("click", clickListener);
            document.removeEventListener("keyup", escapeListener);
            elem?.removeEventListener("click", clickListener);
            elem?.removeEventListener("keyup", escapeListener);
        };
    }, [escapeListener, clickListener, modalRef]);
    return ref;
};
