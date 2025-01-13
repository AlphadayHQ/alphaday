import React from "react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useGetRemoteStatusQuery } from "src/api/services";
import { isNumber } from "src/api/utils/helpers";
import GeneralError from "src/components/error/GeneralError";

const getErrorMessage = ({
    status,
    t,
}: {
    status: number | undefined | string;
    t: TFunction<"translation", undefined>;
}): React.ReactNode => {
    if (status === "offline") {
        return (
            <>
                <h1 className="font-montserrat text-primaryFiltered m-0 text-[120px] leading-none">
                    {t("error_page.offline.heading.text")}{" "}
                    <span className="text-secondaryOrange pr-1">
                        {t("error_page.offline.heading.highlight")}
                    </span>
                </h1>
                <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                    {t("error_page.offline.description")}
                </p>
            </>
        );
    }

    if (status === 503) {
        return (
            <>
                <h1 className="font-montserrat text-primaryFiltered m-0 text-[120px] leading-none">
                    {t("error_page.503.heading.text")}{" "}
                    <span className="text-secondaryOrange pr-1">
                        {t("error_page.503.heading.highlight")}
                    </span>
                </h1>
                <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                    {t("error_page.503.description1.text")}{" "}
                    <a
                        href={t("error_page.503.description1.link.url")}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {t("error_page.503.description1.link.text")}
                    </a>
                    .
                </p>
                <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                    {t("error_page.503.description2")}
                </p>
            </>
        );
    }

    if (status === 403) {
        return (
            <>
                <h1 className="font-montserrat text-primaryFiltered m-0 text-[120px] leading-none">
                    {t("error_page.403.heading.text")}{" "}
                    <span className="text-secondaryOrange pr-1">
                        {t("error_page.403.heading.highlight")}
                    </span>
                </h1>
                <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                    {t("error_page.403.description")}
                </p>
            </>
        );
    }

    if (status === 404) {
        return (
            <>
                <h1 className="font-montserrat text-primaryFiltered m-0 text-[120px] leading-none">
                    <span className="text-secondaryOrange pr-1">
                        {t("error_page.404.heading.highlight")}
                    </span>
                </h1>
                <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                    {t("error_page.404.description")}
                </p>
            </>
        );
    }

    return (
        <>
            {status && typeof status === "number" && (
                <h1 className="font-montserrat text-primaryFiltered m-0 text-[120px] leading-none">
                    <span className="text-secondaryOrange pr-1">{status}</span>
                </h1>
            )}
            <p className="font-montserrat text-primaryVariant100 text-xl mt-9 max-w-screen-sm">
                {t("error_page.default.description.text")}{" "}
                <a
                    className="twitter"
                    href={t("error_page.default.description.link.url")}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {t("error_page.default.description.link.text")}
                </a>{" "}
                {t("error_page.default.description.textAfterLink")}
            </p>
        </>
    );
};

const ErrorContainer: React.FC<{ type?: number }> = ({ type }) => {
    const { t } = useTranslation();
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

    const errorContent = getErrorMessage({ status, t });

    return <GeneralError>{errorContent}</GeneralError>;
};

export default ErrorContainer;
