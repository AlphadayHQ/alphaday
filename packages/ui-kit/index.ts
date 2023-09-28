import { useLayer } from "react-laag";
import { twMerge } from "tailwind-merge";
import {
    BaseModuleWrapper,
    BaseModuleBody,
    BaseModuleHeader,
    BaseModuleOptionsFooter,
} from "./src/components/base/BaseComponents";
import { Button } from "./src/components/buttons/Button";
import { IconButton } from "./src/components/buttons/IconButton";
import { NavTabButton } from "./src/components/buttons/NavTabButton";
import { TabButton } from "./src/components/buttons/TabButton";
import { ViewTabButton } from "./src/components/buttons/ViewTabButton";
import { Dialog } from "./src/components/dialog/Dialog";
import { ShareViewDialog } from "./src/components/dialog/ShareViewDialog";
import {
    ViewDialog,
    EViewDialogState,
} from "./src/components/dialog/ViewDialog";
import {
    Dropdown,
    DropdownAvatar,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
} from "./src/components/dropdown/dropdown";
import { Input } from "./src/components/input/Input";
import Footer from "./src/components/layout/Footer";
import {
    HeaderWrapper,
    HeaderNavbar,
    HeaderNavRight,
    HeaderNavElement,
} from "./src/components/layout/Header";
import Logo from "./src/components/layout/Logo";
import {
    ListItem,
    HRElement,
    listItemVariants,
} from "./src/components/listItem/ListItem";

import { NoItems } from "./src/components/listItem/NoItems";
import { Modal } from "./src/components/modal/Modal";
import { ModulePreview } from "./src/components/module-preview/ModulePreview";
import { ModuleLoader } from "./src/components/moduleLoader/ModuleLoader";
import { ScrollBar } from "./src/components/scrollbar/ScrollBar";
import { SearchBar } from "./src/components/search/Searchbar";
import { Spinner } from "./src/components/spinner/Spinner";
import { SwitchWrap } from "./src/components/switchWrap/SwitchWrap";
import SyncIndicator, {
    EIndicatorState,
} from "./src/components/syncIndicator/SyncIndicator";
import {
    ViewTabMenu,
    TViewTabMenuOption,
} from "./src/components/view-tab-menu/ViewTabMenu";
import { breakpoints } from "./src/globalStyles/breakpoints";
import { themeColors } from "./src/globalStyles/themes";

export type { TViewTabMenuOption };
export {
    themeColors,
    breakpoints,
    listItemVariants,
    Button,
    IconButton,
    NavTabButton,
    TabButton,
    ViewTabButton,
    Footer,
    Logo,
    HeaderWrapper,
    HeaderNavbar,
    HeaderNavRight,
    HeaderNavElement,
    BaseModuleWrapper,
    BaseModuleBody,
    BaseModuleHeader,
    BaseModuleOptionsFooter,
    ScrollBar,
    SearchBar,
    SwitchWrap,
    ViewTabMenu,
    EViewDialogState,
    ShareViewDialog,
    ViewDialog,
    Dialog,
    Modal,
    Input,
    ModuleLoader,
    ListItem,
    NoItems,
    HRElement,
    twMerge,
    useLayer,
    SyncIndicator,
    EIndicatorState,
    Dropdown,
    DropdownAvatar,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    Spinner,
    ModulePreview,
};
