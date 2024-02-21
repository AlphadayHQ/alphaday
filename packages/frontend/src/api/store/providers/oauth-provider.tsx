import { createContext, useMemo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useScript } from "usehooks-ts";

declare const AppleID: {
    auth: {
        init: (config: {
            clientId: string;
            scope?: string;
            redirectURI: string;
            state: string;
            usePopup?: boolean;
        }) => void;
        signIn: () => Promise<{
            authorization: {
                code: string;
                id_token: string;
                state: string;
            };
            user: {
                email: string;
                name: {
                    firstName: string;
                    lastName: string;
                };
            };
        }>;
    };
};

export const AppleAuthContext = createContext({
    isLoading: true,
});

export const signInWithApple = async () => {
    if (typeof AppleID === "undefined") {
        throw new Error("Apple auth script is not yet loaded.");
    }
    const data = await AppleID.auth.signIn();
    return data;
};

const AppleOAuthProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    const appleScriptStatus = useScript(
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    );

    return (
        <AppleAuthContext.Provider
            value={useMemo(() => {
                // we need to call the apple auth initialization function once the script is loaded
                // and then we can use the signInWithApple function
                //
                // Calling this here, ensures we only do so Once!
                if (
                    appleScriptStatus === "ready" &&
                    import.meta.env.VITE_OAUTH_ID_APPLE &&
                    typeof AppleID !== "undefined"
                ) {
                    AppleID.auth.init({
                        clientId: import.meta.env.VITE_OAUTH_ID_APPLE,
                        redirectURI: `${window.location.origin}/auth/apple_callback`,
                        state: "state",
                        usePopup: true,
                    });
                }
                return {
                    isLoading: appleScriptStatus !== "ready",
                };
            }, [appleScriptStatus])}
        >
            {children}
        </AppleAuthContext.Provider>
    );
};

export const OauthProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_ID_GOOGLE}>
            <AppleOAuthProvider>{children}</AppleOAuthProvider>
        </GoogleOAuthProvider>
    );
};
