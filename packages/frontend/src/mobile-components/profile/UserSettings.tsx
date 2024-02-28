import { FC } from "react";
import { twMerge } from "@alphaday/ui-kit";
import { Link, useHistory } from "react-router-dom";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";
import { ReactComponent as DocSVG } from "src/assets/icons/doc.svg";
import { ReactComponent as LogoutSVG } from "src/assets/icons/logout.svg";
import { ReactComponent as StarSVG } from "src/assets/icons/star.svg";
import { ReactComponent as UserSVG } from "src/assets/icons/user.svg";

const NonAuthenticatedSection = () => {
    return (
        <div className="flex flex-col flex-start w-full items-start mb-4">
            <p className="mb-0 fontGroup-highlight">
                Sign up to unlock the complete experience{" "}
            </p>
            <Link
                to="/superfeed/auth"
                className="flex fontGroup-highlight !font-semibold py-3 px-4 bg-accentVariant100 hover:bg-accentVariant200 w-full mt-5 justify-center rounded-lg"
            >
                Sign up
            </Link>
            <p className="mt-6">
                <span className="mt-6">Already have an account?</span>
                <Link
                    to="/superfeed/auth"
                    className="ml-2 font-semibold border-b border-accentVariant100"
                >
                    Log in here
                </Link>
            </p>
        </div>
    );
};

const AuthenticatedSection = () => {
    return (
        <div className="flex flex-col flex-start w-full items-start mb-4">
            <div className="flex">
                <img
                    src="	https://tailwindui.com/img/avatar-3.jpg"
                    alt="username"
                    className="mr-3 w-[60px] h-[60px] rounded-full border border-solid border-green-400"
                />
                <p className="m-0 fontGroup-major self-center">Hi Username!</p>
            </div>
            <div className="relative flex flex-col items-center fontGroup-highlight !font-semibold py-4 px-4 bg-backgroundVariant300 w-full mt-5 justify-center rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-secondaryOrangeSoda absolute top-4 right-4" />
                <p className="block ">Some major notification here...</p>
                <Link
                    to="/superfeed/notifications"
                    className="fontGroup-highlight border-b border-accentVariant100 m-0"
                >
                    See all notifications
                </Link>
            </div>
        </div>
    );
};

type TMenuEntry = {
    id: number;
    icon: FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    subtext: string | null;
    requiresAuth?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

interface IUserSettings {
    // avatar: string;
    // username: string;
    // isOpen: boolean;
    // onClose: () => void;
    isAuthenticated: boolean;
    onLogout: () => Promise<void>;
}
const UserSettings: FC<IUserSettings> = ({ isAuthenticated, onLogout }) => {
    const history = useHistory();

    const navigate = (link: string) => {
        history.push(link);
    };

    const menu: TMenuEntry[] = [
        {
            id: 1,
            icon: UserSVG,
            title: "Edit profile",
            subtext: "Edit your profile",
            requiresAuth: true,
            onClick: () => {
                if (isAuthenticated) navigate("/profile");
            },
        },
        {
            id: 2,
            icon: DocSVG,
            title: "Privacy policy",
            subtext: "How we work & use your data",
            onClick: () => navigate("profile/privacy"),
        },
        {
            id: 3,
            icon: StarSVG,
            title: "Rate us",
            subtext: "Tell us what we think",
            disabled: true,
            onClick: () => navigate("profile/rate"),
        },
        {
            id: 4,
            icon: LogoutSVG,
            title: "Log out",
            subtext: null,
            requiresAuth: true,
            onClick: () => {
                navigate("profile/log-out");
                onLogout().catch((e) =>
                    Logger.error("UserMenu: logout failed", e)
                );
            },
        },
    ];

    return (
        <div className="mx-5 w-full">
            {/* <div className="flex flex-start w-full items-center mb-4">
                <ChevronSVG
                    onClick={onClose}
                    tabIndex={0}
                    role="button"
                    className="w-6 h-6 mr-2 rotate-180 self-center -ml-1.5"
                />
            </div> */}
            {isAuthenticated ? (
                <AuthenticatedSection />
            ) : (
                <NonAuthenticatedSection />
            )}
            <div className="mt-10 w-full">
                {menu.map((item) => {
                    if (item.requiresAuth || item.disabled) return null;
                    return (
                        <div
                            onClick={item.onClick}
                            tabIndex={0}
                            role="button"
                            key={item.id}
                            className={twMerge(
                                "flex w-full justify-start items-center border-b border-primaryVariant100 pb-2.5 pt-2.5 last:pb-0 last:border-none first:pt-0 cursor-pointer",
                                isAuthenticated
                                    ? "text-primary"
                                    : "text-primaryVariant100"
                            )}
                        >
                            <item.icon className="mr-4 w-6 h-6" />
                            <div className="flex flex-grow min-w-max justify-between items-center">
                                <div className="flex flex-col w-full">
                                    <span className="block fontGroup-highlightSemi">
                                        {item.title}
                                    </span>
                                    <span className="fontGroup-support">
                                        {item.subtext}
                                    </span>
                                </div>
                                <ChevronSVG className="h-3.5" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserSettings;
