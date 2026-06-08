import type { ExportTarget, PackageJson } from './types.js';
export declare const getMissingExportTarget: (file: string, line: string) => Promise<string | undefined>;
export declare const removeMissingJavaScriptExports: (packageDirectory: string) => Promise<void>;
export declare const getJavaScriptFiles: (packageDirectory: string) => Promise<string[]>;
export declare const getPackageMain: (packageDirectory: string, packageJson: PackageJson, javaScriptFiles: string[]) => Promise<string | undefined>;
export declare const createExportTarget: (javaScriptFile: string) => ExportTarget;
export declare const createExports: (mainFile: string, javaScriptFiles: string[]) => Record<string, ExportTarget>;
