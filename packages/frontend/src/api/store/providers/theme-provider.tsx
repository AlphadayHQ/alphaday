import { FC } from "react";
import { GlobalStyle } from "@doar/shared/css";
import { ThemeProvider, themes } from "@doar/shared/styled";
import { useAppSelector } from "../hooks";

interface IProps {
    children?: React.ReactNode;
}

const Theme: FC<IProps> = ({ children }) => {
    const { theme } = useAppSelector((state) => state.ui);

    return (
        <ThemeProvider theme={themes[theme]}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
