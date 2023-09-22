const VIEWS_CONFIG = {
    VIEW_NAME_LIMT: 20,
    MAX_WIDGETS: 15,
    POLLING_INTERVAL: 5,
    /**
     * This parameter should be greater than the save request RTT.
     * This way we make sure every time a save request is triggered,
     * the previous request has completed (or debounced).
     */
    AUTO_SAVE_DEBOUNCE: 4 * 1000,
};

export default VIEWS_CONFIG;
