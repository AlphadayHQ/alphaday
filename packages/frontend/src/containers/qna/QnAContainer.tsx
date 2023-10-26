import { FC, useState } from "react";
import { useAccount, useWidgetHeight } from "src/api/hooks";
import { useGetLlmQnAQuery } from "src/api/services";
import { TQnA } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { EToastRole, toast } from "src/api/utils/toastUtils";
import QnAModule from "src/components/qna/QnAModule";
import { IModuleContainer } from "src/types";

const QnAContainer: FC<IModuleContainer> = ({ moduleData }) => {
    const { isAuthenticated, authWallet } = useAccount();

    const [question, setQuestion] = useState<string>("");

    const [questionsDict, setQuestionsDict] = useState<Record<number, TQnA>>(
        {}
    );

    const [lastQuestionIndex, setLastQuestionIndex] = useState<number>(-1);

    const { currentData } = useGetLlmQnAQuery(
        { question },
        { skip: !question }
    );

    if (
        currentData !== undefined &&
        questionsDict[lastQuestionIndex]?.answer === undefined
    ) {
        setQuestionsDict((prevState) => ({
            ...prevState,
            [lastQuestionIndex]: {
                ...prevState[lastQuestionIndex],
                answer: currentData.answer,
            },
        }));
    }

    const widgetHeight = useWidgetHeight(moduleData);

    //TODO: move to widgets store
    const [hasReadIntro, setHasReadIntro] = useState(false);

    const onReadIntro = () => {
        setHasReadIntro(true);
    };
    const handleSend = (m: string) => {
        Logger.debug("QnAContainer::handleSend", m);
        if (!isAuthenticated) {
            toast("Connect your wallet to chat", {
                type: EToastRole.Error,
                status: "alert",
            });
            return;
        }
        if (isAuthenticated && authWallet.account) {
            setQuestion(m);
            setQuestionsDict((prevState) => {
                return {
                    ...prevState,
                    [lastQuestionIndex + 1]: {
                        id: lastQuestionIndex + 1,
                        question: m,
                        answer: undefined,
                    },
                };
            });
            setLastQuestionIndex((prevState) => prevState + 1);
        }
    };

    return (
        <QnAModule
            handleSend={handleSend}
            isAuthenticated={isAuthenticated}
            userAccount={authWallet.account}
            widgetHeight={widgetHeight}
            hasReadIntro={hasReadIntro}
            onReadIntro={onReadIntro}
            conversation={Object.values(questionsDict)}
        />
    );
};

export default QnAContainer;
