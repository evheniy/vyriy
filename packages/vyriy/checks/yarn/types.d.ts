import { EnvironmentCheckResult } from '../node/index.js';
export type CheckYarnVersionOptions = {
    readonly version?: string;
    readonly minimumMajor?: number;
    readonly run?: () => Promise<string>;
};
export type CheckYarnVersion = (options?: CheckYarnVersionOptions) => Promise<EnvironmentCheckResult>;
