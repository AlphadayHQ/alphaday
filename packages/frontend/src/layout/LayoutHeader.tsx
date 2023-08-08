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
import { useWindowSize } from "src/api/hooks";
import { ReactComponent as Close2 } from "src/assets/icons/close2.svg";
import { ReactComponent as MenuMobile } from "src/assets/icons/menuMobile.svg";
// import NotificationDropdownContainer from "src/containers/header/notification-dropdown/NotificationDropdownContainer";
// import ProfileDropdownContainer from "src/containers/header/profile-dropdown/ProfileDropdownContainer";
// import SyncIndicatorContainer from "src/containers/header/SyncIndicatorContainer";
// import HeaderSearchContainer from "src/containers/search/HeaderSearchContainer";
// import ViewsTabContainer from "src/containers/views-tab/ViewsTabContainer";

interface IProps {
    hideFeatures: boolean;
    toggleWidgetLib: (() => void) | undefined;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const LayoutHeader: FC<IProps> = ({
    hideFeatures,
    toggleWidgetLib,
    setTutFocusElemRef,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [boardsLibOpen, setBoardsLibOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const handleMobileOpen = () => setMobileOpen((prev) => !prev);
    const toggleBoardsLib = () => {
        setBoardsLibOpen((isOpen) => {
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
        <div ref={headerRef}>
            {width >= breakpoints.TwoColMinWidth ? (
                <HeaderWrapper
                    data-testid="header-nav"
                    className={boardsLibOpen ? "static mb-[-110px]" : ""}
                >
                    <HeaderNavbar>
                        <Logo />
                        {!hideFeatures && (
                            <>
                                {/* <StyledSearch>
                                    <HeaderSearchContainer />
                                </StyledSearch> */}
                                <HeaderNavRight className="p-0">
                                    <HeaderNavElement className="mr-[15px]">
                                        {/* <SyncIndicatorContainer /> */}
                                    </HeaderNavElement>
                                    <HeaderNavElement className="mr-[15px]">
                                        <NavTabButton
                                            variant="views"
                                            open={false}
                                            uppercase={false}
                                            onClick={toggleBoardsLib}
                                            title="Open Boards Library"
                                        >
                                            Boards
                                        </NavTabButton>
                                    </HeaderNavElement>
                                    <span
                                        ref={(ref) =>
                                            setTutFocusElemRef &&
                                            ref &&
                                            setTutFocusElemRef(ref)
                                        }
                                    >
                                        <HeaderNavElement>
                                            <NavTabButton
                                                variant="modules"
                                                open={false}
                                                uppercase={false}
                                                onClick={toggleWidgetLib}
                                                title="Open Widget Library"
                                            >
                                                Widgets
                                            </NavTabButton>
                                        </HeaderNavElement>
                                    </span>

                                    {/* <NotificationDropdownContainer
                                        ml={[
                                            "8px",
                                            "15px",
                                            "15px",
                                            "15px",
                                            "30px",
                                        ]}
                                    /> */}
                                    <HeaderNavElement className="oneCol:ml-[15px] ml-[8px] mr-[15px]">
                                        {/* <ProfileDropdownContainer /> */}
                                    </HeaderNavElement>
                                </HeaderNavRight>
                            </>
                        )}
                    </HeaderNavbar>
                    {/* {!hideFeatures && (
                        <ViewsTabContainer
                            headerRef={headerRef}
                            boardsLibOpen={boardsLibOpen}
                            toggleBoardsLib={toggleBoardsLib}
                            handleMobileOpen={handleMobileOpen}
                        />
                    )} */}
                </HeaderWrapper>
            ) : (
                <HeaderWrapper
                    className={boardsLibOpen ? "static mb-[-110px]" : ""}
                >
                    <HeaderNavbar mobileOpen={mobileOpen}>
                        <div className="flex w-full flex-row items-center justify-between">
                            <Logo />
                            {!hideFeatures && (
                                <HeaderNavRight>
                                    {mobileOpen ? (
                                        <Close2
                                            onClick={handleMobileOpen}
                                            className="-mt-0.5"
                                        />
                                    ) : (
                                        <MenuMobile
                                            className="-mt-0.5"
                                            onClick={handleMobileOpen}
                                        />
                                    )}
                                </HeaderNavRight>
                            )}
                        </div>
                        {mobileOpen && (
                            <div className="mx-2.5 my-auto flex w-full flex-row items-center justify-center">
                                {/* <HeaderSearchContainer /> */}
                            </div>
                        )}
                        {mobileOpen && (
                            <h3 className="twoCol:pl-[15px] twoCol:pb-0 pb-0 pl-3 pr-0 pt-2.5 text-sm">
                                Boards
                            </h3>
                        )}

                        {/* {mobileOpen && (
                            <ViewsTabContainer
                                mobileOpen
                                boardsLibOpen={boardsLibOpen}
                                toggleBoardsLib={toggleBoardsLib}
                                headerRef={headerRef}
                                handleMobileOpen={handleMobileOpen}
                            />
                        )} */}

                        {!hideFeatures && (
                            <HeaderNavRight>
                                {width > breakpoints.TwoColMinWidth && (
                                    <>
                                        {/* <NotificationDropdownContainer
                                            ml={["8px", "1px", "1px", "15px"]}
                                        /> */}
                                        <HeaderNavElement className="oneCol:ml-[15px] ml-[8px]">
                                            {/* <ProfileDropdownContainer /> */}
                                        </HeaderNavElement>
                                    </>
                                )}
                            </HeaderNavRight>
                        )}
                    </HeaderNavbar>
                </HeaderWrapper>
            )}
        </div>
    );
};

export default LayoutHeader;
