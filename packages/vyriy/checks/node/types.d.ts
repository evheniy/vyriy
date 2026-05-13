export type EnvironmentCheckResult = {
    readonly ok: boolean;
    readonly name: string;
    readonly version?: string;
    readonly message: string;
};
export type CheckNodeVersionOptions = {
    readonly version?: string;
    readonly minimumMajor?: number;
};
export type CheckNodeVersion = (options?: CheckNodeVersionOptions) => EnvironmentCheckResult;
