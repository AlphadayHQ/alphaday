const ROUTING_CONFIG = {
    REGEXPS: {
        FULL_SIZE_WIDGET: /^\/b\/[a-zA-Z0-9-]+\/([a-zA-Z0-9-]+)?\/?/,
        VIEW: /^\/b\/([a-zA-Z0-9-]+)\/?/,
    },
    ROUTES: {
        VIEW_BASE: "/b/",
    },
};

export default ROUTING_CONFIG;
