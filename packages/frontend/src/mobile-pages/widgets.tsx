import { useMemo } from "react";
import { useView, useWindowSize } from "src/api/hooks";
import { getLayoutStateFromView } from "src/api/utils/layoutUtils";
import WidgetsLibContainer from "src/containers/widgets-library/WidgetsLibContainer";
import MainLayout from "src/layout/MainLayout";

const WidgetsPage: React.FC = () => {
    const { selectedView } = useView();
    const windowSize = useWindowSize();

    const layoutState = useMemo(() => {
        return getLayoutStateFromView(selectedView, windowSize.width);
    }, [selectedView, windowSize.width]);

    return (
        <MainLayout hideFooter>
            <WidgetsLibContainer layoutState={layoutState} isMobile />
        </MainLayout>
    );
};

export default WidgetsPage;
