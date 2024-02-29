import { IonPage } from "@ionic/react";
import MobileLayout from "src/layout/MobileLayout";

const FiltersPage = () => {
    return (
        <IonPage>
            <MobileLayout>
                <h1 className="mx-6 my-10 fontGroup-major">Filters Page</h1>
            </MobileLayout>
        </IonPage>
    );
};

export default FiltersPage;
