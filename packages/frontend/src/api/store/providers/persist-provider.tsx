import { FC } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../store";

interface IProps {
    children?: React.ReactNode;
}
const PersistProvider: FC<IProps> = ({ children }) => {
    return (
        <PersistGate loading={null} persistor={persistor}>
            {children}
        </PersistGate>
    );
};

export default PersistProvider;
