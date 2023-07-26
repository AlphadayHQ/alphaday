import "src/mocks/libraryMocks";
import { useEffect } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useHistory } from "react-router-dom";
import { DefaultWrapper, withLocation } from "src/mocks/utils";
import { useViewRoute } from "./useViewRoute";

describe("useViewRoute", () => {
    it("should get the current view slug", () => {
        const { result } = renderHook(() => useViewRoute(), {
            wrapper: withLocation(DefaultWrapper, {
                initialEntries: [{ pathname: "/b/alpha" }],
            }),
        });
        expect(result.current.routeInfo?.value).toEqual("alpha");

        // check that is updates correctly after navigating
        const { result: result2 } = renderHook(
            () => {
                const navigate = useHistory();
                useEffect(() => {
                    navigate.push("/b/bitcoin");
                    // eslint-disable-next-line
                }, []);
                return useViewRoute();
            },
            {
                wrapper: withLocation(DefaultWrapper, {
                    initialEntries: [{ pathname: "/b/alpha" }],
                }),
            }
        );
        expect(result2.current.routeInfo?.value).toBe("bitcoin");
        expect(result2.current.pathContainsHashOrSlug).toBe(true);
        expect(result2.current.isViewHash).toBe(false);
        expect(result2.current.isFullSize).toBe(false);
    });

    it("should get the current view hash", () => {
        const { result } = renderHook(() => useViewRoute(), {
            wrapper: withLocation(DefaultWrapper, {
                initialEntries: [
                    { pathname: "/b/572f4028d04a2057d65b12777b9a983b" },
                ],
            }),
        });
        expect(result.current.routeInfo?.value).toEqual(
            "572f4028d04a2057d65b12777b9a983b"
        );
        expect(result.current.pathContainsHashOrSlug).toBe(true);
        expect(result.current.isViewHash).toBe(true);
        expect(result.current.isFullSize).toBe(false);
    });
    it("should get nothing for the root route", () => {
        const { result } = renderHook(() => useViewRoute(), {
            wrapper: withLocation(DefaultWrapper, {
                initialEntries: [{ pathname: "/" }],
            }),
        });
        expect(result.current.routeInfo).toEqual(undefined);
    });
    it("should parse full-size widget routes", () => {
        const PATH =
            "/b/alpha/calendar/event/1049/decentraland-developer-workshop";
        const { result } = renderHook(() => useViewRoute(), {
            wrapper: withLocation(DefaultWrapper, {
                initialEntries: [
                    {
                        pathname: PATH,
                    },
                ],
            }),
        });
        expect(result.current.routeInfo?.value).toBe("alpha");
        expect(result.current.pathContainsHashOrSlug).toBe(true);
        expect(result.current.isViewHash).toBe(false);
        expect(result.current.isFullSize).toBe(true);
    });
});
