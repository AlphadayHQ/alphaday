import { FC } from "react";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";

interface IProps {
    avatar: string | undefined;
    onAvatarClick?: () => void;
}

export const NavHeader: FC<IProps> = ({ avatar, onAvatarClick }) => {
    return (
        <div className="flex w-full justify-between px-5 py-2">
            <div className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {avatar ? (
                    <img
                        tabIndex={0}
                        role="button"
                        onClick={onAvatarClick}
                        className="h-12 w-12 rounded-full"
                        src={avatar}
                        alt=""
                    />
                ) : (
                    <div
                        role="button"
                        tabIndex={0}
                        className="bg-backgroundVariant300 border-borderLine flex h-12 w-12 items-center justify-center rounded-full border-2"
                        onClick={onAvatarClick}
                    >
                        <UserSVG className="fill-primary h-7 w-7" />
                    </div>
                )}
            </div>
            <div className="bg-backgroundVariant300 self-center rounded-lg p-2">
                <SearchSVG className="h-4 w-4" aria-hidden="true" />
            </div>
        </div>
    );
};
