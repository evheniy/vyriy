export type Command = {
    readonly type: 'help' | 'version' | 'dist' | 'check';
} | {
    readonly type: 'static';
    readonly directory: string;
} | {
    readonly type: 'create';
    readonly directory: string;
    readonly dryRun: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
    readonly install: boolean;
    readonly verify: boolean;
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => Command;
export type Cli = (args?: readonly string[]) => Promise<void>;
