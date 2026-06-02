import type { PromptQuestion } from './types.js';
export declare const scope: (question: PromptQuestion, preset: string, name: string) => Promise<string | undefined>;
