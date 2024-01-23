import { FC } from "react";
import { ReactComponent as SearchSVG } from "src/assets/svg/search.svg";
import { ReactComponent as UserSVG } from "src/assets/svg/user.svg";

interface IProps {
    avatar: string | undefined;
}

export const NavHeader: FC<IProps> = ({ avatar }) => {
    return (
        <div className="w-full flex justify-between py-2 px-5">
            <div className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                {avatar ? (
                    <img
                        className="h-12 w-12 rounded-full"
                        src={avatar}
                        alt=""
                    />
                ) : (
                    <div className="rounded-full h-12 w-12 bg-backgroundVariant300 flex items-center justify-center border-2 border-borderLine">
                        <UserSVG className="w-7 h-7 fill-primary" />
                    </div>
                )}
            </div>
            <div className="p-2 self-center bg-backgroundVariant300 rounded-lg">
                <SearchSVG className="h-4 w-4" aria-hidden="true" />
            </div>
        </div>
    );
};
