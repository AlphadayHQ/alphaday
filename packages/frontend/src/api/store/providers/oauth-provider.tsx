import { createContext, useMemo } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useScript } from "usehooks-ts";

declare const AppleID: {
    auth: {
        signIn: () => Promise<JSONValue>;
    };
};

export const AuthContext = createContext({
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
    const appleScript = useScript(
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
    );
    return (
        <AuthContext.Provider
            value={useMemo(
                () => ({
                    isLoading: appleScript !== "ready",
                }),
                [appleScript]
            )}
        >
            {children}
        </AuthContext.Provider>
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
