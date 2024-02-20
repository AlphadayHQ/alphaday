import { IonPage } from "@ionic/react";
import MobileLayout from "src/layout/MobileLayout";

const PlaceholderPage = () => {
    return (
        <IonPage>
            <MobileLayout>
                <h1 className="mx-6 my-10 fontGroup-major">Placeholder</h1>
            </MobileLayout>
        </IonPage>
    );
};

export default PlaceholderPage;
