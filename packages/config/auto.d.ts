import type { AutoEnvValue, AutoOptions } from './types.js';
export declare const auto: <T extends AutoEnvValue = string>(value: string, options?: AutoOptions) => T;
