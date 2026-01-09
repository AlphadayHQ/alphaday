import { useEffect, useState, memo } from "react";
import {
    Dropdown,
    DropdownAvatar,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    IconButton,
    twMerge,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { TUserProfile } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import globalMessages from "src/globalMessages";
import styles from "./ProfileMenuWrapper.module.scss";

interface IProps {
    onSignOut: () => MaybeAsync<void>;
    onSignUpSignIn: () => MaybeAsync<void>;
    onToggleLanguageModal: () => void;
    isAuthenticated: boolean;
    onShowTutorial: (s: boolean) => void;
    showTutorial: boolean | undefined;
    onShowAboutUsModal: () => void;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
    profile: TUserProfile | undefined;
    isMobile?: boolean;
}

const Divider = () => (
    <div className="border-borderLine m-0 h-0 border-t border-solid" />
);

// Shared dropdown content component
const ProfileMenuContent: React.FC<{
    profile: TUserProfile | undefined;
    walletMenuOption: {
        handler: () => MaybeAsync<void>;
        menuTitle: string;
        title: string;
        dataTestId: string;
    };
    onToggleLanguageModal: () => void;
    handleToggle: () => void;
    toggleTutorialState: boolean;
    onShowAboutUsModal: () => void;
    isMobile: boolean;
    t: (key: string) => string;
    onNavigateToBoards: () => void;
    onNavigateToWidgets: () => void;
}> = ({
    profile,
    walletMenuOption,
    onToggleLanguageModal,
    // handleToggle,
    // toggleTutorialState,
    onShowAboutUsModal,
    isMobile,
    t,
    onNavigateToBoards,
    onNavigateToWidgets,
}) => (
    <div className="mx-2">
        <div className="flex justify-start sm:px-2 pb-2 sm:pb-5 pt-4 sm:pt-0">
            <span className="flex-shrink-0">
                <DropdownAvatar />
            </span>
            <p
                className={twMerge(
                    "m-0 self-center ml-4 fontGroup-highlight min-w-[0px]",
                    profile?.user.username && "capitalize"
                )}
            >
                {profile?.user.username || profile?.user.email}
            </p>
        </div>
        <Divider />
        <DropdownItem onClick={onNavigateToWidgets}>
            <span title={walletMenuOption.title}>
                {t("navigation.widgets")}
            </span>
        </DropdownItem>
        <Divider />
        <DropdownItem onClick={onNavigateToBoards}>
            <span title={walletMenuOption.title}>{t("navigation.boards")}</span>
        </DropdownItem>
        <Divider />
        <DropdownItem
            key={walletMenuOption.dataTestId}
            data-testid={walletMenuOption.dataTestId}
            onClick={() => {
                walletMenuOption.handler()?.catch((err) => {
                    Logger.error("profile-menu:ProfileMenuWrapper", err);
                });
            }}
        >
            <span title={walletMenuOption.title}>
                {walletMenuOption.menuTitle}
            </span>
        </DropdownItem>
        <Divider />
        <DropdownItem
            className={isMobile ? "flex" : "flex three-col:hidden"}
            onClick={onToggleLanguageModal}
        >
            <span title="Switch Language">{t("navigation.menu.language")}</span>
        </DropdownItem>
        <Divider />
        {/* <DropdownItem onClick={handleToggle}>
            {t("navigation.menu.tutorial")}{" "}
            <input
                title="Toggle Tutorial"
                type="checkbox"
                className={styles.toggle}
                onChange={handleToggle}
                checked={toggleTutorialState}
            />
        </DropdownItem>
        <Divider /> */}
        <DropdownItem onClick={onShowAboutUsModal}>
            <span title="Lear more about Alphaday">
                {t("navigation.menu.aboutUs")}
            </span>
        </DropdownItem>
        <Divider />
        {CONFIG.APP.VERSION && CONFIG.APP.COMMIT && (
            <DropdownItem className="hover:bg-background pb-0 pt-5">
                <div className="fontGroup-mini w-full">
                    {t("navigation.menu.version")}: {CONFIG.APP.VERSION}
                    <br />
                    {t("navigation.menu.commit")}: {CONFIG.APP.COMMIT}
                </div>
            </DropdownItem>
        )}
    </div>
);

// Mobile version - separate component to avoid hook ordering issues
const ProfileMenuMobile: React.FC<IProps> = memo(
    ({
        onSignOut,
        onSignUpSignIn,
        onShowTutorial,
        onToggleLanguageModal,
        showTutorial,
        onShowAboutUsModal,
        isAuthenticated,
        profile,
    }) => {
        const history = useHistory();
        const { t } = useTranslation();
        const [toggleTutorialState, setToggleTutorialState] = useState(false);

        const handleToggle = () => {
            setToggleTutorialState((prev) => !prev);
            setTimeout(() => {
                onShowTutorial(true);
            }, 500);
        };

        const walletMenuOption = isAuthenticated
            ? {
                  handler: onSignOut,
                  menuTitle: t("navigation.menu.signOut"),
                  title: t("navigation.menu.signOut"),
                  dataTestId: "profile-menu-sign-out",
              }
            : {
                  handler: onSignUpSignIn,
                  menuTitle: `${t("navigation.menu.signUp")} / ${t("navigation.menu.signIn")}`,
                  title: globalMessages.portfolio.signUp,
                  dataTestId: "profile-menu-sign-up",
              };

        useEffect(() => {
            if (!showTutorial) setToggleTutorialState(false);
        }, [showTutorial]);

        const onNavigateToBoards = () => {
            history.push("/boards");
        };
        const onNavigateToWidgets = () => {
            history.push("/widgets");
        };

        return (
            <div
                className="w-full px-2.5 py-2 border-b rounded-md border-borderLine"
                data-testid="profile-menu-mobile"
            >
                <ProfileMenuContent
                    profile={profile}
                    walletMenuOption={walletMenuOption}
                    onToggleLanguageModal={onToggleLanguageModal}
                    handleToggle={handleToggle}
                    toggleTutorialState={toggleTutorialState}
                    onShowAboutUsModal={onShowAboutUsModal}
                    isMobile
                    t={t}
                    onNavigateToBoards={onNavigateToBoards}
                    onNavigateToWidgets={onNavigateToWidgets}
                />
            </div>
        );
    }
);

// Desktop version - separate component to avoid hook ordering issues
const ProfileMenuDesktop: React.FC<IProps> = memo(
    ({
        onSignOut,
        onSignUpSignIn,
        onShowTutorial,
        onToggleLanguageModal,
        showTutorial,
        onShowAboutUsModal,
        isAuthenticated,
        setTutFocusElemRef,
        profile,
    }) => {
        const history = useHistory();
        const { t } = useTranslation();
        const [toggleTutorialState, setToggleTutorialState] = useState(false);

        const handleToggle = () => {
            setToggleTutorialState((prev) => !prev);
            setTimeout(() => {
                onShowTutorial(true);
            }, 500);
        };

        const walletMenuOption = isAuthenticated
            ? {
                  handler: onSignOut,
                  menuTitle: t("navigation.menu.signOut"),
                  title: t("navigation.menu.signOut"),
                  dataTestId: "profile-menu-sign-out",
              }
            : {
                  handler: onSignUpSignIn,
                  menuTitle: `${t("navigation.menu.signUp")} / ${t("navigation.menu.signIn")}`,
                  title: globalMessages.portfolio.signUp,
                  dataTestId: "profile-menu-sign-up",
              };

        useEffect(() => {
            if (!showTutorial) setToggleTutorialState(false);
        }, [showTutorial]);

        const onNavigateToBoards = () => {
            history.push("/boards");
        };
        const onNavigateToWidgets = () => {
            history.push("/widgets");
        };

        return (
            <Dropdown direction="down" data-testid="profile-menu">
                <DropdownToggle>
                    <span
                        ref={(ref) =>
                            setTutFocusElemRef && ref && setTutFocusElemRef(ref)
                        }
                    >
                        <span className="items-[initial] hover:bg-backgroundVariant200 flex h-[34px] rounded-lg pl-1">
                            <IconButton
                                title="Open User Menu"
                                variant="profile"
                                className="!border-none !bg-transparent [&_svg]:!h-3.5 [&_svg]:!w-3.5"
                            />
                        </span>
                    </span>
                </DropdownToggle>
                {!showTutorial && (
                    <DropdownMenu
                        className={twMerge(
                            "two-col:p-[18px_0px] border-borderLine left-auto right-0 mt-1 w-[275px] rounded-lg rounded-t rounded-bl rounded-br border border-solid shadow-none",
                            styles["dropdown-menu"]
                        )}
                    >
                        <ProfileMenuContent
                            profile={profile}
                            walletMenuOption={walletMenuOption}
                            onToggleLanguageModal={onToggleLanguageModal}
                            handleToggle={handleToggle}
                            toggleTutorialState={toggleTutorialState}
                            onShowAboutUsModal={onShowAboutUsModal}
                            isMobile={false}
                            t={t}
                            onNavigateToBoards={onNavigateToBoards}
                            onNavigateToWidgets={onNavigateToWidgets}
                        />
                    </DropdownMenu>
                )}
            </Dropdown>
        );
    }
);

// Main wrapper component that delegates to mobile or desktop version
const ProfileMenuWrapper: React.FC<IProps> = ({
    isMobile = false,
    ...props
}) => {
    if (isMobile) {
        return <ProfileMenuMobile {...props} isMobile />;
    }
    return <ProfileMenuDesktop {...props} />;
};

export default ProfileMenuWrapper;
