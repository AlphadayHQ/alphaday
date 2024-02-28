import { FC } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";

interface IProps {
    avatar: string | undefined;
    onSearchHandleClick?: () => void;
}

export const NavHeader: FC<IProps> = ({ avatar, onSearchHandleClick }) => {
    return (
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
                type="button"
                className="bg-backgroundVariant300 self-center rounded-lg p-2"
                onClick={onSearchHandleClick}
            >
                <SearchSVG className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    );
};
