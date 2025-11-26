import { FC, useState, useRef } from "react";
import {
    HeaderWrapper,
    Logo,
    NavTabButton,
    breakpoints,
    HeaderNavRight,
    HeaderNavElement,
    HeaderNavbar,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useWindowSize, useRecipes } from "src/api/hooks";
import { ReactComponent as Close2 } from "src/assets/icons/close2.svg";
import { ReactComponent as MenuMobile } from "src/assets/icons/menuMobile.svg";
// import NotificationDropdownContainer from "src/containers/header/notification-dropdown/NotificationDropdownContainer";
import ProfileMenuContainer from "src/containers/header/profile-menu/ProfileMenuContainer";
import SyncIndicatorContainer from "src/containers/header/SyncIndicatorContainer";
import HeaderSearchContainer from "src/containers/search/HeaderSearchContainer";
import ViewsTabContainer from "src/containers/views-tab/ViewsTabContainer";

interface IProps {
    hideFeatures: boolean;
    toggleWidgetLib: (() => void) | undefined;
    toggleLanguageModal: (() => void) | undefined;
    toggleRecipeLibrary: (() => void) | undefined;
    isBoardsLibOpen: boolean;
    setIsBoardsLibOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const LayoutHeader: FC<IProps> = ({
    hideFeatures,
    toggleWidgetLib,
    toggleLanguageModal,
    toggleRecipeLibrary,
    setTutFocusElemRef,
    isBoardsLibOpen,
    setIsBoardsLibOpen,
}) => {
    const { t } = useTranslation();
    const { enabled: isRecipesEnabled } = useRecipes();

    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const handleMobileOpen = () => setMobileOpen((prev) => !prev);
    const toggleBoardsLib = () => {
        setIsBoardsLibOpen((isOpen) => {
            /**
             * We need to scroll to the top of the header
             * only when the boards library is not opened.
             */
            if (!isOpen && headerRef.current !== null) {
                // this read/scrollTo would only happen when the boards library is not opened
                // this is to reduce layout reflows
                window.scrollTo(0, headerRef.current.offsetTop);
            }
            return !isOpen;
        });
    };
    const { width } = useWindowSize();

    return (
        <div ref={headerRef} className="z-10 relative">
            {width >= breakpoints.TwoColMinWidth ? (
                <HeaderWrapper
                    data-testid="header-nav"
                    className={isBoardsLibOpen ? "static mb-[-110px]" : ""}
                >
                    <HeaderNavbar>
                        <Logo />
                        {!hideFeatures && (
                            <>
                                <div className="z-20 two-col:w-[404px] three-col:w-[524px] order-2 flex w-[300px] flex-1 items-center justify-center">
                                    <HeaderSearchContainer />
                                </div>
                                <HeaderNavRight className="p-0">
                                    <HeaderNavElement className="mx-3">
                                        <SyncIndicatorContainer />
                                    </HeaderNavElement>
                                    {isRecipesEnabled && (
                                        <HeaderNavElement className="mr-1 three-col:mr-3 [&_svg]:fill-none hidden two-col:block [&_span]:hidden three-col:[&_span]:block [&_svg]:mr-0 three-col:[&_svg]:mr-1.5">
                                            <NavTabButton
                                                variant="recipes"
                                                open={false}
                                                uppercase={false}
                                                onClick={toggleRecipeLibrary}
                                                title={t("navigation.recipes")}
                                            >
                                                <span>
                                                    {t("navigation.recipes")}
                                                </span>
                                            </NavTabButton>
                                        </HeaderNavElement>
                                    )}
                                    <HeaderNavElement className="mr-1 three-col:mr-3 [&_svg]:fill-none hidden two-col:block [&_span]:hidden three-col:[&_span]:block [&_svg]:mr-0 three-col:[&_svg]:mr-1.5">
                                        <NavTabButton
                                            variant="language"
                                            open={false}
                                            uppercase={false}
                                            onClick={toggleLanguageModal}
                                            title={t(
                                                "navigation.changeLanguage"
                                            )}
                                        >
                                            <span>
                                                {t("navigation.menu.language")}
                                            </span>
                                        </NavTabButton>
                                    </HeaderNavElement>
                                    <HeaderNavElement className="mr-1 [&_span]:hidden three-col:[&_span]:block [&_svg]:mr-0 three-col:[&_svg]:mr-1.5">
                                        <NavTabButton
                                            variant="views"
                                            open={false}
                                            uppercase={false}
                                            onClick={toggleBoardsLib}
                                            title={t(
                                                "navigation.openBoardsLibrary"
                                            )}
                                        >
                                            <span>
                                                {t("navigation.boards")}
                                            </span>
                                        </NavTabButton>
                                    </HeaderNavElement>
                                    <span
                                        ref={(ref) =>
                                            setTutFocusElemRef &&
                                            ref &&
                                            setTutFocusElemRef(ref)
                                        }
                                    >
                                        <HeaderNavElement className="[&_span]:hidden three-col:[&_span]:block [&_svg]:mr-0 three-col:[&_svg]:mr-1.5">
                                            <NavTabButton
                                                variant="modules"
                                                open={false}
                                                uppercase={false}
                                                onClick={toggleWidgetLib}
                                                title={t(
                                                    "navigation.openWidgetsLibrary"
                                                )}
                                            >
                                                <span>
                                                    {t("navigation.widgets")}
                                                </span>
                                            </NavTabButton>
                                        </HeaderNavElement>
                                    </span>

                                    {/* <NotificationDropdownContainer
                                        ml={[
                                            "8px",
                                            "16px",
                                            "16px",
                                            "16px",
                                            "30px",
                                        ]}
                                    /> */}
                                    <HeaderNavElement className="single-col:ml-1 ml-[8px] mr-4">
                                        <ProfileMenuContainer />
                                    </HeaderNavElement>
                                </HeaderNavRight>
                            </>
                        )}
                    </HeaderNavbar>
                    {!hideFeatures && (
                        <ViewsTabContainer
                            headerRef={headerRef}
                            isBoardsLibOpen={isBoardsLibOpen}
                            onToggleBoardsLib={toggleBoardsLib}
                            handleMobileOpen={handleMobileOpen}
                        />
                    )}
                </HeaderWrapper>
            ) : (
                <HeaderWrapper
                    className={isBoardsLibOpen ? "static mb-[-110px]" : ""}
                >
                    <HeaderNavbar mobileOpen={mobileOpen}>
                        <div className="flex w-full flex-row items-center justify-between py-4">
                            <Logo />
                            {!hideFeatures && (
                                <HeaderNavRight>
                                    {mobileOpen ? (
                                        <Close2
                                            onClick={handleMobileOpen}
                                            className="-mt-0.5 cursor-pointer"
                                        />
                                    ) : (
                                        <MenuMobile
                                            className="-mt-0.5 cursor-pointer"
                                            onClick={handleMobileOpen}
                                        />
                                    )}
                                </HeaderNavRight>
                            )}
                        </div>
                        {mobileOpen && (
                            <>
                                <div className="mx-2.5 my-auto flex w-full flex-row items-center justify-center">
                                    <HeaderSearchContainer />
                                </div>

                                {/* <h3 className="two-col:pl-4 two-col:pb-0 pb-0 pl-3 pr-0 pt-2.5 fontGroup-highlightSemi">
                                    {t("navigation.boards")}
                                </h3> */}

                                <ProfileMenuContainer isMobile />

                                {/* <ViewsTabContainer
                                    mobileOpen
                                    isBoardsLibOpen={isBoardsLibOpen}
                                    onToggleBoardsLib={toggleBoardsLib}
                                    headerRef={headerRef}
                                    handleMobileOpen={handleMobileOpen}
                                /> */}
                            </>
                        )}

                        <HeaderNavRight
                            className={`hidden two-col:${
                                hideFeatures ? "hidden" : "flex"
                            }`}
                        >
                            {width > breakpoints.TwoColMinWidth && (
                                <>
                                    {/* <NotificationDropdownContainer
                                            ml={["8px", "1px", "1px", "16px"]}
                                        /> */}
                                    <HeaderNavElement className="single-col:ml-4 ml-[8px]">
                                        <ProfileMenuContainer />
                                    </HeaderNavElement>
                                </>
                            )}
                        </HeaderNavRight>
                    </HeaderNavbar>
                </HeaderWrapper>
            )}
        </div>
    );
};

export default LayoutHeader;
