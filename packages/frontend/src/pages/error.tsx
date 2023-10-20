import { FC } from "react";
import MainLayout from "src/layout/MainLayout";
import ErrorContainer from "../containers/error/ErrorContainer";

const ErrorPage: FC<{ type?: number }> = ({ type }) => {
    return (
        <MainLayout hideFooter hideFeatures>
            <ErrorContainer type={type} />
        </MainLayout>
    );
};

export default ErrorPage;
