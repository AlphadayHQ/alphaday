import { describe, expect, it } from "vitest";
import { buildCsp, cspPlugin } from "./csp.config";

const parse = (csp: string): Record<string, string[]> =>
    Object.fromEntries(
        csp.split("; ").map((d) => {
            const [name, ...values] = d.split(" ");
            return [name, values];
        })
    );

describe("buildCsp", () => {
    it("never allows inline or eval'd script", () => {
        const scriptSrc = parse(buildCsp())["script-src"];
        expect(scriptSrc).not.toContain("'unsafe-inline'");
        expect(scriptSrc).not.toContain("'unsafe-eval'");
        expect(scriptSrc).not.toContain("https:");
        expect(scriptSrc).not.toContain("*");
    });

    it("doesn't allow JSONP-capable hosts as a whole", () => {
        const csp = parse(buildCsp());
        expect(csp["script-src"]).not.toContain("https://accounts.google.com");
        expect(csp["script-src"]).toContain(
            "https://accounts.google.com/gsi/client"
        );
        expect(csp["style-src"]).not.toContain("https://accounts.google.com");
    });

    it("locks down plugins, base URL and form targets", () => {
        const csp = parse(buildCsp());
        expect(csp["object-src"]).toEqual(["'none'"]);
        expect(csp["base-uri"]).toEqual(["'self'"]);
        expect(csp["form-action"]).toEqual(["'self'"]);
    });

    it("adds a non-https API origin to connect-src", () => {
        const csp = parse(buildCsp("http://localhost:8000/"));
        expect(csp["connect-src"]).toContain("http://localhost:8000");
    });

    it("doesn't duplicate https API origins or choke on bad input", () => {
        const base = parse(buildCsp())["connect-src"];
        expect(
            parse(buildCsp("https://api.alphaday.com/"))["connect-src"]
        ).toEqual(base);
        expect(parse(buildCsp("not a url"))["connect-src"]).toEqual(base);
    });
});

describe("cspPlugin", () => {
    const transform = cspPlugin().transformIndexHtml as unknown as (
        html: string
    ) => string;

    it("inserts the CSP after <meta charset> and before the first script", () => {
        const html = transform(
            '<head>\n<meta charset="utf-8" />\n<title>x</title>\n<script src="/a.js"></script>\n</head>'
        );
        const charsetAt = html.indexOf('<meta charset="utf-8" />');
        const cspAt = html.indexOf('http-equiv="Content-Security-Policy"');
        const scriptAt = html.indexOf("<script");
        expect(charsetAt).toBeGreaterThanOrEqual(0);
        expect(cspAt).toBeGreaterThan(charsetAt);
        expect(cspAt).toBeLessThan(scriptAt);
    });

    it("fails the build when <meta charset> is missing", () => {
        expect(() => transform("<head><title>x</title></head>")).toThrow(
            /meta charset/
        );
    });
});
