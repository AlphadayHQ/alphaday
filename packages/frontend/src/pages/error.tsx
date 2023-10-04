import React from "react";
import ErrorContainer from "../containers/error/ErrorContainer";
import MainLayout from "src/layout/MainLayout";

const ErrorPage: React.FC<{ type?: number; children?: React.ReactNode }> = ({
    type = 404,
}) => {
    return (
        <MainLayout hideFooter hideFeatures>
            <ErrorContainer type={type} />
        </MainLayout>
    );
};

export default ErrorPage;
