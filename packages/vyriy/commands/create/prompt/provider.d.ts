import type { PromptOutput, PromptQuestion } from './types.js';
export declare const provider: <OptionName extends string>(question: PromptQuestion, output: PromptOutput, label: string, options: Partial<Record<OptionName, unknown>>) => Promise<OptionName | undefined>;
