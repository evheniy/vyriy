export type VyriyCliCommand = {
    readonly type: 'new';
    readonly projectName?: string;
    readonly dryRun: boolean;
    readonly yes: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
} | {
    readonly type: 'init';
    readonly dryRun: boolean;
    readonly yes: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
} | {
    readonly type: 'doctor' | 'help' | 'version';
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => VyriyCliCommand;
