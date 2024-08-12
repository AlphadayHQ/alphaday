import { EventClickArg, DatesSetArg } from "@fullcalendar/core";
import { Disclosure, Transition } from "@headlessui/react";
import { useLayer } from "react-laag";
import { twMerge } from "tailwind-merge";
import { Arrow } from "./src/components/arrow/Arrow";
import {
    BaseModuleWrapper,
    BaseModuleBody,
    BaseModuleHeader,
    BaseModuleOptionsFooter,
} from "./src/components/base/BaseComponents";
import { BoardPreview } from "./src/components/board-preview/BoardPreview";
import { Button } from "./src/components/buttons/Button";
import { IconButton } from "./src/components/buttons/IconButton";
import { NavTabButton } from "./src/components/buttons/NavTabButton";
import { TabButton } from "./src/components/buttons/TabButton";
import { ViewTabButton } from "./src/components/buttons/ViewTabButton";
import { CalendarList } from "./src/components/calendar/CalendarList";
import { CalendarMonth } from "./src/components/calendar/CalendarMonth";
import { TDatePos } from "./src/components/calendar/event";
import { Carousel } from "./src/components/carousel/Carousel";
import { CarouselImage } from "./src/components/carousel/CarouselImage";
import { Lightbox } from "./src/components/carousel/Lightbox";
import { CenteredBlock } from "./src/components/CenteredBlock";
import {
    ApexAreaChart,
    ApexBarChart,
    ApexCandleChart,
    ApexDonutChart,
    ApexLineChart,
    ApexPieChart,
    ApexRadialChart,
} from "./src/components/charts/apexchart";
import { ChatForm } from "./src/components/chat/ChatForm";
import { Dialog } from "./src/components/dialog/Dialog";
import { MiniDialog } from "./src/components/dialog/MiniDialog";
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
import { SortBy } from "./src/components/dropdown/SortBy";
import { FadeIn } from "./src/components/fade-in-out/FadeIn";
import { Input } from "./src/components/input/Input";
import Footer from "./src/components/layout/Footer";
import {
    HeaderWrapper,
    HeaderNavbar,
    HeaderNavRight,
    HeaderNavElement,
} from "./src/components/layout/Header";
import Logo from "./src/components/layout/Logo";
import { CollapseListItem } from "./src/components/listItem/CollapseListItem";
import {
    ListItem,
    HRElement,
    listItemVariants,
} from "./src/components/listItem/ListItem";
import { ErrorModal } from "./src/components/modal/ErrorModal";
import { FullPageModal } from "./src/components/modal/FullPageModal";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalTitle,
    ModalFooter,
} from "./src/components/modal/Modal";
import { ModulePreview } from "./src/components/module-preview/ModulePreview";
import { ModuleLoader } from "./src/components/moduleLoader/ModuleLoader";
import { Overlay } from "./src/components/overlay/Overlay";
import { ScrollBar } from "./src/components/scrollbar/ScrollBar";
import { SearchBar } from "./src/components/search/Searchbar";
import { ChannelSkeleton } from "./src/components/skeletons/ChannelSkeleton";
import { ItemSkeleton } from "./src/components/skeletons/ItemSkeleton";
import { Skeleton } from "./src/components/skeletons/Skeleton";
import { Spinner } from "./src/components/spinner/Spinner";
import { Switch } from "./src/components/switch/Switch";
import SyncIndicator, {
    EIndicatorState,
} from "./src/components/syncIndicator/SyncIndicator";
import { KeyValueTable } from "./src/components/table/KeyValueTable";
import { TabsBar } from "./src/components/tabs/TabsBar";
import { TextOverlay } from "./src/components/text-overlay/TextOverlay";
import { Timer } from "./src/components/timer/Timer";
import { Toggle } from "./src/components/toggle/Toggle";
import { CalendarTooltip } from "./src/components/tooltip/CalendarTooltip";
import {
    ViewTabMenu,
    TViewTabMenuOption,
} from "./src/components/view-tab-menu/ViewTabMenu";
import { breakpoints } from "./src/globalStyles/breakpoints";
import { themeColors } from "./src/globalStyles/themes";
import { OutlineButton } from "./src/mobile-components/button/buttons";
import { Pager } from "./src/mobile-components/pager/Pager";
import { DropdownSelect } from "./src/mobile-components/select/DropdownSelect";

export type { TViewTabMenuOption, DatesSetArg, EventClickArg, TDatePos };
export * from "./src/mobile-components/form-elements/FormElements";
export {
    ApexAreaChart,
    ApexBarChart,
    ApexCandleChart,
    ApexDonutChart,
    ApexLineChart,
    ApexPieChart,
    ApexRadialChart,
    Arrow,
    CalendarList,
    CalendarMonth,
    CalendarTooltip,
    themeColors,
    breakpoints,
    listItemVariants,
    Button,
    IconButton,
    NavTabButton,
    TabButton,
    ViewTabButton,
    Carousel,
    CarouselImage,
    Lightbox,
    Timer,
    Toggle,
    ErrorModal,
    FullPageModal,
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
    ViewTabMenu,
    EViewDialogState,
    ShareViewDialog,
    ViewDialog,
    Dialog,
    TextOverlay,
    Modal,
    ModalHeader,
    ModalBody,
    ModalTitle,
    ModalFooter,
    Input,
    ModuleLoader,
    ListItem,
    CenteredBlock,
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
    Switch,
    ModulePreview,
    BoardPreview,
    ChannelSkeleton,
    ItemSkeleton,
    Skeleton,
    CollapseListItem,
    KeyValueTable,
    Overlay,
    ChatForm,
    FadeIn,
    TabsBar,
    SortBy,
    /**
     * Mobile-only components
     */
    Pager,
    Disclosure,
    Transition,
    MiniDialog,
    OutlineButton,
    DropdownSelect,
};
