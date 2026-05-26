export declare const plan: (dirName: string, appPath: string) => Promise<{
    name: string;
    description: string;
    target: string;
    preset: "ssr" | "base" | "api" | "library";
    scope: string | undefined;
    ci: import("../preset/types.js").CiProvider | undefined;
    deploy: import("../preset/types.js").DeployProvider | undefined;
} | undefined>;
