import { FC } from "react";
import logoDay from "src/assets/svg/logo-white.svg";
import CONFIG from "src/config";

const GeneralError: FC<{ children?: React.ReactNode }> = ({ children }) => {
    const isHome = window.location.pathname === "/";
    return (
        <div className="bg-background">
            <div className="main h-[calc(100vh-200px)] flex justify-center items-center flex-col">
                {children}
                {isHome ? (
                    <div className="logo top mt-2">
                        <img
                            src="/images/alphaday-logo-with-text.png"
                            alt="alphaday logo"
                            className="w-[36px]"
                        />
                    </div>
                ) : (
                    <a
                        href={window.location.origin}
                        className="button flex items-center bg-secondaryOrange p-3 rounded-full text-white font-montserrat text-xl leading-none mt-5 hover:opacity-80 focus:opacity-100"
                    >
                        <img
                            src={logoDay}
                            alt="alphaday logo"
                            className="m-0 mr-2 h-5"
                        />{" "}
                        Back to Home
                    </a>
                )}
            </div>
            <footer>
                <div
                    id="footer"
                    className="text-primaryVariant800 text-xs font-body text-center"
                >
                    &copy;Alphaday
                    {new Date().getFullYear()} - v{CONFIG.APP.VERSION}
                </div>
            </footer>
        </div>
    );
};

export default GeneralError;
