import { FC } from "react";

interface IProps {
    title: string | undefined;
    value: string | React.ReactNode | undefined;
}

const CustomCardModule: FC<IProps> = ({ title, value }) => {
    return (
        <div className="flex flex-col justify-center items-center border border-solid border-borderLine !rounded-2xl p-5 m-5">
            {title && (
                <h6 className="text-primaryVariant100 fontGroup-support text-center uppercase mb-0.5">
                    {title}
                </h6>
            )}
            {value && (
                <div className="whitespace-nowrap prose-p:fontGroup-major prose-p:!text-4xl text-primary mb-0 text-center">
                    {value}
                </div>
            )}
        </div>
    );
};

export default CustomCardModule;
