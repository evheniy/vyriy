export type Command = {
    readonly type: 'help' | 'version' | 'dist' | 'check-env';
} | {
    readonly type: 'create';
    readonly directory: string;
    readonly dryRun: boolean;
    readonly overwrite: boolean;
    readonly skipExisting: boolean;
    readonly install: boolean;
    readonly verify: boolean;
};
export type ParseArgs = (args: readonly string[]) => Command;
export type Cli = (args?: readonly string[]) => Promise<void>;
