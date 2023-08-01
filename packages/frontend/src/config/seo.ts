const SEO_CONFIG = {
    DEFAULT_TITLE:
        "Alphaday - Customizable Crypto Data, Research & News Dashboards",
    DESCRIPTION:
        "Alphaday is a customizable Web3 & Cryptocurrency dashboard to help follow your favorite projects. Everything crypto. All in one place.",
    DOMAIN: "https://www.alphaday.com",
    APP: "https://app.alphaday.com",
    SITE_NAME: "Alphaday",
    SOCIAL_LINKS: {
        twitter: "https://twitter.com/AlphadayHQ",
        linkedIn: "https://www.linkedin.com/company/alphaday",
    },
    HOTJAR: {
        SITE_ID: import.meta.env.VITE_HOTJAR_SITE_ID,
        SNIPPET_VERSION: import.meta.env.VITE_HOTJAR_SNIPPET_VERSION,
    },
    BOARDS_WITH_DEFAULT_CONFIG: ["default", "beginner", "nft", "trading"],
};

export default SEO_CONFIG;
