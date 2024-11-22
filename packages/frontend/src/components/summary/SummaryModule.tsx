import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import DOMPurify from "dompurify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { TNewsSummary } from "src/api/types";
import CONFIG from "src/config/config";

interface ISummaryModule {
    isLoadingSummary: boolean;
    summary: TNewsSummary | undefined;
}

const AMOUNT_REGEX =
    /\$\d{1,3}(,\d{3})*(\.\d+)?\s?(million|billion|thousand|K|k)?\s?(dollars)?/gi;

const getHighLights = (summary: TNewsSummary) => {
    let summaryText = summary.summary;

    if (summary.tags?.length) {
        summary.tags.forEach((tag) => {
            const regex = new RegExp(tag, "gi");
            const tagMatch = summaryText.match(regex);

            if (tagMatch !== null) {
                summaryText = summaryText.replace(
                    regex,
                    `<span class="text-secondaryOrange50 capitalize">${tag}</span>`
                );
            }
        });
    }

    const amountMatch = summaryText.match(AMOUNT_REGEX);
    if (amountMatch !== null) {
        amountMatch.forEach((match) => {
            summaryText = summaryText.replace(
                match,
                `<span class="text-secondaryOrange50 capitalize">${match}</span>`
            );
        });
    }

    return (
        <p
            // DOMPurify will 100% secure dangerouslySetInnerHTML
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(summaryText || ""),
            }}
            className="py-2 text-primary text-justify"
        />
    );
};

const SummaryModule: FC<ISummaryModule> = ({ isLoadingSummary, summary }) => {
    const { t } = useTranslation();
    if (isLoadingSummary || summary === undefined) {
        return (
            <ModuleLoader
                $height={`${CONFIG.WIDGETS.SUMMARY.WIDGET_HEIGHT}px`}
            />
        );
    }

    return (
        <div className="h-full">
            <h6 className="px-3 pt-3 mb-0">
                <p className="fontGroup-highlight">
                    {t("others.briefing_for")}{" "}
                    {moment(summary.updated_at).format("Do MMMM, YYYY")}
                </p>
            </h6>
            <div className="pb-5 px-3 pt-0">{getHighLights(summary)}</div>
        </div>
    );
};

export default SummaryModule;
