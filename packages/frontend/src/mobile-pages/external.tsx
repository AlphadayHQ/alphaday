import { useRef } from "react";
import { CenteredBlock } from "@alphaday/ui-kit";
import { IonPage } from "@ionic/react";
import queryString from "query-string";
import { useLocation } from "react-router";
import MobileLayout from "src/layout/MobileLayout";

const parseParams = (
    search: string
): { url: string; title: string } | undefined => {
    const { url, title } = queryString.parse(search);
    if (typeof url !== "string" || typeof title !== "string") return undefined;
    return {
        url,
        title,
    };
};

const ExternalPage: React.FC = () => {
    /**
     * Before the iframe loads the browser displays a white page.
     * For that reason we set its visibility to hidden until it loads
     */
    const frameRef = useRef<HTMLIFrameElement>(null);

    const { search } = useLocation();
    const parsedParams = parseParams(search);

    return (
        <IonPage>
            <MobileLayout>
                {!parsedParams ? (
                    <CenteredBlock>Error loading content</CenteredBlock>
                ) : (
                    <iframe
                        id="my-iframe"
                        title={parsedParams.title}
                        className="w-full h-full border-0 border-none"
                        style={{ visibility: "hidden" }}
                        src={parsedParams.url}
                        allowFullScreen
                        ref={frameRef}
                        onLoad={() => {
                            if (frameRef.current) {
                                frameRef.current.style.visibility = "visible";
                            }
                        }}
                    />
                )}
            </MobileLayout>
        </IonPage>
    );
};

export default ExternalPage;
