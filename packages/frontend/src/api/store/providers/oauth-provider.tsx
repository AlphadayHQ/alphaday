import { GoogleOAuthProvider } from "@react-oauth/google";
import CONFIG from "src/config";

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

export const signInWithApple = async () => {
    if (typeof AppleID === "undefined") {
        throw new Error("Apple auth script is not yet loaded.");
    }
    if(!CONFIG.OAUTH.APPLE_CLIENT_ID) {
        throw new Error("Apple client id is not defined.");
    }
    AppleID.auth.init({
        clientId: CONFIG.OAUTH.APPLE_CLIENT_ID,
        redirectURI: `${window.location.origin}/auth/apple_callback`,
        state: "state",
        scope: "email",
        usePopup: true,
    });
    const data = await AppleID.auth.signIn();
    return data;
};

export const OauthProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    return (
        <GoogleOAuthProvider clientId={CONFIG.OAUTH.GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
};
