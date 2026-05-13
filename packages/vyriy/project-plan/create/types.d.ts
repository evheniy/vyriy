import { VyriyApiStyle, VyriyFeature, VyriyPreset, VyriyProjectPlan } from '../types.js';
import { VyriyCiPromptProvider } from '../ci/index.js';
export type CreateProjectPlanFromPresetOptions = {
    readonly projectName: string;
    readonly targetDirectory: string;
    readonly packageScope: string;
    readonly description: string;
    readonly preset: VyriyPreset;
    readonly features?: readonly VyriyFeature[];
    readonly apiStyle?: VyriyApiStyle;
    readonly ciProvider?: VyriyCiPromptProvider;
};
export type CreateProjectPlanFromPreset = (options: CreateProjectPlanFromPresetOptions) => VyriyProjectPlan;
