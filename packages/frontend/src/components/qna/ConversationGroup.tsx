import { FC } from "react";
import { ModuleLoader } from "@alphaday/ui-kit";
import ReactMarkdown from "react-markdown";
import { TQnA } from "src/api/types";
import { URL_GLOBAL_REGEX, remarkRegex } from "src/api/utils/textUtils";

const REMARK_PLUGINS = [
    remarkRegex(URL_GLOBAL_REGEX), // match all valid urls
];

interface IConversation {
    qna: TQnA;
}
const QnAGroup: FC<IConversation> = ({ qna }) => {
    const { question, answer } = qna;
    return (
        <div className="w-full p-2 flex flex-col gap-4">
            <div className="w-[calc(95%_-_35px)] self-end bg-btnBackgroundVariant1700 rounded-[10px_10px_0_10px] px-2.5 py-4">
                {question}
            </div>

            <div className="w-[calc(95%_-_35px)] bg-borderLine rounded-[10px_10px_0_10px] px-2.5 py-4">
                {answer === undefined ? (
                    <ModuleLoader $height="70px" />
                ) : (
                    <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>
                        {answer}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
};

export default QnAGroup;
