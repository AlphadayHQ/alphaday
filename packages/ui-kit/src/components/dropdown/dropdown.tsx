import {
    Children,
    FC,
    ReactChild,
    ReactText,
    useState,
    useCallback,
    useEffect,
    useRef,
    FunctionComponent,
    useMemo,
} from "react";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";
import { twMerge } from "tailwind-merge";
import { useClickOutside } from "src/hooks";
import { AnchorElement } from "../anchor/AlphaLink";

type IChild = Exclude<ReactChild, ReactText>;

interface DropdownProps {
    /**
     * Required. Default is `down`.
     */
    direction: "up" | "down" | "left" | "right";
    className?: string;
    children?: React.ReactNode;
}

export const Dropdown: FC<DropdownProps> = ({
    children,
    direction,
    className,
    ...restProps
}) => {
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow((prev) => !prev);
    };
    const onClose = useCallback(() => {
        setShow(false);
    }, []);

    const containerRef = useClickOutside<HTMLDivElement>(onClose);

    const RenderChild = Children.map(children, (el) => {
        const child = el as IChild;
        if (child !== null) {
            const childType = child?.type as FunctionComponent;
            const name = childType.displayName || childType.name;
            if (name === "DropdownToggle") {
                return <child.type {...child.props} onClick={handleClick} />;
            }
            if (name === "DropdownMenu") {
                return (
                    <child.type
                        {...child.props}
                        direction={direction}
                        show={show}
                    />
                );
            }
        }
        return null;
    });

    return (
        <div
            {...restProps}
            className={twMerge("relative", className, "dropdown")}
            ref={containerRef}
        >
            {RenderChild}
        </div>
    );
};

export const DropdownAvatar: FC = () => {
    return (
        <div className="relative h-16 w-16 rounded-full">
            <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-full text-[15px] font-bold uppercase leading-[100%] text-white">
                <div>
                    <UserSVG className="w-6" />
                </div>
            </div>
        </div>
    );
};

export const DropdownToggle: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <button
            aria-label="DropdownToggle"
            type="button"
            className="inline-flex cursor-pointer select-none items-center justify-center border border-solid border-[none] border-transparent bg-transparent p-0 text-center align-middle font-normal leading-normal transition-all hover:outline-none focus:outline-none active:outline-none"
        >
            {children}
        </button>
    );
};

interface IDropMenu {
    show?: boolean;
    direction?: "up" | "down" | "left" | "right";
    className?: string;
    children?: React.ReactNode;
}

interface IMenuMeasure {
    clientWidth: number;
    clientHeight: number;
    clientLeft: number;
    clientTop: number;
    offsetWidth: number;
    offsetHeight: number;
    offsetLeft: number;
    offsetTop: number;
}

const dropdownDirection = {
    up: "mb-0.5 left-0 bottom-full",
    down: "mt-0.5 left-0 top-full",
    left: "mr-0.5 left-0 top-0",
    right: "mr-0.5 left-0 top-0",
};

export const DropdownMenu: FC<IDropMenu> = ({
    children,
    show,
    direction,
    className,
    ...restProps
}) => {
    const [menuMeasure, setMenuMeasure] = useState<IMenuMeasure>({
        clientWidth: 0,
        clientHeight: 0,
        clientLeft: 0,
        clientTop: 0,
        offsetWidth: 0,
        offsetHeight: 0,
        offsetLeft: 0,
        offsetTop: 0,
    });
    const menuRef: React.Ref<HTMLDivElement> = useRef(null);

    useEffect(() => {
        setMenuMeasure((prev) => {
            return {
                ...prev,
                clientWidth: menuRef?.current?.clientWidth || 0,
                clientHeight: menuRef?.current?.clientHeight || 0,
                clientLeft: menuRef?.current?.clientLeft || 0,
                clientTop: menuRef?.current?.clientTop || 0,
                offsetWidth: menuRef?.current?.offsetWidth || 0,
                offsetHeight: menuRef?.current?.offsetHeight || 0,
                offsetLeft: menuRef?.current?.offsetLeft || 0,
                offsetTop: menuRef?.current?.offsetTop || 0,
            };
        });
    }, [show]);

    const directionSyles = useMemo(() => {
        if (direction === "left") {
            return {
                transform: `translate3d(-${menuMeasure.offsetWidth}px, 0px, 0px)`,
            };
        }
        if (direction === "right") {
            return {
                transform: `translate3d(${menuMeasure.offsetWidth}px, 0px, 0px)`,
            };
        }
        return {};
    }, [direction, menuMeasure]);

    return (
        <div
            ref={menuRef}
            style={directionSyles}
            className={twMerge(
                "text-primary bg-backgroundVariant100 absolute z-[1000] float-left hidden min-w-[10rem] rounded bg-clip-padding p-[5px] text-left text-sm shadow-[0_0_8px_2px_rgb(28_39_60_/_4%)] will-change-transform",
                show && "block",
                className,
                dropdownDirection[direction || "down"]
            )}
            {...restProps}
        >
            {children}
        </div>
    );
};

DropdownMenu.displayName = "DropdownMenu";

interface IDropItem {
    path: string;
    className?: string;
    active?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const DropdownItem: FC<IDropItem> = ({
    children,
    path,
    className,
    active,
    onClick,
}) => (
    <AnchorElement
        path={path}
        onClick={onClick}
        className={twMerge(
            "text-primary hover:bg-primary hover:text-backgroundVariant400 clear-both block w-full whitespace-nowrap border-0 bg-transparent px-[15px] py-1.5 font-normal transition-all duration-[0.2s] ease-[ease-in-out]",
            active && "bg-primary hover:bg-primary text-white hover:text-white",
            className
        )}
    >
        {children}
    </AnchorElement>
);
