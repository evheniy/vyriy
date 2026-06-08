import type { PackageJson } from './types.js';
export declare const getPackageBinFiles: (packageJson: PackageJson) => string[];
export declare const removePackageBinDeclarationFiles: (packageDirectory: string, packageJson: PackageJson) => Promise<void>;
export declare const makePackageBinsExecutable: (packageDirectory: string, packageJson: PackageJson) => Promise<void>;
