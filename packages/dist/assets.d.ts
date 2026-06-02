import type { PackageJson } from './types.js';
export declare const copyReadme: (packageDirectory: string) => Promise<void>;
export declare const resolveSourceAgentsPath: (packageAgentsPath: string, sharedAgentsPath: string, rootAgentsPath: string) => Promise<string>;
export declare const copyAgents: (packageDirectory: string, rootPackageJson: PackageJson) => Promise<boolean>;
export declare const copyLicense: (packageDirectory: string) => Promise<void>;
