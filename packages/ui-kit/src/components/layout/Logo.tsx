import { FC } from "react";
import Logoday from "src/assets/svg/logo-white.svg";

const Logo: FC = () => {
    return (
        <div className="order-1 mr-0 flex items-center whitespace-nowrap px-5 pb-[21px] pt-5 leading-[inherit]">
            <a href="/">
                <Logoday className="relative -mt-1 flex items-center font-bold tracking-[-1px] text-[color:var(--primary)] text-transparent" />
                <div className="font-montserrat text-[19px] text-white">
                    <span>alphaday</span>
                </div>
            </a>
        </div>
    );
};

export default Logo;
