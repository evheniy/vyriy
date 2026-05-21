import { ProjectFile } from '../../file-plan/index.js';
export declare const createPackageManifest: ({ dependencies, packageScope, peerDependencies, workspaceName, }: {
    readonly dependencies?: Record<string, string>;
    readonly packageScope: string;
    readonly peerDependencies?: Record<string, string>;
    readonly workspaceName: string;
}) => ProjectFile;
