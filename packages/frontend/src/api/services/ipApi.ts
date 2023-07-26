import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../../config/config";

const { API_BASE_URL, ROUTES } = CONFIG.API_PROVIDERS.IPAPI;

export type TGetIpMetadataRequest = void;

export type TGetIpMetadataResponse = {
    ip: string | null; // "186.11.24.190",
    version: string | null; // "IPv4",
    city: string | null; // "Santiago"
    region: string | null; // "Santiago Metropolitan"
    region_code: string | null; // RM
    country: string | null; // "CL",
    country_name: string | null; // "Chile",
    country_code: string | null; // "CL",
    country_code_iso3: string | null; // CHL,
    country_capital: string | null; // "Santiago",
    country_tld: string | null; // ".cl",
    continent_code: string | null; // "SA",
    in_eu: boolean | null;
    postal: string | null;
    latitude: number | null; // -33.4513,
    longitude: number | null; // -70.6653,
    timezone: string | null; // "America/Santiago",
    utc_offset: string | null; // "-0400",
    country_calling_code: string | null; // "+56"
    currency: string | null; // "CLP",
    currency_name: string | null; // "Peso",
    languages: string | null; // "es-CL",
    country_area: number | null; // 756950.0,
    country_population: number | null; // 18729160,
    asn: string | null; // "AS27651"
    org: string | null; // "ENTEL CHILE S.A."
};

export const ipApi = createApi({
    reducerPath: "ipApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
    }),
    endpoints: (builder) => ({
        getIpMetadata: builder.query<
            TGetIpMetadataResponse,
            TGetIpMetadataRequest
        >({
            query: () => {
                if (ROUTES?.IP_METADATA == null) {
                    throw new Error("ipApi::getIpMetadata: invalid route");
                }
                return `${API_BASE_URL}${ROUTES?.IP_METADATA}`;
            },
        }),
    }),
});

export const { useGetIpMetadataQuery } = ipApi;
