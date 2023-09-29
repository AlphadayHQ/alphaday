import { FC } from "react";
import { ReactComponent as Logoday } from "../../assets/svg/logo-white.svg";

const Logo: FC = () => {
    return (
        <div className="two-col:pl-5 order-1 mr-0 flex w-[170px] items-center whitespace-nowrap pl-[15px] leading-[inherit]">
            <a
                href="/"
                className="text-primary relative -mt-1 flex items-center font-bold tracking-[-1px]"
            >
                <Logoday className="two-col:h-[30px] mr-[5px] mt-0.5 block h-6 focus:outline-none" />
                <div className="font-montserrat two-col:text-[23.5px] text-[19px] text-white bg-transparent">
                    {/* <span>alphaday</span> */}
                    alphaday
                </div>
            </a>
        </div>
    );
};

export default Logo;
