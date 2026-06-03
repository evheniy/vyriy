export type Command = () => Promise<number>;
export type CheckBinCommand = {
    readonly type: 'check' | 'help' | 'version';
};
export type ParseCheckBinArgs = (args: readonly string[]) => CheckBinCommand;
export type CheckHelpText = (command?: string, alias?: false | string) => string;
export type RunCheckCli = (args?: readonly string[], command?: string, alias?: false | string) => Promise<void>;
export type EnvironmentCheckResult = {
    readonly ok: boolean;
    readonly message: string;
    readonly version?: string;
};
export type Node = () => EnvironmentCheckResult;
export type Corepack = () => Promise<EnvironmentCheckResult>;
export type ActivateYarnStable = () => Promise<EnvironmentCheckResult>;
export type Yarn = () => Promise<EnvironmentCheckResult>;
