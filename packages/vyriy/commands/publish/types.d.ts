export type ExportTarget = {
    readonly default: string;
    readonly import: string;
    readonly types: string;
};
export type Repository = {
    readonly directory?: string;
    readonly type: string;
    readonly url: string;
};
export type PackageJson = {
    agents?: string;
    bin?: string | Record<string, string>;
    dependencies?: unknown;
    engines?: unknown;
    exports?: Record<string, ExportTarget>;
    license?: string;
    main?: string;
    name?: string;
    packageManager?: unknown;
    private?: boolean;
    repository?: Repository;
    scripts?: unknown;
    types?: string;
    workspaces?: unknown;
    [key: string]: unknown;
};
export type RunPublishCommandOptions = {
    readonly cwd?: string;
};
export type RunPublishCommand = (options?: RunPublishCommandOptions) => Promise<number>;
