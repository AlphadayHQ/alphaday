import { renderHook, act } from "@testing-library/react-hooks";
import { useCallbackState } from "./useCallbackState";

describe("useCallbackState", () => {
    it("should return initial state and a function to update it", () => {
        const initialState = { name: "John", age: 30 };
        const { result } = renderHook(() => useCallbackState(initialState));

        expect(result.current[0]).toEqual(initialState);
        expect(typeof result.current[1]).toBe("function");
    });

    it("should update state and call the callback function", () => {
        const initialState: Record<string, string | number> = {
            name: "John",
            age: 30,
        };
        const callbackFn = jest.fn();
        const { result } = renderHook(() => useCallbackState(initialState));

        act(() => {
            result.current[1]({ name: "Mary", age: 30 }, callbackFn);
        });

        expect(result.current[0]).toEqual({ name: "Mary", age: 30 });
        expect(callbackFn).toHaveBeenCalledWith({ name: "Mary", age: 30 });
    });
});
