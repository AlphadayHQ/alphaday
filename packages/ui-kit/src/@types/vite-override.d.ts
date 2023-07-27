declare module "*.svg" {
    const src: React.FC<React.SVGProps<SVGElement>>;
    export default src; // We can safely ignore the Duplicate identifier error it is an override
}
