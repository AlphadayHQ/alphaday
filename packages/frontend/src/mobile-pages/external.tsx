import { useRef } from "react";
import { IonPage } from "@ionic/react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router";
import MobileLayout from "src/layout/MobileLayout";

const ExternalPage: React.FC = () => {
    const frameRef = useRef<HTMLIFrameElement>(null);
    const { search } = useLocation();
    const { url, title } = queryString.parse(search);

    const history = useHistory();

    if (typeof url !== "string") throw new Error("expected string");

    /**
     * This is a hack to detect whether the iframe loads successfuly. If it doesn't
     * (because of same origin policy, in most cases) we open the link in a new tab instead
     * and navigate back to the superfeed.
     */
    const onLoad = () => {
        try {
            // eslint-disable-next-line
            const contentDoc =
                // @ts-expect-error
                frameRef.contentDocument || frameRef.contentWindow.document;
        } catch (_e) {
            window.open(url);
            history.goBack();
        }
    };

    return (
        <IonPage>
            <MobileLayout>
                <iframe
                    // @ts-expect-error
                    title={title}
                    className="w-full h-full border-0 border-none"
                    src={url}
                    allowFullScreen
                    onLoad={onLoad}
                    ref={frameRef}
                />
            </MobileLayout>
        </IonPage>
    );
};

export default ExternalPage;
