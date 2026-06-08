export type Package = {
    name: string;
    version: string;
    description: string;
    private?: boolean;
    type?: string;
    main?: string;
    types?: string;
    packageManager?: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    exports?: Record<string, unknown>;
    engines?: Record<string, string>;
    workspaces?: string[];
    [key: string]: unknown;
};
export type GetPackage = () => Package;
