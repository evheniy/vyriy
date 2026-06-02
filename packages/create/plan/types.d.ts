import type { Interface } from 'node:readline';
import type { Writable } from 'node:stream';
export type Question = (readline: Interface, output: Writable) => (query: string) => Promise<string>;
export type Prompt = (question: (query: string) => Promise<string>, label: string, defaultValue: string) => Promise<string>;
export type PlanResult = {
    name: string;
    description: string;
    target: string;
    preset: string;
    scope?: string;
};
export type Plan = (dirName: string, appPath: string) => Promise<PlanResult | undefined>;
