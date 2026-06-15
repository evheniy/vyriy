export type ConfigName = 'eslint' | 'jest' | 'prettier' | 'storybook' | 'stylelint' | 'typescript';
export type ConfigCommand = {
    readonly type: 'help' | 'version';
    readonly dryRun: boolean;
    readonly force: boolean;
    readonly names: readonly ConfigName[];
} | {
    readonly dryRun: boolean;
    readonly force: boolean;
    readonly names: readonly ConfigName[];
    readonly type: 'init' | ConfigName | 'unknown';
};
export type ConfigFile = {
    readonly path: string;
    readonly content: string;
};
export type ConfigTarget = {
    readonly files: readonly ConfigFile[];
    readonly name: ConfigName;
    readonly packageName: string;
};
export type ToolingHelpText = (command?: string, alias?: false | string) => string;
export type ParseConfigArgs = (args: readonly string[]) => ConfigCommand;
export type RunToolingCli = (args?: readonly string[], command?: string, alias?: false | string, cwd?: string) => Promise<void>;
