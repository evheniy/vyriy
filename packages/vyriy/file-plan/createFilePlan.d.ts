import { FilePlanItem, FilePlanOptions, ProjectFile } from './types.js';
export declare const createFilePlan: (targetDirectory: string, files: readonly ProjectFile[], options?: FilePlanOptions & {
    readonly fileExists?: (filePath: string) => Promise<boolean>;
}) => Promise<FilePlanItem[]>;
