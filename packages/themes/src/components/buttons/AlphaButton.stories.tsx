import { FC } from "react";
import { AlphaButton, ButtonProps } from "./AlphaButton";

export default {
    title: "Widgets/AlphaButton",
    component: AlphaButton,
    argTypes: {
        text: {
            type: "string",
            control: "text",
        },
    },
};

const Template: FC<ButtonProps & { text?: string }> = ({ text, ...props }) => (
    <AlphaButton {...props}>{text || "AlphaButton"}</AlphaButton>
);

export const WithText = Template.bind({});
