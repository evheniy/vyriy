export type Command = {
    readonly type: 'help' | 'version';
} | {
    readonly type: 'check' | 'config' | 'create' | 'dist' | 'static';
    readonly args: readonly string[];
} | {
    readonly type: 'unknown';
    readonly command: string;
};
export type ParseArgs = (args: readonly string[]) => Command;
export type Cli = (args?: readonly string[]) => Promise<void>;
export type ConfigName = 'eslint' | 'jest' | 'prettier' | 'storybook' | 'stylelint' | 'typescript';
export type ConfigCommand = {
    readonly dryRun: boolean;
    readonly force: boolean;
    readonly help: boolean;
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
