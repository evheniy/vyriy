export declare const isInsideDirectory: (directory: string, candidate: string) => boolean;
export declare const resolveRoot: (directory: string) => Promise<string>;
export declare const resolveExistingFile: (root: string, requestPath: string, index: false | string) => Promise<{
    filePath: string;
    modifiedTime: Date;
    size: number;
} | undefined>;
