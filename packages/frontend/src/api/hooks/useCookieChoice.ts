import { useEffect } from "react";
import { useGetIpMetadataQuery } from "src/api/services";
import { setCookieChoice } from "src/api/store";
import { useAppSelector, useAppDispatch } from "src/api/store/hooks";
import { ECookieChoice } from "src/api/types";

interface ICookieChoice {
    allowTracking: boolean;
}

export const useCookieChoice: () => ICookieChoice = () => {
    const dispatch = useAppDispatch();
    const cookieChoice = useAppSelector((state) => state.ui.cookieChoice);
    const { data: ipMeta, isError } = useGetIpMetadataQuery(undefined, {
        skip:
            cookieChoice !== undefined &&
            cookieChoice > ECookieChoice.RejectAll,
    });

    useEffect(() => {
        if (ipMeta && !ipMeta.in_eu && cookieChoice === undefined) {
            dispatch(setCookieChoice(ECookieChoice.AcceptAll));
        }
    }, [ipMeta, cookieChoice, dispatch]);

    if (cookieChoice === ECookieChoice.AcceptAll) {
        return {
            allowTracking: true,
        };
    }

    /**
     * Allow tracking if the user is not in the EU.
     */
    const allowTracking = ipMeta && !isError ? !ipMeta.in_eu : false;

    return {
        allowTracking,
    };
};
