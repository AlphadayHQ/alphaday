import { FC } from "react";
import { Button, ScrollBar } from "@alphaday/ui-kit";
import ReactMarkdown from "react-markdown";
import { REMARK_URL_REGEX, remarkRegex } from "src/api/utils/textUtils";
import TextOverlay from "../common/overlay/TextOverlay";

const PLUGINS = [remarkRegex(REMARK_URL_REGEX)];

interface IProps {
    show: boolean;
    /**
     * text to be displayed (accepts markdown)
     */
    disclaimer: string;
    onAccept: () => void;
    onReject?: () => void;
}

const ModuleDisclaimer: FC<IProps> = ({
    show,
    disclaimer,
    onAccept,
    onReject,
}) => {
    if (!show) {
        return null;
    }

    return (
        <TextOverlay>
            <ScrollBar>
                <div className="relative flex flex-col flex-wrap items-center justify-center m-15">
                    <ReactMarkdown remarkPlugins={PLUGINS} linkTarget="_blank">
                        {disclaimer}
                    </ReactMarkdown>
                    <div className="flex flex-1 flex-row justify-end items-end">
                        <Button
                            onClick={onAccept}
                            variant="primaryXL"
                            className="ml-[15px]"
                        >
                            Accept
                        </Button>
                        {onReject && (
                            <Button
                                onClick={onAccept}
                                variant="primaryXL"
                                className="ml-[15px]"
                            >
                                Decline
                            </Button>
                        )}
                    </div>
                </div>
            </ScrollBar>
        </TextOverlay>
    );
};

export default ModuleDisclaimer;
