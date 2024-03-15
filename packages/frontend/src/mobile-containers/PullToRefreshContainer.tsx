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
        <IonContent>
            <IonRefresher
                slot="fixed"
                pullFactor={0.5}
                pullMin={100}
                pullMax={200}
                onIonRefresh={(e) => {
                    handleRefresh();
                    e.detail.complete();
                }}
            >
                <IonRefresherContent />
            </IonRefresher>
            {children}
        </IonContent>
    ) : (
        children
    );
};

export default PullToRefreshContainer;
