import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

/**
 * Renders a valid react node to a string
 *
 * @param node - react node to be rendered
 */

export const renderToString = (node: JSX.Element): string => {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);
    flushSync(() => root.render(node));
    return wrapper.innerHTML;
};
