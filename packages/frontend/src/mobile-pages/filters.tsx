import MobileLayout from "src/layout/MobileLayout";

const FiltersPage = () => {
    return (
        // Work around. this file is deleted in another PR
        <MobileLayout toggleShowUserMenu={() => {}}>
            <h1 className="mx-6 my-10 fontGroup-major">Filters Page</h1>
        </MobileLayout>
    );
};

export default FiltersPage;
