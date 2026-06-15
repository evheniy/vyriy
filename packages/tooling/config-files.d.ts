import type { ConfigName } from './types.js';
export type ToolingConfigExtension = 'js' | 'ts';
export type ToolingConfigFilesOptions = {
    readonly extension?: ToolingConfigExtension;
    readonly names?: readonly ConfigName[];
    readonly storybookPreviewSpecifier?: 'extensionless' | 'js';
    readonly storybookPreviewStyleImport?: string;
    readonly storybookStories?: 'path' | 'relative';
    readonly storybookMainContent?: string;
    readonly storybookPreviewContent?: string;
    readonly storybookPreviewPath?: string;
};
export type ToolingConfigFileMap = Record<string, string>;
export declare const createToolingConfigFiles: (options?: ToolingConfigFilesOptions) => ToolingConfigFileMap;
