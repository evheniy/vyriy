export type VyriyCliCommand = {
    readonly type: 'new';
    readonly projectName?: string;
} | {
    readonly type: 'init' | 'doctor' | 'help' | 'version';
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => VyriyCliCommand;
