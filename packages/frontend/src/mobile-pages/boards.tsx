import MainLayout from "src/layout/MainLayout";
import BoardsContainer from "src/mobile-containers/BoardsContainer";

const BoardsPage: React.FC = () => {
    return (
        <MainLayout hideFooter>
            <BoardsContainer />
        </MainLayout>
    );
};

export default BoardsPage;
