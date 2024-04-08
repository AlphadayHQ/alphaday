import { memo } from "react";
import {
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { ReactComponent as MarketsSVG } from "src/assets/svg/markets.svg";
import { ReactComponent as PortfolioSVG } from "src/assets/svg/portfolio.svg";
import { ReactComponent as SuperfeedSVG } from "src/assets/svg/superfeed.svg";
import { useAuth } from "./api/hooks";
import { useGetFeaturesQuery } from "./api/services";
import CONFIG from "./config";
import ToastContainer from "./containers/toasts/ToastContainer";
import "@alphaday/ui-kit/global.scss";
import "./customIonicStyles.scss";
import {
    EMobileRoutePaths,
    EMobileTabRoutePaths,
    mobileRoutes,
} from "./routes";

const { IS_DEV } = CONFIG;

const CustomNavTab: React.FC<{
    label: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    disabled?: boolean;
}> = ({ label, Icon, disabled }) => (
    <div className="inline-flex flex-col items-center justify-center py-3 px-2">
        <span className="rounded-2xl relative">
            <Icon />
        </span>
        <span className="capitalize mt-1 fontGroup-highlightSemi">
            {disabled ? `${label} (soon)` : label}
        </span>
        {/* {disabled && <div className="text-xs leading-3">(soon)</div>} */}
    </div>
);

/**
 * TODO: Move user-settings (and any other view that should be accessible from multiple tabs)
 * to a modal.
 * For the MVP it's fine to nest everything within /superfeed
 */
const MobileApp: React.FC = () => {
    useGetFeaturesQuery();
    const { isAuthenticated } = useAuth();
    return (
        <IonApp className="theme-dark">
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet ionPage>
                        {mobileRoutes.map((route) => {
                            if (route.type === "redirect") {
                                return (
                                    <Redirect
                                        key={route.path}
                                        path={route.path}
                                        to={route.redirectTo}
                                        exact={route.exact ?? false}
                                        push
                                    />
                                );
                            }
                            if (route.type === "fallback") {
                                return (
                                    <Redirect
                                        key={route.redirectTo}
                                        to={route.redirectTo}
                                        push
                                    />
                                );
                            }
                            // if the route is authwalled, let's just redirect to superfeed page.
                            if (route.authWalled && !isAuthenticated) {
                                return (
                                    <Redirect
                                        key={route.path}
                                        path={route.path}
                                        to={EMobileRoutePaths.Superfeed}
                                        exact={route.exact ?? false}
                                    />
                                );
                            }
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    exact={route.exact ?? false}
                                    render={() => <route.component />}
                                />
                            );
                        })}
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton
                            tab="superfeed"
                            href={EMobileTabRoutePaths.Superfeed}
                        >
                            <CustomNavTab
                                label="Superfeed"
                                Icon={SuperfeedSVG}
                            />
                        </IonTabButton>
                        {IS_DEV && (
                            <IonTabButton
                                tab="market"
                                href={EMobileTabRoutePaths.Market}
                            >
                                <CustomNavTab
                                    label="Market"
                                    Icon={MarketsSVG}
                                />
                            </IonTabButton>
                        )}
                        <IonTabButton
                            tab="portfolio"
                            href={EMobileTabRoutePaths.Portfolio}
                            disabled={!IS_DEV}
                        >
                            <CustomNavTab
                                label="Portfolio"
                                Icon={PortfolioSVG}
                                disabled={!IS_DEV}
                            />
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
            <ToastContainer
                position="bottom-center"
                duration={CONFIG.UI.TOAST_DURATION}
                className="fontGroup-supportBold"
                containerClassName="last:mb-20"
            />
        </IonApp>
    );
};

export default memo(MobileApp);
