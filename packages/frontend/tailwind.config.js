import tailwindConfig from "@alphaday/ui-kit/tailwind.config";

export default {
    ...tailwindConfig,
    content: ["./index.html", "./src/**/*.{ts,tsx}", "../ui-kit/src/**/*.{ts,tsx}"],
};