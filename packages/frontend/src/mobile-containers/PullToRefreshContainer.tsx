import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";
import { isPWA } from "src/api/utils/helpers";

interface PullToRefreshContainerProps {
    children: React.ReactNode;
    handleRefresh: () => void;
}
const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
    children,
    handleRefresh,
}) => {
    return isPWA() ? (
        <IonContent forceOverscroll role="feed">
            <IonRefresher
                slot="fixed"
                pullFactor={0.1}
                pullMin={60}
                pullMax={200}
                onIonRefresh={(e) => {
                    handleRefresh();
                    e.detail.complete();
                }}
            >
                <IonRefresherContent
                    pullingIcon="bubbles"
                    refreshingSpinner="bubbles"
                />
            </IonRefresher>
            {children}
        </IonContent>
    ) : (
        children
    );
};

export default PullToRefreshContainer;
