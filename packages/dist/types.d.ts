export type Command = () => Promise<number>;
export type DistBinCommand = {
    readonly type: 'dist' | 'help' | 'version';
};
export type ParseDistBinArgs = (args: readonly string[]) => DistBinCommand;
export type DistHelpText = (command?: string, alias?: false | string) => string;
export type RunDistCli = (args?: readonly string[], command?: string, alias?: false | string) => Promise<void>;
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
    devDependencies?: unknown;
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
