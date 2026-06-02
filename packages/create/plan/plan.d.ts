export declare const plan: (dirName: string, appPath: string) => Promise<{
    name: string;
    description: string;
    target: string;
    preset: "ssr" | "base" | "library" | "api" | "rest" | "gql" | "ssg" | "spa" | "mfe" | "fullstack";
    scope: string | undefined;
} | undefined>;
