export type Command = {
    readonly type: 'help' | 'version';
} | {
    readonly type: 'check' | 'create' | 'dist' | 'static' | 'tooling';
    readonly args: readonly string[];
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => Command;
export type Cli = (args?: readonly string[]) => Promise<void>;
