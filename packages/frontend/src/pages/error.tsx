import React from "react";
import MainLayout from "src/layout/MainLayout";
import ErrorContainer from "../containers/error/ErrorContainer";

const ErrorPage: React.FC<{ type?: number }> = ({ type = 404 }) => {
    return (
        <MainLayout hideFooter hideFeatures>
            <ErrorContainer type={type} />
        </MainLayout>
    );
};

export default ErrorPage;
