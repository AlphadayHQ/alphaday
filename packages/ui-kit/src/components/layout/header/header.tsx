import { FC, useState, useRef } from "react";
// import { alphaBreakpoints } from "@doar/shared/styled";
import Close2 from "src/assets/svg/close2.svg";
import MenuMobile from "src/assets/svg/menuMobile.svg";
// import NotificationDropdownContainer from "src/containers/header/notification-dropdown/NotificationDropdownContainer";
// import ProfileDropdownContainer from "src/containers/header/profile-dropdown/ProfileDropdownContainer";
// import SyncIndicatorContainer from "src/containers/header/SyncIndicatorContainer";
// import HeaderSearchContainer from "src/containers/search/HeaderSearchContainer";
// import ViewsTabContainer from "src/containers/views-tab/ViewsTabContainer";
import { useWindowSize } from "../../api/hooks";
import Logo from "../../components/logo";

import {
    StyledHeader,
    StyledSearch,
    StyledLogo,
    StyleNavbarRight,
    StyledNavbarElement,
    StyledWrapper,
} from "./header.style";
import { breakpoints } from "../../../globalStyles/breakpoints";

interface IProps {
    hideFeatures: boolean;
    toggleWidgetLib: (() => void) | undefined;
    setTutFocusElemRef?:
        | React.Dispatch<React.SetStateAction<HTMLElement | null>>
        | undefined;
}

const Header: FC<IProps> = ({
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
                <StyledWrapper
                    data-testid="header-nav"
                    $boardsLibOpen={boardsLibOpen}
                >
                    <StyledHeader>
                        <StyledLogo>
                            <Logo />
                        </StyledLogo>
                        {!hideFeatures && (
                            <>
                                <StyledSearch>
                                    {/* <HeaderSearchContainer /> */}
                                </StyledSearch>
                                <StyleNavbarRight style={{ padding: 0 }}>
                                    <StyledNavbarElement mr={["15px"]}>
                                        {/* <SyncIndicatorContainer /> */}
                                    </StyledNavbarElement>
                                    <StyledNavbarElement mr={["15px"]}>
                                        <NavTabButton
                                            variant="views"
                                            open={false}
                                            uppercase={false}
                                            onClick={toggleBoardsLib}
                                            title="Open Boards Library"
                                        >
                                            Boards
                                        </NavTabButton>
                                    </StyledNavbarElement>
                                    <span
                                        ref={(ref) =>
                                            setTutFocusElemRef &&
                                            ref &&
                                            setTutFocusElemRef(ref)
                                        }
                                    >
                                        <StyledNavbarElement>
                                            <AlphaNavTabButton
                                                variant="modules"
                                                open={false}
                                                uppercase={false}
                                                onClick={toggleWidgetLib}
                                                title="Open Widget Library"
                                            >
                                                Widgets
                                            </AlphaNavTabButton>
                                        </StyledNavbarElement>
                                    </span>

                                    <NotificationDropdownContainer
                                        ml={[
                                            "8px",
                                            "15px",
                                            "15px",
                                            "15px",
                                            "30px",
                                        ]}
                                    />
                                    <StyledNavbarElement
                                        ml={["8px", "15px", "15px", "15px"]}
                                        mr={["15px"]}
                                    >
                                        <ProfileDropdownContainer />
                                    </StyledNavbarElement>
                                </StyleNavbarRight>
                            </>
                        )}
                    </StyledHeader>
                    {!hideFeatures && (
                        <ViewsTabContainer
                            headerRef={headerRef}
                            boardsLibOpen={boardsLibOpen}
                            toggleBoardsLib={toggleBoardsLib}
                            handleMobileOpen={handleMobileOpen}
                        />
                    )}
                </StyledWrapper>
            ) : (
                <StyledWrapper $boardsLibOpen={boardsLibOpen}>
                    <StyledHeader mobileOpen={mobileOpen}>
                        <div className="wrap">
                            <StyledLogo>
                                <Logo />
                            </StyledLogo>
                            {!hideFeatures && (
                                <StyleNavbarRight>
                                    {mobileOpen ? (
                                        <Close2
                                            style={{ marginTop: "-2px" }}
                                            onClick={handleMobileOpen}
                                        />
                                    ) : (
                                        <MenuMobile
                                            style={{ marginTop: "-2px" }}
                                            onClick={handleMobileOpen}
                                        />
                                    )}
                                </StyleNavbarRight>
                            )}
                        </div>
                        {mobileOpen && (
                            <div className="wrap center">
                                <HeaderSearchContainer />
                            </div>
                        )}
                        {mobileOpen && <h3 className="boards">Boards</h3>}

                        {mobileOpen && (
                            <ViewsTabContainer
                                mobileOpen
                                boardsLibOpen={boardsLibOpen}
                                toggleBoardsLib={toggleBoardsLib}
                                headerRef={headerRef}
                                handleMobileOpen={handleMobileOpen}
                            />
                        )}

                        {!hideFeatures && (
                            <StyleNavbarRight>
                                {width > alphaBreakpoints.TwoColMinWidth && (
                                    <>
                                        <NotificationDropdownContainer
                                            ml={["8px", "1px", "1px", "15px"]}
                                        />
                                        <StyledNavbarElement
                                            ml={["8px", "1px", "1px", "15px"]}
                                        >
                                            <ProfileDropdownContainer />
                                        </StyledNavbarElement>
                                    </>
                                )}
                            </StyleNavbarRight>
                        )}
                    </StyledHeader>
                </StyledWrapper>
            )}
        </div>
    );
};

export default Header;
