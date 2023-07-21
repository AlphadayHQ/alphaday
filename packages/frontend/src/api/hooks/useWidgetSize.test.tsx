import "src/mocks/libraryMocks";
import { FC } from "react";
import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { DimensionsContext } from "../store/providers/dimensions-context";
import { useWidgetSize } from "./useWidgetSize";

global.ResizeObserver = require("resize-observer-polyfill");

const widgetsSize = {
    width: 800,
    height: 900,
};
const windowSize = {
    width: 2000,
    height: 1000,
};
const DimensionsProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <DimensionsContext.Provider value={{ widgetsSize, windowSize }}>
        {children}
    </DimensionsContext.Provider>
);

describe("useWidgetSize", () => {
    it("should return the correct size when the element is defined", () => {
        const clientWidth = 800;
        const getElementByIdSpy = jest.spyOn(document, "getElementById");
        getElementByIdSpy.mockReturnValueOnce(({
            clientWidth,
        } as unknown) as HTMLElement);

        const { result } = renderHook(() => useWidgetSize([768, 320]), {
            wrapper: DimensionsProvider,
        });
        expect(result.current).toEqual("lg");

        getElementByIdSpy.mockRestore();
    });

    it("should return undefined when the element is undefined", () => {
        const getElementByIdSpy = jest.spyOn(document, "getElementById");
        getElementByIdSpy.mockReturnValueOnce(null);

        const { result } = renderHook(() => useWidgetSize([768, 320]));
        expect(result.current).toBeUndefined();

        getElementByIdSpy.mockRestore();
    });
});
