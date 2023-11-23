import { FC } from "react";

interface IProps {
    title: string | undefined;
    value: string | React.ReactNode | undefined;
}

const CustomCardModule: FC<IProps> = ({ title, value }) => {
    return (
        <div className="flex flex-col justify-center items-center border border-solid border-btnRingVariant300 !rounded-2xl p-5 m-5">
            {title && (
                <h6 className="text-primaryVariant100 fontGroup-support text-center uppercase mb-[7px]">
                    {title}
                </h6>
            )}
            {value && (
                <div className="whitespace-nowrap fontGroup-major text-center">
                    <div>
                        <p className="text-primary mb-0 text-center">{value}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCardModule;
