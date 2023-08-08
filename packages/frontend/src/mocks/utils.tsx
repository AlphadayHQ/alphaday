import { FC } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { zapperApi } from "src/api/services";
import searchReducer from "src/api/store/slices/search";
import uiReducer from "src/api/store/slices/ui";
import userReducer from "src/api/store/slices/user";
import viewsReducer from "src/api/store/slices/views";

interface IProps {
    children?: React.ReactNode;
    withZapperApi?: boolean;
}

export const BaseWrapper: FC<IProps> = ({ children, withZapperApi }) => {
    return (
        <Provider
            store={configureStore({
                reducer: combineReducers({
                    search: searchReducer,
                    ui: uiReducer,
                    user: userReducer,
                    views: viewsReducer,
                    ...(!!withZapperApi && {
                        [zapperApi.reducerPath]: zapperApi.reducer,
                    }),
                }),
                ...(!!withZapperApi && {
                    middleware: (getDefaultMiddleware) =>
                        getDefaultMiddleware().concat(zapperApi.middleware),
                }),
            })}
        >
            <div className="item">{children}</div>
        </Provider>
    );
};

interface IDefaultProps {
    children?: React.ReactNode;
}
export const DefaultWrapper: FC<IDefaultProps> = ({ children }) => (
    <BaseWrapper>{children}</BaseWrapper>
);

export const WrapperWithZapperApi: FC<IDefaultProps> = ({ children }) => (
    <BaseWrapper withZapperApi>{children}</BaseWrapper>
);

type TWithLocationHoc = <T extends { children?: React.ReactNode }>(
    WrappedComponent: FC<T>,
    locationProps: MemoryRouterProps
) => FC<T>;

export const withLocation: TWithLocationHoc = (
    WrappedComponent,
    locationProps
) =>
    function WrapperWithLocation(
        props: React.ComponentProps<typeof WrappedComponent>
    ) {
        const { children } = props;
        return (
            <MemoryRouter {...locationProps}>
                <WrappedComponent {...props}>{children}</WrappedComponent>
            </MemoryRouter>
        );
    };
