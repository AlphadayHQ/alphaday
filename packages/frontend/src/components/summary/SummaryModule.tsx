import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import DOMPurify from "dompurify";
import moment from "moment";
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
                    `<span class="text-secondary-orange capitalize">${tag}</span>`
                );
            }
        });
    }

    const amountMatch = summaryText.match(AMOUNT_REGEX);
    if (amountMatch !== null) {
        amountMatch.forEach((match) => {
            summaryText = summaryText.replace(
                match,
                `<span class="text-secondary-orange capitalize">${match}</span>`
            );
        });
    }

    return (
        <span
            // DOMPurify will 100% secure dangerouslySetInnerHTML
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(summaryText || ""),
            }}
            className="text-primary"
        />
    );
};

const SummaryModule: FC<ISummaryModule> = ({ isLoadingSummary, summary }) => {
    if (isLoadingSummary || summary === undefined) {
        return (
            <div className="p-5">
                <ModuleLoader
                    $height={`${CONFIG.WIDGETS.SUMMARY.WIDGET_HEIGHT}px`}
                />
            </div>
        );
    }

    return (
        <div className="p-5">
            <h6 className="border-b border-gray-300">
                <p className="font-bold text-primary-100 pl-2">
                    Briefing for{" "}
                    {moment(summary.updated_at).format("Do MMMM, YYYY")}
                </p>
            </h6>
            <p className="py-2">{getHighLights(summary)}</p>
        </div>
    );
};

export default SummaryModule;
