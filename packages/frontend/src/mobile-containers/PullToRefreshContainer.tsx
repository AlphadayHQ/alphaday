import { IonContent, IonRefresher, IonRefresherContent } from "@ionic/react";

interface PullToRefreshContainerProps {
    children: React.ReactNode;
    handleRefresh: () => void;
}
const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
    children,
    handleRefresh,
}) => {
    return (
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
    );
};

export default PullToRefreshContainer;
