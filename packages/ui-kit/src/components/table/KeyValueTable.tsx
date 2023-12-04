import { FC, ReactNode, memo } from "react";

interface IKeyValueTable {
    items: {
        title: ReactNode;
        value: ReactNode;
    }[][];
}
export const KeyValueTable: FC<IKeyValueTable> = memo(function KeyValueTable({
    items,
}) {
    return (
        <div className="flex flex-col p-3 m-0 border-solid border-1 border-borderLine rounded">
            {items.map((row, key) => (
                <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={String(key)}
                    className="flex items-center justify-between mb-3 pb-3 border-b border-borderLine"
                >
                    {row.map(({ title, value }, rKey) => (
                        <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={String(rKey)}
                            className="[&:not(:first-child)]:text-right [&:not(:first-child)]:ml-1 [&:not(:first-child)]:text-primaryVariant800 [&_.small]:text-xs [&_.small]:text-primaryVariant800"
                        >
                            <div className="text-xs font-bold uppercase tracking-wide text-primaryVariant700">
                                {title}
                            </div>
                            <div>{value}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
});
