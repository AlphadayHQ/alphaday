import { IonPage } from "@ionic/react";
import queryString from "query-string";
import { useLocation } from "react-router";
import MobileLayout from "src/layout/MobileLayout";

const ExternalPage: React.FC = () => {
    const { search } = useLocation();
    const { url, title } = queryString.parse(search);
    return (
        <IonPage>
            <MobileLayout>
                <iframe
                    // @ts-expect-error
                    title={title}
                    className="w-full h-full border-0 border-none"
                    // @ts-expect-error
                    src={url}
                    allowFullScreen
                />
            </MobileLayout>
        </IonPage>
    );
};

export default ExternalPage;
