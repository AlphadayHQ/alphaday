import { FC, useState } from "react";
import { MiniDialog, Spinner, twMerge } from "@alphaday/ui-kit";
import md5 from "md5";
import { Link, useHistory } from "react-router-dom";
import { usePrevious } from "src/api/hooks";
import { TUserProfile } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";
import { ReactComponent as DocSVG } from "src/assets/icons/doc.svg";
import { ReactComponent as GreenCheckSVG } from "src/assets/icons/green-check.svg";
import { ReactComponent as LogoutSVG } from "src/assets/icons/logout.svg";
import { ReactComponent as StarSVG } from "src/assets/icons/star.svg";
import { ReactComponent as UserSVG } from "src/assets/icons/user.svg";
import CONFIG from "src/config";
import { EMobileRoutePaths } from "src/routes";
import { EditProfileModal } from "./EditProfileModal";

const { IS_DEV } = CONFIG;

const NonAuthenticatedSection = () => {
    return (
        <div className="flex flex-col flex-start w-full items-start mb-4">
            <p className="mb-0 fontGroup-highlight">
                Sign up to unlock the complete experience{" "}
            </p>
            <Link
                to="/superfeed/auth"
                className="flex fontGroup-highlight !font-semibold py-3 px-4 bg-accentVariant100 hover:bg-accentVariant200 w-full mt-5 justify-center rounded-lg"
            >
                Sign up
            </Link>
            <p className="mt-6">
                <span className="mt-6">Already have an account?</span>
                <Link
                    to="/superfeed/auth"
                    className="ml-2 font-semibold border-b border-accentVariant100"
                >
                    Log in here
                </Link>
            </p>
        </div>
    );
};

