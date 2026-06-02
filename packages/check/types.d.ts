export type Command = () => Promise<number>;
export type EnvironmentCheckResult = {
    readonly ok: boolean;
    readonly message: string;
    readonly version?: string;
};
export type Node = () => EnvironmentCheckResult;
export type Corepack = () => Promise<EnvironmentCheckResult>;
export type ActivateYarnStable = () => Promise<EnvironmentCheckResult>;
export type Yarn = () => Promise<EnvironmentCheckResult>;
