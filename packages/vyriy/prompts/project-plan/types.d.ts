import { Readable, Writable } from 'node:stream';
import { VyriyApiStyle, VyriyCiPromptProvider, VyriyFeature, VyriyPreset, VyriyProjectPlan } from '../../project-plan/index.js';
export type PromptProjectPlanDefaults = {
    readonly projectName?: string;
    readonly targetDirectory?: string;
    readonly packageScope?: string;
    readonly description?: string;
    readonly preset?: VyriyPreset;
    readonly features?: readonly VyriyFeature[];
    readonly apiStyle?: VyriyApiStyle;
    readonly ciProvider?: VyriyCiPromptProvider;
};
export type PromptProjectPlanOptions = {
    readonly defaults?: PromptProjectPlanDefaults;
    readonly input?: Readable;
    readonly output?: Writable;
};
export type PromptProjectPlan = (options?: PromptProjectPlanOptions) => Promise<VyriyProjectPlan | undefined>;
