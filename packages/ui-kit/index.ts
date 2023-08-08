import { useLayer } from "react-laag";
import {
    BaseModuleWrapper,
    BaseModuleBody,
    BaseModuleHeader,
    BaseModuleOptionsFooter,
} from "src/components/base/BaseComponents";
import { Button } from "src/components/buttons/Button";
import { NavTabButton } from "src/components/buttons/NavTabButton";
import { TabButton } from "src/components/buttons/TabButton";
import { Dialog } from "src/components/dialog/Dialog";
import Footer from "src/components/layout/Footer";
import {
    HeaderWrapper,
    HeaderNavbar,
    HeaderNavRight,
    HeaderNavElement,
} from "src/components/layout/Header";
import Logo from "src/components/layout/Logo";

import { Modal } from "src/components/modal/Modal";
import { ScrollBar } from "src/components/scrollbar/ScrollBar";
import { SearchBar } from "src/components/search/Searchbar";
import SyncIndicator, {
    EIndicatorState,
} from "src/components/syncIndicator/SyncIndicator";
import { breakpoints } from "src/globalStyles/breakpoints";
import { twMerge } from "tailwind-merge";
import { themes } from "src/globalStyles";

export {
    themes,
    breakpoints,
    Button,
    NavTabButton,
    TabButton,
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
    Dialog,
    Modal,
    twMerge,
    useLayer,
    SyncIndicator,
    EIndicatorState,
};
