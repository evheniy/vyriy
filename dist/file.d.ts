export declare const hasFile: (filePath: string) => Promise<boolean>;
export declare const readJson: <Value>(filePath: string) => Promise<Value>;
export declare const writeJson: (filePath: string, value: unknown) => Promise<void>;
export declare const readFiles: (directory: string) => Promise<string[]>;
