import MainLayout from "src/layout/MainLayout";
import WidgetsContainer from "src/mobile-containers/WidgetsContainer";

const WidgetsPage: React.FC = () => {
    return (
        <MainLayout hideFooter>
            <WidgetsContainer />
        </MainLayout>
    );
};

export default WidgetsPage;
