import md5 from "md5";
import { useAccount } from "src/api/hooks";
import MobileLayout from "src/layout/MobileLayout";
import AuthPromptContainer from "src/mobile-containers/AuthPromptContainer";
import BoardsContainer from "src/mobile-containers/BoardsContainer";

const BoardsPage: React.FC = () => {
    const { userProfile } = useAccount();

    return (
        <MobileLayout
            avatar={
                userProfile?.user.email
                    ? `https://www.gravatar.com/avatar/${md5(
                          userProfile.user.email
                      ).toString()}?d=retro`
                    : undefined
            }
        >
            <AuthPromptContainer />
            <BoardsContainer />
        </MobileLayout>
    );
};

export default BoardsPage;
