import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import type { Node, Parent, Literal } from "unist";
import { visit } from "unist-util-visit";
import { v4 as uuidv4 } from "uuid";
import { TTag } from "../types";

// URL might be wrapped in parentheses and end in a dot and or \n.
export const URL_GLOBAL_REGEX =
    /\(?(?<url>https?:\/\/[^\s]+[^).\n])\)?\.?\n?/gi;

// exact match (with no sufixes/postfixes)
export const URL_REGEX = /^https?:\/\/[^\s]*[^.]$/i;

export const slugify = (text: string): string =>
    text
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

/**
 * Returns a shorter from of a given string
 * @param text - string to be shortened
 * @param count - no of characters to be returned
 * @param ellipsisPos - position of ellipsis, center or end
 *
 * @returns string
 */
export const truncateWithEllipsis = (
    text: string,
    count?: number,
    ellipsisPos: "end" | "center" = "center"
): string => {
    const maxLen = count !== undefined ? count : 12;

    if (text.length > maxLen) {
        if (ellipsisPos === "end") {
            return `${text.substr(0, Math.floor(maxLen))}...`;
        }
        return `${text.substr(0, Math.floor(maxLen / 2))}...${text.substr(
            text.length - Math.floor(maxLen / 2)
        )}`;
    }
    return text;
};

export const parseNewLine = (s: string, tabCount = 2): JSX.Element => {
    return (
        <span>
            {s.split("\n").map((e, i, self) => (
                <span key={uuidv4()}>
                    {e}
                    {i < self.length - 1 && (
                        <>
                            {[...Array(tabCount)].map(() => (
                                <br key={uuidv4()} />
                            ))}
                        </>
                    )}
                </span>
            ))}
        </span>
    );
};

export const isURL = (text: string): boolean => {
    URL_REGEX.lastIndex = 0;
    return URL_REGEX.test(text);
};

export const containsURLs = (text: string): boolean => {
    URL_GLOBAL_REGEX.lastIndex = 0;
    return URL_GLOBAL_REGEX.test(text);
};

export const stringToAnchor = (str: string): JSX.Element => (
    <a
        href={str}
        className="link" // className link is used to style this item from a parent container
        target="_blank"
        rel="noreferrer"
        key={uuidv4()}
    >
        {truncateWithEllipsis(str, 18, "end")}
    </a>
);

export const textHasTags = (text: string, tags: TTag[]): boolean =>
    text.split(" ").some((curr) =>
        tags.some((tag) => {
            const filterTagName = new RegExp(tag.name, "i");
            const filterTagSlug = new RegExp(tag.slug, "i");
            return filterTagName.test(curr) || filterTagSlug.test(curr);
        })
    );

/**
 * Typically used in the function below, when parsing markdown urls
 */
export const REMARK_URL_REGEX =
    /\b(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|]/g;

/**
 * Typically used optionally in the function below, when parsing markdown content
 */

export const REMARK_MENTION_REGEX = /(@[a-zA-Z\d-_]{1,31})/g;
export const REMARK_HASHTAG_REGEX = /(#\w*[A-Za-z]\w*)/g;

interface IParentWithLiteral extends Literal {
    url?: string;
    children: Literal[];
}

/**
 * A remark plugin that matches text nodes against a regex pattern and replaces them with a link node.
 *
 * @param pattern - regex pattern to match
 * @param callback - callback function to be called when a match is found. The matched text is passed as the first argument.
 */
export const remarkRegex = (
    pattern: RegExp,
    callback: (matchedText: string) => string | string[] = (matchedText) => [
        matchedText,
        matchedText,
    ]
): (() => (tree: Node) => void) => {
    return () => (tree: Node) => {
        visit(tree, "text", (node: Literal, index, parent: Parent) => {
            const nodeValue = node.value as string;
            const matches = Array.from(nodeValue.matchAll(pattern));

            if (matches.length > 0 && parent && parent.type !== "link") {
                const newChildren: IParentWithLiteral[] = [];

                let lastIndex = 0;

                matches.forEach((match) => {
                    const start = match.index || 0;
                    const end = start + match[0].length;

                    if (start > lastIndex) {
                        newChildren.push({
                            type: "text",
                            value: nodeValue.slice(lastIndex, start),
                            children: [],
                        });
                    }

                    const value = callback(match[0].trim());

                    if (typeof value === "string") {
                        newChildren.push({
                            type: "text",
                            value,
                            children: [],
                        });
                    } else {
                        const [url, text] = value;
                        newChildren.push({
                            type: "link",
                            url,
                            value: {
                                hProperties: {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                },
                            },
                            children: [{ type: "text", value: text }],
                        });
                    }

                    lastIndex = end;
                });

                if (lastIndex < nodeValue.length) {
                    newChildren.push({
                        type: "text",
                        value: nodeValue.slice(lastIndex),
                        children: [],
                    });
                }

                /**
                 * If the index is null/undefined, then the node is the root node.
                 * In this case, we need to replace the root node with the new children.
                 * Otherwise, we need to replace the node at the given index with the new children.
                 */
                if (index == null) {
                    Object.assign(parent.children, newChildren);
                } else {
                    parent.children.splice(index, 1, ...newChildren);
                }
            }
        });
    };
};

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

// Function to evaluate the template literal
export const evaluateTranslationTemplate = (
    templateString: string,
    data: Record<string, string>
) => {
    return templateString.replace(/\${(\w+)}/g, (match, key) => {
        return data[key] || match;
    });
};
