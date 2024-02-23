import { FC, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "src/api/hooks";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";
import FilterSearchBar from "../FilterSearchBar";

interface IProps {
    avatar: string | undefined;
}

export const NavHeader: FC<IProps> = ({ avatar }) => {
    const query = useQuery();
    const history = useHistory();
    const [showSearchBar, setShowSearchBar] = useState(false);
    return (
        <>
            <div className="w-full flex justify-between py-2 px-5">
                <Link
                    to="superfeed/user-settings"
                    role="button"
                    tabIndex={0}
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {avatar ? (
                        <img
                            className="h-12 w-12 rounded-full"
                            src={avatar}
                            alt=""
                        />
                    ) : (
                        <div className="bg-backgroundVariant300 border-borderLine flex h-12 w-12 items-center justify-center rounded-full border-2">
                            <UserSVG className="fill-primary h-7 w-7" />
                        </div>
                    )}
                </Link>
                <button
                    className="bg-backgroundVariant300 self-center rounded-lg p-2"
                    onClick={() => setShowSearchBar((show) => !show)}
                >
                    <SearchSVG className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
            {showSearchBar && (
                <div className="py-2 px-5">
                    <FilterSearchBar
                        tags={query.get("tags") ?? undefined}
                        onChange={(t) => {
                            if (t.length === 0) {
                                history.push("/superfeed");
                                return;
                            }
                            history.push(
                                `/superfeed?tags=${t
                                    .map((tag) => tag.slug)
                                    .join(",")}`
                            );
                        }}
                    />
                </div>
            )}
        </>
    );
};
