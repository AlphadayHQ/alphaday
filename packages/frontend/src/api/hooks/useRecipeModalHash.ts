import { useCallback, useEffect, useState } from "react";

const RECIPE_HASH = "#recipes";

/**
 * Hook to manage recipe modal state via URL hash.
 * When `#recipes` is in the URL, the modal is open.
 * Removing the hash closes the modal.
 */
export const useRecipeModalHash = () => {
    const [showModal, setShowModal] = useState(
        () => window.location.hash === RECIPE_HASH
    );

    useEffect(() => {
        const handleHashChange = () => {
            setShowModal(window.location.hash === RECIPE_HASH);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const openModal = useCallback(() => {
        window.location.hash = RECIPE_HASH;
    }, []);

    const closeModal = useCallback(() => {
        // Remove hash without triggering a page jump
        window.history.pushState(
            null,
            "",
            window.location.pathname + window.location.search
        );
        setShowModal(false);
    }, []);

    const toggleModal = useCallback(() => {
        if (showModal) {
            closeModal();
        } else {
            openModal();
        }
    }, [showModal, closeModal, openModal]);

    return { showModal, openModal, closeModal, toggleModal };
};
