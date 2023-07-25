import { Children, FC, FunctionComponent, ReactElement } from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
    className?: string;
    children?: React.ReactNode;
}

interface IListGroup extends IProps {
    flush?: boolean;
    horizontal?: boolean;
}

export const ListGroup: FC<IListGroup> = ({
    className,
    children,
    flush,
    horizontal,
    ...restProps
}) => {
    const RenderChild = Children.map(children, (el) => {
        const child = el as ReactElement;
        if (child !== null) {
            const childType = child.type as FunctionComponent;
            const name = childType.displayName || childType.name;
            if (name === "ListGroupItem") {
                return (
                    <child.type
                        {...child.props}
                        flush={flush}
                        horizontal={horizontal}
                    />
                );
            }
        }
        return child;
    });
    return (
        <ul
            className={twMerge(
                className,
                horizontal ? "flex-row" : "flex-col",
                "flex"
            )}
            {...restProps}
        >
            {RenderChild}
        </ul>
    );
};

interface IListGroupItemStyles {
    active?: boolean;
    disabled?: boolean;
    action?: boolean;
    href?: string;
    flush?: boolean;
    horizontal?: boolean;
}
export interface IListGroupItem extends IProps, IListGroupItemStyles {}

const getListGroupItemClasses = ({
    active,
    disabled,
    action,
    flush,
    horizontal,
}: IListGroupItemStyles) => {
    let classes = "";

    if (active) {
        classes +=
            "mt-[-1px] border-t z-20 text-white bg-primary border-primary ";
    }

    if (disabled) {
        classes += "text-gray-600 pointer-events-none bg-white ";
    }

    if (action && !active) {
        classes += "hover:(z-10 text-gray-700 bg-gray-100) ";
    }

    if (flush) {
        classes +=
            "border-[0 0 1px] rounded-none first:rounded-none last:(rounded-none border-b-0) ";
    }

    if (horizontal) {
        classes +=
            "first:(rounded-bl-lg rounded-tr-none) not-first:(border-t border-l-0) last:(rounded-tr-lg rounded-bl-none) ";
    }

    return classes;
};

export const ListGroupItem: FC<IListGroupItem> = ({
    className,
    children,
    active,
    disabled,
    action,
    href,
    flush,
    horizontal,
    ...restProps
}) => {
    return (
        <a
            className={twMerge(
                className,
                getListGroupItemClasses({
                    active,
                    disabled,
                    action,
                    flush,
                    horizontal,
                }),
                "border-light relative block border bg-transparent p-3 first:border-t-0 last:border-b-0"
            )}
            href={href}
            {...restProps}
        >
            {children}
        </a>
    );
};

ListGroupItem.displayName = "ListGroupItem";
