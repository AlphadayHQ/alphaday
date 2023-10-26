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
        <div className="w-full p-2">
            <div className="question">{question}</div>
            {answer ? (
                <div className="response">
                    <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>
                        {answer}
                    </ReactMarkdown>
                </div>
            ) : (
                (answer === undefined && (
                    <div className="response">
                        <ModuleLoader $height="70px" />
                    </div>
                )) || <></>
            )}
        </div>
    );
};

export default QnAGroup;
