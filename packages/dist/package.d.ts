import type { PackageJson, Repository } from './types.js';
export declare const createPackageRepository: (rootPackageJson: PackageJson, packageDirectory: string) => Repository | undefined;
export declare const syncPackageRuntimeMetadata: (packageJson: PackageJson, rootPackageJson: PackageJson) => void;
export declare const distPackage: (packageJsonPath: string, rootPackageJson: PackageJson) => Promise<void>;
