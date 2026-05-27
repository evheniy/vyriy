export type Command = () => Promise<number>;
export type EnvironmentCheckResult = {
    ok: boolean;
    message: string;
};
export type Node = () => EnvironmentCheckResult;
export type Corepack = () => Promise<EnvironmentCheckResult>;
export type Yarn = () => Promise<EnvironmentCheckResult>;
export type CreateOptions = {
    readonly directory: string;
    readonly dryRun: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
    readonly install: boolean;
    readonly verify: boolean;
};
export type Create = (options: CreateOptions) => Promise<number>;
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
