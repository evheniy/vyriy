export type VyriyCliCommand = {
    readonly type: 'new';
    readonly projectName?: string;
    readonly dryRun: boolean;
    readonly install: boolean;
    readonly yes: boolean;
    readonly overwrite: boolean;
    readonly verify: boolean;
    readonly skipExisting: boolean;
} | {
    readonly type: 'init';
    readonly dryRun: boolean;
    readonly install: boolean;
    readonly yes: boolean;
    readonly overwrite: boolean;
    readonly verify: boolean;
    readonly skipExisting: boolean;
} | {
    readonly type: 'doctor' | 'help' | 'version';
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => VyriyCliCommand;
