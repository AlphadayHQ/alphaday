import { useEffect, useState } from "react";

export const useScript = (url: string) => {
    const [status, setStatus] = useState<"ready" | "loading">("loading");
    useEffect(() => {
        const script = document.createElement("script");
        script.src = url;
        script.async = true;

        document.body.appendChild(script);

        script.onload = () => setStatus("ready");

        return () => {
            document.body.removeChild(script);
        };
    }, [url]);

    return status;
};
