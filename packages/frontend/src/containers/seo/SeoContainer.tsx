import { SuperSEO } from "react-super-seo";
import { useAvailableViews, useCookieChoice, useIsMobile } from "src/api/hooks";
import { useAppSelector } from "src/api/store/hooks";
import { getBoardDescription, getBoardTitle } from "src/api/utils/seo";
import CONFIG from "../../config";

const { DEFAULT_TITLE, DESCRIPTION, HOTJAR } = CONFIG.SEO;

const SeoContainer = () => {
    const availableViews = useAvailableViews();
    const selectedViewId = useAppSelector(
        (state) => state.views.selectedViewId
    );
    const { allowTracking } = useCookieChoice();

    const isMobile = useIsMobile();

    /**
     * TODO(v-almonacid): Amend when route handling is 100% defined for mobile
     */
    if (isMobile) {
        return (
            <SuperSEO
                title="Alphaday"
                description={DESCRIPTION}
                lang="en"
                robots="noindex"
            />
        );
    }

    const selectedView = availableViews?.find(
        (v) => v.data.id === selectedViewId
    );
    const routeInfo = CONFIG.ROUTING.REGEXPS.VIEW.exec(location.pathname) ?? [];

    if (
        location.pathname.length > 1 && // not the root path
        routeInfo[1] !== selectedView?.data.hash &&
        routeInfo[1] !== selectedView?.data.slug
    ) {
        return (
            <SuperSEO
                title="Not found - Alphaday"
                description={DESCRIPTION}
                lang="en"
                robots="noindex"
            />
        );
    }

    const hotjarId = Number(HOTJAR.SITE_ID);
    const hotjarVersion = Number(HOTJAR.SNIPPET_VERSION);

    const title = getBoardTitle(selectedView?.data.name) ?? DEFAULT_TITLE;
    const description =
        getBoardDescription(selectedView?.data.name) ??
        selectedView?.data.description ??
        DESCRIPTION;

    return (
        <SuperSEO
            title={title}
            description={description}
            lang="en"
            openGraph={{
                ogImage: {
                    ogImage: selectedView?.data.icon ?? "./logo512.png",
                    ogImageAlt: selectedView?.data.name || DEFAULT_TITLE,
                    ogImageWidth: 1200,
                    ogImageHeight: 630,
                    ogImageType: "image/jpeg",
                },
            }}
            robots={
                CONFIG.IS_PROD
                    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                    : "noindex"
            }
            twitter={{
                twitterSummaryCard: {
                    summaryCardSiteUsername: "@AlphadayHQ",
                },
            }}
        >
            {((CONFIG.IS_PROD && allowTracking) || CONFIG.IS_STAGING) && (
                <script>
                    {`(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:${hotjarId},hjsv:${hotjarVersion}}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
                </script>
            )}
        </SuperSEO>
    );
};

export default SeoContainer;