const AuthenticatedSection: FC<{ profile: TUserProfile | undefined }> = ({
    profile,
}) => {
    return (
        <div className="flex flex-col flex-start w-full items-start mb-4">
            <div className="flex">
                <img
                    src={`https://www.gravatar.com/avatar/${md5(
                        profile?.user.email ?? "Guest"
                    ).toString()}?d=retro`}
                    alt="username"
                    className="mr-3 w-[60px] h-[60px] rounded-full border border-solid border-green-400"
                />
                <p className="m-0 fontGroup-major self-center">
                    Hi {profile?.handle}!
                </p>
            </div>
            {IS_DEV && (
                <div className="relative flex flex-col items-center fontGroup-highlight !font-semibold py-4 px-4 bg-backgroundVariant300 w-full mt-5 justify-center rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondaryOrangeSoda absolute top-4 right-4" />
                    <p className="block ">Some major notification here...</p>
                    <Link
                        to={EMobileRoutePaths.Notifications}
                        className="fontGroup-highlight border-b border-accentVariant100 m-0"
                    >
                        See all notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

type TMenuEntry = {
    id: string;
    icon: FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    subtext: string | null;
    requiresAuth?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

interface IUserSettings {
    profile: TUserProfile | undefined;
    // isOpen: boolean;
    // onClose: () => void;
    isAuthenticated: boolean;
    onSaveProfile: (req: { handle: string }) => void;
    isSavingProfile: boolean;
    onLogout: () => Promise<void>;
}

const UserSettings: FC<IUserSettings> = ({
    profile,
    isAuthenticated,
    onSaveProfile,
    isSavingProfile,
    onLogout,
}) => {
    const [showProfileEditModal, setShowProfileEditModal] =
        useState<boolean>(false);
    const history = useHistory();
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const prevIsSavingProfile = usePrevious(isSavingProfile);

    if (
        prevIsSavingProfile === true &&
        isSavingProfile === false &&
        isProfileUpdated === false
    ) {
        setIsProfileUpdated(true);
    }

    const navigate = (link: string) => {
        history.push(link, {});
    };

    const handleCloseModal = () => setShowProfileEditModal(false);

    const menu: TMenuEntry[] = [
        {
            id: "edit-profile",
            icon: UserSVG,
            title: "Edit profile",
            subtext: "Edit your profile",
            requiresAuth: true,
            onClick: () => {
                if (isAuthenticated) setShowProfileEditModal(true);
            },
        },
        {
            id: "privacy-policy",
            icon: DocSVG,
            title: "Privacy policy",
            subtext: "How we work & use your data",
            onClick: () => window.open("https://alphaday.com/privacy"),
        },
        {
            id: "toc",
            icon: DocSVG,
            title: "Terms and Conditions",
            subtext: "Legal conditions for you to use Alphaday",
            onClick: () =>
                window.open(
                    "https://app.termly.io/document/terms-of-use-for-website/0f183823-fe52-47af-87d2-d1058b844918"
                ),
        },
        {
            id: "rate",
            icon: StarSVG,
            title: "Rate us",
            subtext: "Tell us what we think",
            disabled: true,
            onClick: () => navigate("profile/rate"),
        },
        {
            id: "log-out",
            icon: LogoutSVG,
            title: "Log out",
            subtext: null,
            requiresAuth: true,
            onClick: () => {
                onLogout().catch((e) =>
                    Logger.error("UserMenu: logout failed", e)
                );
            },
        },
    ];

    return (
        <>
            <div className="px-5 w-full">
                {/* <div className="flex flex-start w-full items-center mb-4">
                <ChevronSVG
                    onClick={onClose}
                    tabIndex={0}
                    role="button"
                    className="w-6 h-6 mr-2 rotate-180 self-center -ml-1.5"
                />
            </div> */}
                {isAuthenticated ? (
                    <AuthenticatedSection profile={profile} />
                ) : (
                    <NonAuthenticatedSection />
                )}
                <div className="mt-10 w-full">
                    {menu.map((item) => {
                        if (
                            (item.requiresAuth && !isAuthenticated) ||
                            item.disabled
                        ) {
                            return null;
                        }
                        return (
                            <div
                                onClick={item.onClick}
                                tabIndex={0}
                                role="button"
                                key={item.id}
                                className={twMerge(
                                    "flex w-full justify-start items-center border-b border-primaryVariant100 pb-2.5 pt-2.5 last:pb-0 last:border-none first:pt-0 cursor-pointer",
                                    isAuthenticated
                                        ? "text-primary"
                                        : "text-primaryVariant100"
                                )}
                            >
                                <item.icon className="mr-4 w-6 h-6" />
                                <div className="flex flex-grow min-w-max justify-between items-center">
                                    <div className="flex flex-col w-full">
                                        <span className="block fontGroup-highlightSemi">
                                            {item.title}
                                        </span>
                                        <span className="fontGroup-support">
                                            {item.subtext}
                                        </span>
                                    </div>
                                    <ChevronSVG className="h-3.5" />
                                </div>
                            </div>
                        );
                    })}
                    {(CONFIG.IS_DEV || CONFIG.IS_LOCAL) && (
                        <div className="pb-2.5 pt-2.5 text-primaryVariant100">
                            Environment: {CONFIG.ENVIRONMENT}
                            <br />
                            Version: {CONFIG.APP.VERSION}
                            <br />
                            Commit: {CONFIG.APP.COMMIT}
                            <br />
                            Timestamp: {CONFIG.APP.COMMIT_TIMESTAMP}
                        </div>
                    )}
                </div>
            </div>
            <EditProfileModal
                profile={profile}
                show={showProfileEditModal}
                onSave={onSaveProfile}
                isSavingProfile={isSavingProfile}
                onCloseModal={handleCloseModal}
            />
            <MiniDialog show={isSavingProfile} title="Saving">
                <div className="text-center text-sm font-normal leading-tight tracking-tight text-slate-300">
                    Saving changes to your profile
                </div>
                <div className="text-center mt-4">
                    <Spinner />
                </div>
            </MiniDialog>
            <MiniDialog
                icon={<GreenCheckSVG />}
                show={isProfileUpdated}
                title="Profile Updated"
                onActionClick={() => {
                    setIsProfileUpdated(false);
                    history.push(EMobileRoutePaths.UserSettings, {});
                }}
            >
                <div className="text-center text-sm font-normal leading-tight tracking-tight text-slate-300">
                    Your Profile has been updated
                </div>
            </MiniDialog>
        </>
    );
};

export default UserSettings;
