import { useEffect, useState } from "react";
import {
    Dropdown,
    DropdownAvatar,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    IconButton,
    twMerge,
} from "@alphaday/ui-kit";
import { Logger } from "src/api/utils/logging";
import CONFIG from "src/config";
import globalMessages from "src/globalMessages";
import styles from "./ProfileDropdownWrapper.module.scss";
// TODO (xavier-charles): wallet view button

interface IProps {
    onSignOut: () => MaybeAsync<void>;
    onSignUpSignIn: () => MaybeAsync<void>;
    isAuthenticated: boolean;
    onShowTutorial: (s: boolean) => void;
    showTutorial: boolean | undefined;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const Divider = () => (
    <div className="border-borderLine m-0 h-0 border-t border-solid" />
);

const ProfileDropdownWrapper: React.FC<IProps> = ({
    onSignOut,
    onSignUpSignIn,
    onShowTutorial,
    showTutorial,
    isAuthenticated,
    setTutFocusElemRef,
}) => {
    const [toggleState, setToggleState] = useState(false);

    const handleToggle = () => {
        setToggleState((prev) => !prev);
        setTimeout(() => {
            onShowTutorial(true);
        }, 500);
    };

    const walletMenuOption = isAuthenticated
        ? {
              handler: onSignOut,
              menuTitle: "Sign Out",
              title: "Sign Out",
              dataTestId: "profile-dropdown-sign-out",
          }
        : {
              handler: onSignUpSignIn,
              menuTitle: "Sign Up / Sign In",
              title: globalMessages.portfolio.signUp,
              dataTestId: "profile-dropdown-sign-up",
          };

    useEffect(() => {
        if (!showTutorial) setToggleState(false);
    }, [showTutorial]);

    return (
        <Dropdown direction="down" data-testid="profile-dropdown">
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
                        "two-col:p-[18px_0px] border-borderLine left-auto right-0 mt-1 w-[275px] rounded-lg rounded-t-none rounded-bl rounded-br border border-solid shadow-none",
                        styles["dropdown-menu"]
                    )}
                >
                    <div className="mx-2">
                        <div className="flex justify-between px-2 pb-5 pt-0">
                            <DropdownAvatar />
                        </div>
                        <Divider />
                        <DropdownItem
                            key={walletMenuOption.dataTestId}
                            data-testid={walletMenuOption.dataTestId}
                            onClick={() => {
                                walletMenuOption.handler()?.catch((err) => {
                                    Logger.error(
                                        "profile-dropdown:ProfileDropdownWrapper",
                                        err
                                    );
                                });
                            }}
                        >
                            <span title={walletMenuOption.title}>
                                {walletMenuOption.menuTitle}
                            </span>
                        </DropdownItem>
                        <Divider />
                        <DropdownItem onClick={handleToggle}>
                            Tutorial{" "}
                            <input
                                title="Toggle Tutorial"
                                type="checkbox"
                                className={styles.toggle}
                                onChange={handleToggle}
                                checked={toggleState}
                            />
                        </DropdownItem>
                        <Divider />
                        {CONFIG.APP.VERSION && CONFIG.APP.COMMIT && (
                            <DropdownItem className="hover:bg-background pb-0 pt-5">
                                <div className="fontGroup-mini w-full">
                                    Version: {CONFIG.APP.VERSION}
                                    <br />
                                    Commit: {CONFIG.APP.COMMIT}
                                </div>
                            </DropdownItem>
                        )}
                    </div>
                </DropdownMenu>
            )}
        </Dropdown>
    );
};

export default ProfileDropdownWrapper;
