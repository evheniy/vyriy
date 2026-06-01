export declare const plan: (dirName: string, appPath: string) => Promise<{
    name: string;
    description: string;
    target: string;
    preset: "ssr" | "base" | "rest" | "api" | "library" | "gql" | "ssg" | "spa" | "mfe" | "fullstack";
    scope: string | undefined;
} | undefined>;
