import React from "react";
import { useGetRemoteStatusQuery } from "src/api/services";
import { isNumber } from "src/api/utils/helpers";
import GeneralError from "src/components/error/GeneralError";

const getErrorMessage = ({
    status,
}: {
    status: number | undefined | string;
}): React.ReactNode => {
    if (status === "offline") {
        return (
            <>
                <h1 className="font-montserrat text-primaryVariant800 m-0 text-[120px] leading-none">
                    You&apos;re{" "}
                    <span className="text-secondaryOrange pr-1">offline</span>
                </h1>
                <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                    Looks like you lost your connection. Please check it and try
                    again.
                </p>
            </>
        );
    }

    if (status === 503) {
        return (
            <>
                <h1 className="font-montserrat text-primaryVariant800 m-0 text-[120px] leading-none">
                    System{" "}
                    <span className="text-secondaryOrange pr-1">
                        maintenance
                    </span>
                </h1>
                <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                    We are performing some scheduled maintenance at the moment.
                    We&apos;ll be back up shortly! Meanwhile, you can check our{" "}
                    <a
                        href="https://twitter.com/AlphadayHQ"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        twitter
                    </a>
                    .
                </p>
                <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                    And make sure to check back again later.
                </p>
            </>
        );
    }

    if (status === 403) {
        return (
            <>
                <h1 className="font-montserrat text-primaryVariant800 m-0 text-[120px] leading-none">
                    unauthorised{" "}
                    <span className="text-secondaryOrange pr-1">403</span>
                </h1>
                <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                    You don&apos;t have permissions to access this page.
                </p>
            </>
        );
    }

    if (status === 404) {
        return (
            <>
                <h1 className="font-montserrat text-primaryVariant800 m-0 text-[120px] leading-none">
                    <span className="text-secondaryOrange pr-1">404</span>
                </h1>
                <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                    Sorry, the page you are looking for could not be found.
                </p>
            </>
        );
    }

    return (
        <>
            {status && typeof status === "number" && (
                <h1 className="font-montserrat text-primaryVariant800 m-0 text-[120px] leading-none">
                    <span className="text-secondaryOrange pr-1">{status}</span>
                </h1>
            )}
            <p className="font-montserrat text-primaryVariant1000 text-xl mt-9 max-w-screen-sm">
                Something went wrong, we&apos;ll be back up shortly! Meanwhile,
                you can check our{" "}
                <a
                    className="twitter"
                    href="https://twitter.com/AlphadayHQ"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    twitter
                </a>{" "}
                for updates.
            </p>
        </>
    );
};

const ErrorContainer: React.FC<{ type?: number }> = ({ type }) => {
    const { error } = useGetRemoteStatusQuery();
    // @ts-expect-error
    const rawStatusCode = error?.data?.status_code;
    // recall: we can't define explicity types for error responses
    // rtk-query can't provide this feature
    const status: number | undefined | string =
        type ||
        // eslint-disable-next-line no-nested-ternary
        (navigator.onLine
            ? rawStatusCode != null &&
              (typeof rawStatusCode === "number" ||
                  (typeof rawStatusCode === "string" &&
                      isNumber(rawStatusCode)))
                ? rawStatusCode
                : undefined
            : "offline");

    const errorContent = getErrorMessage({ status });

    return <GeneralError>{errorContent}</GeneralError>;
};

export default ErrorContainer;
