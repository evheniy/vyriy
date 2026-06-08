export type CreateOptions = {
    readonly directory: string;
    readonly dryRun: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
    readonly install: boolean;
    readonly verify: boolean;
};
export type Create = (options: CreateOptions) => Promise<number>;
export type CreateBinCommand = {
    readonly type: 'help' | 'version';
} | ({
    readonly type: 'create';
} & CreateOptions);
export type ParseCreateBinArgs = (args: readonly string[]) => CreateBinCommand;
export type CreateHelpText = (command?: string, alias?: false | string) => string;
export type RunCreateCli = (args?: readonly string[], command?: string, alias?: false | string) => Promise<void>;
