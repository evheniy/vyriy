export type PromptQuestion = (query: string) => Promise<string>;
export type PromptOutput = {
    write: (chunk: string) => unknown;
};
