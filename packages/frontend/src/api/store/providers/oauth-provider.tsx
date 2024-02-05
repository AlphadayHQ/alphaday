import { GoogleOAuthProvider } from "@react-oauth/google";

export const OauthProvider: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_ID_GOOGLE}>
            {children}
        </GoogleOAuthProvider>
    );
};
