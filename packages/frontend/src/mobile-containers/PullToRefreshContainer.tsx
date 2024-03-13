import { IonRefresher, IonRefresherContent } from "@ionic/react";

const PullToRefreshContainer = () => {
    const handleRefresh = () => {};

    return (
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
                pullingIcon="circles"
                refreshingSpinner="circles"
                refreshingText="Refreshing..."
            />
        </IonRefresher>
    );
};

export default PullToRefreshContainer;
