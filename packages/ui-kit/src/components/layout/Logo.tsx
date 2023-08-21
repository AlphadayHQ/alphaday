import { FC } from "react";
import { ReactComponent as Logoday } from "../../assets/svg/logo-white.svg";

const Logo: FC = () => {
    return (
        <div className="twoCol:pl-5 order-1 mr-0 flex w-[170px] items-center whitespace-nowrap pl-[15px] leading-[inherit]">
            <a
                href="/"
                className="text-primary relative -mt-1 flex items-center font-bold tracking-[-1px] text-transparent"
            >
                <Logoday className="twoCol:h-[30px] mr-[5px] mt-0.5 block h-6" />
                <div className="font-montserrat twoCol:text-[23.5px] text-[19px] text-white">
                    <span>alphaday</span>
                </div>
            </a>
        </div>
    );
};

export default Logo;
