import type { ContentDataSection } from './content-data.js';
export type LlmTxtPage = {
    readonly description: string;
    readonly path: string;
    readonly title: string;
};
export type LlmTxtOptions = {
    readonly pages: readonly LlmTxtPage[];
    readonly sections: readonly ContentDataSection[];
};
export declare const renderLlmTxt: (options: LlmTxtOptions, siteUrl?: string) => string;
export declare const writeLlmTxt: (outputDirectory: string, options: LlmTxtOptions, siteUrl?: string) => Promise<void>;
